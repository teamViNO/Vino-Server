import pkg from 'solapi';
const {SolapiMessageService} = pkg;
import {createCode, findCode, deleteCode, findPhoneNumber} from '../models/sms.dao';
import jwt from 'jsonwebtoken'

export const sendVerificationCode= async (req, res)=>{
  let codecheck;
  try {
    const { phone_number } = req.body;
    const checkPhone = await findPhoneNumber(phone_number);
    if (checkPhone) {
      return res.status(400).json({
        success: false,
        code: 'DUPLICATE_PHONE_NUMBER',
        message: '중복된 전화번호입니다.',
      });
    }
    const messageService = new SolapiMessageService(process.env.SMS_KEY, process.env.SMS_SECRET);

    // 인증코드 생성
    const verificationCode = Math.floor(1000000 + Math.random() * 9000000); // 7자리
  
    const code = await createCode(verificationCode);
    const token = jwt.sign({ id: code.id }, process.env.JWT_SECRET); 
    codecheck = verificationCode
    // 단일 발송 예제
    messageService.sendOne({
      to: phone_number,
      from: process.env.SMS_PHONE,
      text: '[VI.NO] 인증 코드: ' + verificationCode,
    }).then(res => console.log(res));

    res.status(200).json({
      success: true,
      message: '인증 코드 전송 성공',
      result: {token}
    });
  }catch (error) {
    console.log(error);}

};

// 인증코드 확인
export const checkVerificationCode= async (req, res)=>{
  try {
    const userCode = req.body.verification_code;
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: '토큰이 제공되지 않았습니다.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const serverCodeObj = await findCode(req.userId);
    const serverCode = serverCodeObj.verification_code;
  if (userCode === serverCode) {
    await deleteCode(req.userId);
    res.status(200).json({
      success: true,
      code: "CORRECT_CODE",
      message: '인증 코드가 일치합니다.',
    });
  } else {
    res.status(401).json({
      success: false,
      code: "WRONG_CODE",
      message: '인증 코드가 일치하지 않습니다.',
    });
  }
  } catch (error) {
    res.status(403).json({
      success: false,
      message: '인증 코드가 전송이 제대로 되지 않았습니다'
    });
    }
};