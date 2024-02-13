// src/controllers/summary.controller.js
import { convertVideoToAudio } from '../services/translateToMP3.service.js';
import { uploadFileToStorage } from '../services/storage.service.js';
import { recognizeFromObjectStorage } from '../services/speech.service.js';
import { getSummary } from '../services/chatGPT.service.js';
import { sendProgress } from '../services/progress.service.js';
import { readFileFromObjectStorage } from '../services/storage.service.js';
import { checkFileExistsInStorage } from '../services/storage.service.js';
import { getScriptFileName } from '../services/storage.service.js';
import { chatGPTCall } from '../services/chatGPT.service.js';


export const processVideo = async (req, res) => {
    try {
        //사용자에게 입력받을 video ID 변수
        const videoId = req.params.videoId;
        
        const clientId = req.query.clientId;

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

            console.log(scriptText);

            const summaryResult = await getSummary(scriptText);
            sendProgress(clientId, '요약 불러오기 완료', 75);

            console.log(summaryResult);

            const gptResponse = await chatGPTCall(scriptText);
            sendProgress(clientId, '서비스 완료', 100);

            console.log(gptResponse);

            res.status(200).json({
                message: 'File processed successfully using existing data',
                gptResponse,
                summaryResult
            });

        } else {
            // 스크립트 파일이 없으면 Clova Speech API 호출
            console.log('Script file not found. Recognizing from audio file');

            const recognitionResult = await recognizeFromObjectStorage(`${videoId}.mp3`);

        }
    } catch (error) {
        res.status(500).json({ message: 'Error in processing video', error: error.toString() });
    }
};


export const speechresult = async (req, res) => {
    try {
        const clientId = req.query.clientId;
        const resultData = req.body;
        const scriptText = resultData.text;
        sendProgress(clientId, '스크립트 불러오기 완료', 50);

        //소제목 추출
        const summaryResult = await getSummary(scriptText);
        //const summaryResultJson = JSON.parse(summaryResult);
        
        sendProgress(clientId, '요약 불러오기 완료', 75);

        //문단 나누기
        const gptResponse = await chatGPTCall(scriptText);
        //const gptResponseJson = JSON.parse(gptResponse);
        sendProgress(clientId, '서비스 완료', 100);
        

        res.status(200).json({
            message: 'File processed successfully using existing data',
            gptResponse,
            summaryResult
        });

    }
    catch (error) {
        res.status(500).json({ message: 'Error in processing video', error: error.toString() });
    }

};