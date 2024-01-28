import express from 'express';
import {checkVerificationCode} from '../controllers/sms.controller.js';

export const smsRoute = express.Router();

// smsRoute.post('/sendSMS', sendVerificationCode);
smsRoute.post('/checkSMS', checkVerificationCode);
