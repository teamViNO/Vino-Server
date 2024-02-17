// src/services/speech.service.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const CLOVA_SPEECH_API_KEY = process.env.CLOVA_SPEECH_API_KEY;
const CLOVA_SPEECH_INVOKE_URL = process.env.CLOVA_SPEECH_INVOKE_URL;
const CLOVA_SPEECH_CALLBACK_URL = process.env.OBJECT_STORAGE_ENDPOINT;


export const recognizeFromObjectStorage = async (objectStorageDataKey, language = 'ko-KR') => {
    const requestBody = {
        dataKey: objectStorageDataKey, // 인식을 원하는 파일의 ObjectStorage 경로에 접근하기 위한 Key
        language,
        completion: 'async',
        callback: 'http://backend.vi-no.site/video/result', // 결과를 받을 콜백 URL, 필요하다면 제공
        resultToObs: true, // 결과를 Object Storage에 저장할지 여부
        noiseFiltering: true, // 노이즈 필터링 적용 여부
        wordAlignment: true, // 단어 정렬 정보 포함 여부
        fullText: true, // 전체 인식 결과 텍스트를 출력할지 여부
    };

    try {
        const response = await axios.post(`${CLOVA_SPEECH_INVOKE_URL}/recognizer/object-storage`, requestBody, {
            headers: {
                'X-CLOVASPEECH-API-KEY': CLOVA_SPEECH_API_KEY,
                'Content-Type': 'application/json'
            }
        });
        console.log("스크립트화된 데이터",response.data);
        return response.data;
    } catch (error) {
        console.error('Error in recognizing from object storage:', error);
        throw error;
    }
};
