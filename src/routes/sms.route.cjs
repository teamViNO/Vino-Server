const express = require('express');
const {sendVerificationCode, checkVerificationCode} = require('../controllers/sms.controller.cjs');
const smsRouter = express.Router();

smsRouter.post('/sendSMS', sendVerificationCode);
smsRouter.post('/checkSMS', checkVerificationCode);

module.exports = smsRouter;