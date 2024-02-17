import { recognizeFromObjectStorage } from '../services/speech.service.js';
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

export const callClovaSpeech = async (req, res) => {
    try {
        //video Id  가져오기
        const videoId = req.body.videoId;

        const recognitionResult = await recognizeFromObjectStorage(`${videoId}.mp3`);
        res.send(response(status.SUCCESS,{ status: 200, success: true, message: '음성인식 완료', progress: '50' ,nextEndPoint: '/video/summary', videoId: videoId}));
        


    } catch (error) {
        res.send(response(status.BAD_REQUEST,{ message: 'Error in speeching API', error: error.toString() }));
        
    }
}
