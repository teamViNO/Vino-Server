import { recognizeFromObjectStorage } from '../services/speech.service.js';


export const callClovaSpeech = async (req, res) => {
    try {
        //video Id  가져오기
        const videoId = req.body.videoId;

        const recognitionResult = await recognizeFromObjectStorage(`${videoId}.mp3`);
        res.status(200).json({ status: 200, success: true, message: '음성인식 완료', progress: '50' ,nextEndPoint: '/video/summary' });


    } catch (error) {
        res.status(500).json({ message: 'Error in speeching API', error: error.toString() });
    }
}
