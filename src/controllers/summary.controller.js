// src/controllers/summary.controller.js
import { convertVideoToAudio } from '../services/translateToMP3.service.js';
import { uploadFileToStorage } from '../services/storage.service.js';
import { recognizeFromObjectStorage } from '../services/speech.service.js';
import { getSummary, getTitle } from '../services/chatGPT.service.js';
import { sendProgress } from '../services/progress.service.js';
import { readFileFromObjectStorage } from '../services/storage.service.js';
import { checkFileExistsInStorage } from '../services/storage.service.js';
import { getScriptFileName } from '../services/storage.service.js';
import { chatGPTCall } from '../services/chatGPT.service.js';
import getYoutubeTitle from 'get-youtube-title';

export const processVideo = async (req, res) => {
    try {
        //사용자에게 입력받을 video ID 변수

        const token = req.cookies['tempToken'];

        const videoUrl=req.query.v ?? '';
        console.log(encodeURI(videoUrl));
        const videoId = await extractYouTubeVideoId(encodeURI(videoUrl));
        
        if(!token) {
            return res.status(401).send("비정상 접근입니다.");
        }

        const id =videoId;
        console.log("id",id);
        let videoTitle="";

        getYoutubeTitle(videoId,async function(err,title){
            videoTitle=title;
        })

        const clientId = token;

        // Object Storage에서 해당 MP3 파일이 존재하는지 확인
        const mp3Exists = await checkFileExistsInStorage(process.env.OBJECT_STORAGE_BUCKET_NAME, `${videoId}.mp3`);

        //mp3가 없다면 파일 변환
        if (!mp3Exists) {
            const audioFilePath = await convertVideoToAudio(videoId); // MP3 파일 변환
            await uploadFileToStorage(audioFilePath); // 파일 업로드 후 로컬파일 삭제
            sendProgress(clientId, '음성파일 변환 완료.', 25);
            
        }

        // Object Storage에서 스크립트 파일 이름 가져오기
        const scriptFileName = await getScriptFileName(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, videoId);

        if (scriptFileName) {
            // 스크립트 파일이 이미 존재하면 해당 데이터 사용
            const jsonData = await readFileFromObjectStorage(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, scriptFileName);
            sendProgress(clientId, '스크립트 불러오기 완료', 50);

            const scriptText = jsonData.text;
            const timeStampData=[];
            for(let i=0;i<jsonData.segments.length;i++){
                timeStampData.push({
                    "start_time":jsonData.segments[i].start/1000,
                    "end_time":jsonData.segments[i].end/1000,
                    "text":jsonData.segments[i].text
                })
            }
            console.log("시간데이터 있는 데이터",timeStampData);
            console.log(scriptText);

            const summaryResult = await getSummary(scriptText);
            console.log("요약데이터",summaryResult);
            sendProgress(clientId, '요약 불러오기 완료', 75);
            // const startSummaryIndex = summaryResult.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
            // console.log("찾은 인덱스",startSummaryIndex);
            // const trimmedSummaryResponse = summaryResult.substring(startSummaryIndex);
            const summaryData=JSON.parse(summaryResult);
            console.log("summary json 데이터",summaryData);
            //gpt 데이터
            const gptResponse = await chatGPTCall(scriptText);
            sendProgress(clientId, '서비스 완료', 100);
            const startIndex = gptResponse.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
            const trimmedResponse = gptResponse.substring(startIndex);
            const gptData=JSON.parse(trimmedResponse);

            console.log(gptResponse);

            //유튜브 제목 요약
            const titleData=await getTitle(videoTitle);
            console.log("제목 요약한것",titleData);
            const titleJsonData=JSON.parse(titleData.replace("/",""));

            //맵핑
            const data=await timeStampMapping(gptData,timeStampData);
            console.log("돌아온 데이터",data);
            console.log(summaryData.video_name);
            const tagData=await splitTag(gptData.tag);
            const YoutubeUploadTime=new Date();
            const finalData={
                "title":titleJsonData.Title,
                "youtube_created_at":YoutubeUploadTime,
                "link":"https://www.youtube.com/watch?v="+videoId,
                "description":summaryData.video_name[0].name,
                "subheading":data,
                "summary":summaryData.Summary,
                "tag":tagData
            }
            
            res.status(200).json({
                message: 'File processed successfully using existing data',
                finalData
            });

        } else {
            // 스크립트 파일이 없으면 Clova Speech API 호출
            console.log('Script file not found. Recognizing from audio file');

            const recognitionResult = await recognizeFromObjectStorage(`${videoId}.mp3`);

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

export const speechresult = async (req, res) => {
    try {
        const clientId = req.query.clientId;
        const resultData = req.body;
        const scriptText = resultData.text;
        sendProgress(clientId, '스크립트 불러오기 완료', 50);

        const timeStampData=[];
        for(let i=0;i<jsonData.segments.length;i++){
            timeStampData.push({
                "start_time":jsonData.segments[i].start/1000,
                "end_time":jsonData.segments[i].end/1000,
                "text":jsonData.segments[i].text
            })
        }

        console.log("시간데이터 있는 데이터",timeStampData);
        console.log(scriptText);

        const summaryResult = await getSummary(scriptText);
        console.log("요약데이터",summaryResult);
        sendProgress(clientId, '요약 불러오기 완료', 75);
        // const startSummaryIndex = summaryResult.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
        // console.log("찾은 인덱스",startSummaryIndex);
        // const trimmedSummaryResponse = summaryResult.substring(startSummaryIndex);
        const summaryData=JSON.parse(summaryResult);
        console.log("summary json 데이터",summaryData);
        
        const gptResponse = await chatGPTCall(scriptText);
        sendProgress(clientId, '서비스 완료', 100);
        const startIndex = gptResponse.indexOf('{'); // 첫 번째 '{'의 인덱스 찾기
        const trimmedResponse = gptResponse.substring(startIndex);
        const gptData=JSON.parse(trimmedResponse);
        console.log(gptResponse);
        const data=await timeStampMapping(gptData,timeStampData);
        console.log("돌아온 데이터",data);
        console.log(summaryData.video_name);
        const finalData={
            "title":videoTitle,
            "link":"https://www.youtube.com/watch?v="+videoId,
            "description":summaryData.video_name[0].name,
            "subheading":data,
            "summary":summaryData.Summary,
            "tag":gptData.tag
        }
        
        res.status(200).json({
            message: 'File processed successfully using existing data',
            finalData
        });


    }
    catch (error) {
        res.status(500).json({ message: 'Error in processing video', error: error.toString() });
    }

};