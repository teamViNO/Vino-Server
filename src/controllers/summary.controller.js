// src/controllers/summary.controller.js
import { convertVideoToAudio } from '../services/translateToMP3.service.js';
import { uploadFileToStorage } from '../services/storage.service.js';
import { recognizeFromObjectStorage } from '../services/speech.service.js';
import { getSummary } from '../services/summary.service.js';
import { updateProgress } from '../services/progress.service.js';
import { readFileFromObjectStorage } from '../services/storage.service.js';
import { checkFileExistsInStorage } from '../services/storage.service.js';
import { getScriptFileName } from '../services/storage.service.js';
import { chatGPTCall } from '../services/chatGPT.service.js';


export const processVideo = async (req, res) => {
    try {
        //사용자에게 입력받을 video ID 변수
        const videoId = req.params.videoId;

        // Object Storage에서 해당 MP3 파일이 존재하는지 확인
        const mp3Exists = await checkFileExistsInStorage(process.env.OBJECT_STORAGE_BUCKET_NAME, `${videoId}.mp3`);

        //mp3가 없다면 파일 변환
        if (!mp3Exists) {
            const audioFilePath = await convertVideoToAudio(videoId); // MP3 파일 변환
            updateProgress(videoId, 'Converting to MP3', 25);
            
            await uploadFileToStorage(audioFilePath); // 파일 업로드 후 로컬파일 삭제
            updateProgress(videoId, 'Uploading MP3 to Storage', 50);
        }

        // Object Storage에서 스크립트 파일 이름 가져오기
        const scriptFileName = await getScriptFileName(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, videoId);

        if (scriptFileName) {
            // 스크립트 파일이 이미 존재하면 해당 데이터 사용
            const jsonData = await readFileFromObjectStorage(process.env.OBJECT_STORAGE_BUCKET_SUMMARY_NAME, scriptFileName);
            updateProgress(videoId, 'Fetching Script from Storage', 75);

            const scriptText = jsonData.text;
            
            //const summaryResult = await getSummary(scriptText);
            updateProgress(videoId, 'Summarizing Script', 100);

            //console.log(summaryResult);

            const response = await chatGPTCall(scriptText);

            console.log(scriptText);
            console.log(response);
            

            res.status(200).json({
                message: 'File processed successfully using existing data',
                response
            });
        } else {
            // 스크립트 파일이 없으면 Clova Speech API 호출
            console.log('Script file not found. Recognizing from audio file');
            
            const recognitionResult = await recognizeFromObjectStorage(`${videoId}.mp3`);
            
            updateProgress(videoId, 'Recognizing Script', 75);

            const scriptText = recognitionResult.text; 
            console.log(scriptText);
            //const summaryResult = await getSummary(scriptText);
            updateProgress(videoId, 'Summarizing Script', 100);

            const response = await chatGPTCall(scriptText);

            
            console.log(response);

            res.status(200).json({
                message: 'File processed successfully after new processing',
                response,
                
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in processing video', error: error.toString() });
    }
};