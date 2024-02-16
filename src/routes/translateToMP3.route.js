//translateToMP3.route.js
import express from 'express';
import { processVideo } from '../controllers/summary.controller.js';
import { speechresult } from '../controllers/summary.controller.js';

export const translateToMP3 = express.Router();

// YouTube 링크를 처리하는 라우트

translateToMP3.get('/result', speechresult);
translateToMP3.get('/', processVideo);
