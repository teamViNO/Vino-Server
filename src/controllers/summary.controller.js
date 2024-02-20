// src/controllers/summary.controller.js
import { fineTunningData, getSummary, getTitle } from '../services/chatGPT.service.js';
import { readFileFromObjectStorage } from '../services/storage.service.js';
import { getScriptFileName } from '../services/storage.service.js';
import { chatGPTCall } from '../services/chatGPT.service.js';
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import axios from 'axios';
import { isScript } from '../models/video.dao.js';
import { viewVideo } from '../services/video.service.js';


export const summary = async (req, res) => {
    try {

        //사용자에게 입력받을 video ID 변수
        const videoId=req.body.videoId;
        
        const isScriptData="https://www.youtube.com/embed/"+videoId;
        const isScriptResult=await isScript(isScriptData);
        console.log("찾기여부",isScriptResult[0]);
        if (!(isScriptResult[0] && Array.isArray(isScriptResult[0]) && isScriptResult[0].length >0)) {
            const responseData = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`);
            console.log( responseData.data.items[0]?.snippet);
        
            const videoTitle=responseData.data.items[0]?.snippet.title;
            const youtubeDate=responseData.data.items[0]?.snippet.publishedAt;
            

            // Object Storage에서 스크립트 파일 이름 가져오기
            const scriptFileName = await getScriptFileName(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, videoId);

            if (scriptFileName) {
                // 스크립트 파일이 이미 존재하면 해당 데이터 사용
                const jsonData = await readFileFromObjectStorage(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, scriptFileName);

                const scriptText = jsonData.text;
                const timeStampData=[];
                for(let i=0;i<jsonData.segments.length;i++){
                    timeStampData.push({
                        "start_time":jsonData.segments[i].start/1000,
                        "end_time":jsonData.segments[i].end/1000,
                        "text":jsonData.segments[i].text
                    })
                }
                //console.log("시간데이터 있는 데이터",timeStampData);
                // const tempResult=await fineTunningData(JSON.stringify(timeStampData));
                console.log(scriptText);

                const summaryResult = await getSummary(scriptText);
                //console.log("요약데이터",summaryResult);
                // const startSummaryIndex = summaryResult.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
                // console.log("찾은 인덱스",startSummaryIndex);
                // const trimmedSummaryResponse = summaryResult.substring(startSummaryIndex);
                const summaryData=JSON.parse(summaryResult);
                console.log("summary json 데이터",summaryData);
                //gpt 데이터
                const gptResponse = await chatGPTCall(scriptText);
                console.log("gpt받아온 데이터",gptResponse);
                const startIndex = gptResponse.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
                const trimmedResponse = gptResponse.substring(startIndex);
                const gptData=JSON.parse(trimmedResponse);

            

                // //유튜브 제목 요약
                // const titleData=await getTitle(videoTitle);
                

                //맵핑
                const data=await timeStampMapping(gptData,timeStampData);
                console.log("돌아온 데이터",data);
                console.log(summaryData.video_name);
                const tagData=await splitTag(gptData.tag);
                

                //데이터 가공
                const finalData={
                    "title":videoTitle,
                    "youtube_created_at":youtubeDate,
                    "link":"https://www.youtube.com/embed/"+videoId,
                    "description":summaryData.video_name[0].name,
                    "subheading":data,
                    "summary":summaryData.Summary,
                    "tag":tagData
                }
                res.send(response(status.SUCCESS,{
                    message: 'File processed successfully using existing data',
                    finalData
                }));
                

            } else {
                // 스크립트 파일이 없으면 오류 호출
                res.status(404).json({ message: 'Script file not found' });
            }
        }else{
            const data= {
                "userID":"41",
                "videoID":isScriptResult[0][0].id,
                "version":"original"
            };
            const result= await viewVideo(data);
            const subHeadingData=[]
            const summaryData=[]
            const tagData=[]
            console.log(result);
            for(let i=0; i<result.subHeading.length;i++){
                subHeadingData.push({
                    "name":result.subHeading[i].name,
                    "start_time":result.subHeading[i].start_time,
                    "end_time":result.subHeading[i].end_time,
                    "content":result.subHeading[i].content
                })
            }
            for(let i=0; i<result.summary.length;i++){
                summaryData.push({
                    "content":result.summary[i].content,
                    
                })
            }
            for(let i=0; i<result.tag.length;i++){
                tagData.push({
                    "name":result.tag[i].name,
                })
            }
            const finalData={
                "title":result.title,
                "youtube_created_at":result.youtube_created_at,
                "link":"https://www.youtube.com/embed/"+videoId,
                "description":result.description,
                "subheading":subHeadingData,
                "summary":summaryData,
                "tag":tagData
            }
            res.send(response(status.SUCCESS,{
                message: 'File processed successfully using existing data',
                finalData
            }));
        }
        
        
    } catch (error) {
        res.status(500).json({ message: 'Error in processing video', error: error.toString() });
        console.log(error);
    }
};
async function splitTag(tag){
    const data=[];
    for(let i=0;i<tag.length;i++){
        if(tag[i].name.replace(" ","").length<=8){
            data.push({"name":tag[i].name.replace(" ","")});
        }
    }
    return data;
}
async function extractYouTubeVideoId(url) {
    
    const params = url.split('?')[1].split('&');
    for (let param of params) {
      const [key, value] = param.split('=');
      if (key === 'v') {
        return value;
      }
    }
    return null;
  }
async function timeStampMapping(gptResponse, timeStampData) {
    
    const subheadingData = [];
    
    try {
        let sequence=0;
        console.log("데이터", timeStampData);
        console.log("subheading 길이",gptResponse.subheading.length);
        console.log("타임길이",timeStampData.length);
        for(let i = 0; i < gptResponse.subheading.length; i++) {
            let startTime = -1;
            let endTime = -1;
            console.log("타임데이터 순서",sequence);
            for(let j = sequence; j < timeStampData.length; j++) {
                // console.log("소제목데이터",gptResponse.subheading[i]);
                // console.log("타임스탬프 데이터",timeStampData[j]);
                // console.log("찾기 결과",gptResponse.subheading[i].content.indexOf(timeStampData[j].text));
                if(i===0&&j===0){
                    startTime=timeStampData[0].start_time
                }else if(gptResponse.subheading[i].content.includes(timeStampData[j].text) && startTime === -1) {
                    startTime = timeStampData[j].start_time;
                } else if (!gptResponse.subheading[i].content.includes(timeStampData[j].text) && startTime !== -1) {
                    endTime = timeStampData[j - 1].end_time;
                    subheadingData.push({
                        name: gptResponse.subheading[i].name,
                        start_time: startTime,
                        end_time: endTime,
                        content: gptResponse.subheading[i].content
                    });
                    sequence=j;
                    break;
                }else if(gptResponse.subheading[i].content.includes(timeStampData[j].text)&&j===timeStampData.length-1){
                    //마지막 문구
                    endTime = timeStampData[j].end_time;
                    subheadingData.push({
                        name: gptResponse.subheading[i].name,
                        start_time: startTime,
                        end_time: endTime,
                        content: gptResponse.subheading[i].content
                    });
                    sequence=j;
                    break;
                    
                }else{
                    
                }
            }
        }
        console.log("매핑한 데이터", subheadingData);
        return subheadingData;
    } catch (error) {
        console.error(error);
    }
}
