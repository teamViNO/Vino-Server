import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, comparePassword, updateInfo, deleteAllAlarm } from '../models/user.dao.js';
import { findUserById, updatePassword, findUserByNamePhoneAndEmail,updateUserNickname} from '../models/user.dao.js';
import {addVideoAlarm,addNoticeAlarm,getAlarm,setConfirm,deleteAlarm} from '../models/user.dao.js';
import bcrypt from 'bcryptjs';
import {joinAlarmResponseDto,getAlarmResponseDTO,updateConfirmResponseDTO,deleteAlarmResponseDTO, deleteAllAlarmResponseDTO} from '../dtos/user.dto.js'
import nodemailer from 'nodemailer'

// 일반 회원가입
export const registerService = async ({ name, birth_date, gender, phone_number, email, password, platform, check_password,theme, nickname }) => {
  const existingUser = await findUserByEmail(email);
  theme = "0";
  nickname ="";
  if (!(password == check_password)){
    return { status: 409, success: false, code:'WRONG_PASSWORD', message: '비밀번호가 일치하지 않습니다.'}
  }

  if (existingUser) {
    return { status: 409, success: false, code:'UNAVAILABLE_EMAIL', message: '이미 사용중인 이메일입니다.' };
  }

  await createUser(name, birth_date, gender, phone_number, email, password, platform, theme);
  return { status: 201, success: true, message: '회원가입 성공' };
};

// 일반 로긘
export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  if (!user) {
    return { status: 404, success: false, code:"NOT_FOUND_EMAIL", message: '이메일이 잘못되었습니다.' };
  }

  if (!await comparePassword(password, user.password)) {
    return { status: 400, success: false, code:"WRONG_PASSWORD",message: '비밀번호가 잘못되었습니다.' };
  }
  
  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); 
  return { status: 200, success: true, message: '로그인 성공', result: { token } };
};


// 비번 바꾸기
export const updatePasswordService = async (userId, { old_password, new_password, confirm_password }) => {
  const user = await findUserById(userId);

  if (!user) {
    return { status: 404, success: false, code:'NOT_FOUND_USER', message: '사용자를 찾을 수 없습니다.' };
  }

  const isMatch = await bcrypt.compare(old_password, user.password);
  if (!isMatch) {
    return { status: 400, success: false, code:'WRONG_ORIGIN_PASSWORD', message: '기존 비밀번호가 일치하지 않습니다.' };
  }

  if (new_password !== confirm_password) {
    return { status: 400, success: false, code:'WRONG_NEW_PASSWORD', message: '새 비밀번호가 일치하지 않습니다.' };
  }

  await updatePassword(userId, new_password);
  return { status: 200, success: true, message: '비밀번호가 성공적으로 변경되었습니다.' };
};


// 닉네임 추가

export const setNicknameService = async (userId, nickname) => {

    await updateUserNickname(userId, nickname);
    return { status: 200, success: true, message: '닉네임을 성공적으로 설정했습니다.' };
};

// 닉네임 , 성별 변경
export const setInfoService = async(nickname, gender, userId) => {
  await updateInfo(nickname, gender, userId);
  return { status: 200, success: true, message: '닉네임과 성별을 성공적으로 변경하였습니다.' };
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

export const removeAllAlarm=async(data)=>{
  const removeAlarmData=await deleteAllAlarm(data);
  return deleteAllAlarmResponseDTO(removeAlarmData);
}



// 임시 비밀번호 발급 -> 이메일로 전송
export const tempPasswordService = async (name, phone_number, email) => {
  const user = await findUserByNamePhoneAndEmail(name, phone_number, email);
  if (!user) {
    return { status: 404, success: false, code:'NOT_FOUND_USER', message: '사용자를 찾을 수 없습니다.' };
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
    text: `${name}님의 임시 비밀번호는 ${tempPassword} 입니다.`,
  };
  // 이메일 전송
  await transporter.sendMail(mailOptions);

  return {
    success: true,
    message: '임시 비밀번호가 이메일로 전송되었습니다.',
  };
};