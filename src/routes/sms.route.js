import express from 'express';
import {checkVerificationCode } from '../controllers/sms.controller.js';

export const smsRoute = express.Router();


smsRoute.post('/checkSMS', checkVerificationCode);
