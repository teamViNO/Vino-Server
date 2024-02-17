//translateToMP3.route.js
import express from 'express';
import { summary } from '../controllers/summary.controller.js';
import { convertMP3 } from '../controllers/translateMP3.controller.js';
import { callClovaSpeech } from '../controllers/speech.controller.js';

export const translateToMP3 = express.Router();

// YouTube 링크를 처리하는 라우트

//mp3 변환
translateToMP3.post('/', convertMP3);

// clova speech 호출
translateToMP3.post('/speech', callClovaSpeech);

// 요약 진행
translateToMP3.get('/summary', summary);
