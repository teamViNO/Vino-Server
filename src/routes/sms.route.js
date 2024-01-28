import express from 'express';
import { sendVerificationCode,checkVerificationCode } from '../controllers/sms.controller.js';

export const smsRoute = express.Router();

smsRoute.post('/sendSMS', async(req,res)=>{
const result =sendVerificationCode(req,res);
} );
smsRoute.post('/checkSMS', checkVerificationCode);
