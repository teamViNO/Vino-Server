const express = require('express');
const {sendVerificationCode, checkVerificationCode} = require('../controllers/sms.controller.cjs');
const router = express.Router();

router.post('/sendSMS', sendVerificationCode);
router.post('/checkSMS', checkVerificationCode);
module.exports = router;