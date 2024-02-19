import express from 'express';
import {sendVerificationCode,checkVerificationCode, sendVerificationCode2} from '../controllers/sms.controller.js';

export const smsRoute = express.Router();

smsRoute.post('/sendSMS', sendVerificationCode);
smsRoute.post('/sendSMS-find', sendVerificationCode2);
smsRoute.post('/checkSMS', checkVerificationCode);
