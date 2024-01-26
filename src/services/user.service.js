import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, comparePassword } from '../models/user.dao.js';
import { findUserById, updatePassword, findUserByNamePhoneAndEmail,updateUserNickname} from '../models/user.dao.js';
import {addVideoAlarm,addNoticeAlarm,getAlarm,setConfirm,deleteAlarm} from '../models/user.dao.js';
import bcrypt from 'bcryptjs';
import {joinAlarmResponseDto,getAlarmResponseDTO,updateConfirmResponseDTO,deleteAlarmResponseDTO} from '../dtos/user.dto.js'
import nodemailer from 'nodemailer'

// 일반 회원가입
export const registerService = async ({ name, birth_date, gender, phone_number, email, password, platform, check_password,theme, nickname }) => {
  const existingUser = await findUserByEmail(email);
  theme = "0";
  nickname ="";
  if (!(password == check_password)){
    return { status: 409, success: false, message: '비밀번호가 일치하지 않습니다.'}
  }

  if (existingUser) {
    return { status: 409, success: false, message: '이미 사용중인 이메일입니다.' };
  }

  await createUser(name, birth_date, gender, phone_number, email, password, platform, theme);
  return { status: 201, success: true, message: '회원가입 성공' };
};

// 일반 로긘
export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return { status: 401, success: false, message: '이메일이 잘못되었습니다.' };
  }

  if (!await comparePassword(password, user.password)) {
    return { status: 401, success: false, message: '비밀번호가 잘못되었습니다.' };
  }
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); 
  return { status: 200, success: true, message: '로그인 성공', data: { token } };
};


// 비번 바꾸기
export const updatePasswordService = async (userId, { old_password, new_password, confirm_password }) => {
  const user = await findUserById(userId);

  if (!user) {
    return { status: 404, success: false, message: '사용자를 찾을 수 없습니다.' };
  }

  const isMatch = await bcrypt.compare(old_password, user.password);
  if (!isMatch) {
    return { status: 400, success: false, message: '기존 비밀번호가 일치하지 않습니다.' };
  }

  if (new_password !== confirm_password) {
    return { status: 400, success: false, message: '새 비밀번호가 일치하지 않습니다.' };
  }

  await updatePassword(userId, new_password);
  return { status: 200, success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
};


// 닉네임 추가

export const setNicknameService = async (userId, nickname) => {

    await updateUserNickname(userId, nickname);
    return { status: 200, success: true, message: '닉네임을 성공적으로 설정했습니다.' };
};

export const joinVideoAlarm=async(data,user)=>{
    const time =new Date
    const joinVideoAlarmData= await addVideoAlarm({
      'user_id':user.userId,
      'is_confirm': data.is_confirm,
      'created_at': time,
      'updated_at': time,
      'type': 'video',
      'content': data.content,
      'status':user.status,
      'video_id':user.videoId
    });
    console.log('데이터',joinVideoAlarmData);
    return joinAlarmResponseDto(joinVideoAlarmData);
}

export const joinNoticeAlarm=async(data,user)=>{
    const time = new Date
    const joinNoticeAlarmData = await addNoticeAlarm({
      'user_id':user,
      'is_confirm': data.is_confirm,
      'created_at': time,
      'updated_at': time,
      'type': 'notice',
      'content': data.content
    })
    console.log('데이터',joinNoticeAlarmData);
    return joinAlarmResponseDto(joinNoticeAlarmData);
}

export const  viewAlarm=async(user)=>{
  const getAlarmData=await getAlarm(user);
  console.log("알람정보: ",getAlarmData);
  return getAlarmResponseDTO(getAlarmData);
}

export const updateConfirm=async(data)=>{
  const updateConfirmData=await setConfirm(data);
  return updateConfirmResponseDTO(updateConfirmData);
}

export const removeAlarm=async(data)=>{
  const removeAlarmData=await deleteAlarm(data);
  return deleteAlarmResponseDTO(removeAlarmData);
}


// 임시 비밀번호 발급 -> 이메일로 전송
export const tempPasswordService = async (name, phone_number, email) => {
  const user = await findUserByNamePhoneAndEmail(name, phone_number, email);
  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  // 임시 비밀번호 생성 (영어 대소문자, 숫자 혼합)
  const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
  // 임시 비밀번호로 사용자 비밀번호 변경
  await updatePassword(user.id, tempPassword);

  // 이메일 전송을 위한 설정
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587, 
    auth: {
      user: process.env.EMAIL, // 이메일 전송을 위한 이메일 주소
      pass: process.env.EMAIL_PASSWORD, // 이메일 전송을 위한 이메일 비밀번호
    },
  });
  // 이메일 옵션 설정
  let mailOptions = {
    from: process.env.EMAIL, // 보내는 이메일 주소
    to: user.email, // 받는 이메일 주소
    subject: '[VI.NO] 임시 비밀번호 발급',
    html: `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          .email-container {
            max-width: 600px;
            margin: auto;
            padding: 20px;
            background-color: #f7f7f7;
            border-radius: 10px;
            box-shadow: 0px 0px 10px 2px rgba(0,0,0,0.1);
            font-family: Arial, sans-serif;
            color: #333;
          }
          .header {
            text-align: center;
            padding: 20px 0;
          }
          .content {
            margin: 20px 0;
            line-height: 1.5;
          }
          .footer {
            text-align: center;
            color: #888;
            padding: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <img src="https://your-logo-url.com/logo.png" alt="Company Logo" width="200">
          </div>
          <div class="content">
            <h2>안녕하세요, ${name}님</h2>
            <p>아래는 ${name}님의 임시 비밀번호입니다:</p>
            <p style="text-align: center; font-size: 22px; color: #2196F3; font-weight: bold;">${tempPassword}</p>
            <p>로그인 후에 바로 비밀번호를 변경해 주세요.</p>
          </div>
          <div class="footer">
            <p>이 이메일에 대해 문의사항이 있으시면 답장해 주세요.</p>
            <p>&copy; 2024 [VI.NO]</p>
          </div>
        </div>
      </body>
    </html>
  `
    // text: `${name}님의 임시 비밀번호는 ${tempPassword} 입니다.`,
  };
  // 이메일 전송
  await transporter.sendMail(mailOptions);

  return {
    success: true,
    message: '임시 비밀번호가 이메일로 전송되었습니다.',
  };
};