//translateToMP3 라우트 정의
import express from 'express';
import { processVideo } from '../controllers/summary.controller.js';

export const translateToMP3 = express.Router();

// YouTube 링크를 처리하는 라우트
translateToMP3.get('/v=:videoId', processVideo);
