import jwt from 'jsonwebtoken';
import { findUserByEmail, createUser, comparePassword } from '../models/user.dao.js';
import { findUserById, updatePassword} from '../models/user.dao.js';
import {addVideoAlarm,addNoticeAlarm,getAlarm,setConfirm,deleteAlarm} from '../models/user.dao.js';
import bcrypt from 'bcryptjs';
import { updateUserNickname } from '../models/user.dao.js';
import {joinAlarmResponseDto,getAlarmResponseDTO,updateConfirmResponseDTO,deleteAlarmResponseDTO} from '../dtos/user.dto.js'

// 일반 회원가입
export const registerService = async ({ name, birth_date, gender, phone_number, email, password, platform, checkPassword,theme, nickname }) => {
  const existingUser = await findUserByEmail(email);
  theme = "0";
  nickname ="";
  if (!(password == checkPassword)){
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
export const updatePasswordService = async (userId, { oldPassword, newPassword, confirmPassword }) => {
  const user = await findUserById(userId);

  if (!user) {
    return { status: 404, success: false, message: '사용자를 찾을 수 없습니다.' };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    return { status: 400, success: false, message: '기존 비밀번호가 일치하지 않습니다.' };
  }

  if (newPassword !== confirmPassword) {
    return { status: 400, success: false, message: '새 비밀번호가 일치하지 않습니다.' };
  }

  await updatePassword(userId, newPassword);
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