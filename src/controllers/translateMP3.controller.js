//tlanslateMP3.controller.js 에서는 클라이언트로부터 받은 유튜브 비디오 URL을 통해 MP3 파일로 변환하는 작업을 수행합니다.
import { convertVideoToAudio } from '../services/translateToMP3.service.js';
import { checkFileExistsInStorage } from '../services/storage.service.js';
import { uploadFileToStorage } from '../services/storage.service.js';
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

export const convertMP3 = async (req, res) => {
    try{

        //video Id  가져오기
        const videoUrl = req.query.v ?? ''; // 또는 req.body.v, 요청 방식에 따라 변경

        console.log("Received video URL:", videoUrl); // 로그로 확인

        const videoId = await extractYouTubeVideoId(encodeURI(videoUrl));

        // Object Storage에서 해당 MP3 파일이 존재하는지 확인
        const mp3Exists = await checkFileExistsInStorage(process.env.OBJECT_STORAGE_BUCKET_NAME, `${videoId}.mp3`);

        //mp3가 없다면 파일 변환
        if (!mp3Exists) {
            const audioFilePath = await convertVideoToAudio(videoId); // MP3 파일 변환
            await uploadFileToStorage(audioFilePath); // 파일 업로드 후 로컬파일 삭제
            
            res.send(response(status.SUCCESS,{
                message: 'MP3 변환 완료',progress: '25' ,nextEndPoint: '/video/speech', videoId: videoId 
            }));
            
        }
        else{
            res.send(response(status.SUCCESS,{
                message: 'MP3가 이미 존재합니다!',progress: '25' ,nextEndPoint: '/video/summary', videoId: videoId} 
            ));
           
        }


    }catch (error) {
        res.send(response(status.BAD_REQUEST({
            message: 'Error in converting to MP3', error: error.toString()
        })))
       
        console.log(error);
    }
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