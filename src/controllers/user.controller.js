import { registerService, loginService, setNicknameService,joinVideoAlarm,joinNoticeAlarm, viewAlarm,updateConfirm,removeAlarm} from '../services/user.service.js';
import { findUserByEmail } from '../models/user.dao.js';
import jwt from 'jsonwebtoken';

import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
// 회원가입 
export const register = async (req, res) => {
  try {
    const response = await registerService(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '서버 에러',
    });
  }
};

// 로긘
export const login = async (req, res) => {
  try {
    const response = await loginService(req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '서버 에러',
    });
  }
};

// 닉네임 디비에 추가

export const setNicknameController = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;

  const result = await setNicknameService(req.userId, req.body.nick_name);
  res.status(result.status).json(result);
};

// 이메일 중복 확인
export const checkEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: '이미 사용중인 이메일입니다.',
      });
    } else {
      return res.status(200).json({
        success: true,
        message: '사용 가능한 이메일입니다.',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: '서버 에러',
    });
  }
};


export const createVideoAlarm=async(req,res)=>{
  try {
  console.log("비디오 알림 추가를 요청하셨습니다.");
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  const data={
    'userId':req.userId,
    'status':req.params.status,
    'videoId':req.params.videoId
  }
  console.log("요청정보",req.body);
  res.send(response(status.SUCCESS,await joinVideoAlarm(req.body,data)))
  } catch (error) {
    console.error(error);
  }
  

}
export const createNoticeAlarm=async(req,res)=>{
  try {
  console.log("일반 알림 추가를 요청하셨습니다.");
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;
  
  console.log("요청정보",req.body);
  res.send(response(status.SUCCESS,await joinNoticeAlarm(req.body,req.userId)))
  } catch (error) {
    console.error(error);
  }
  
}
export const getAlarm=async(req,res,next)=>{
  try{
      console.log("일반 알림 추가를 요청하셨습니다.");
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
      res.send(response(status.SUCCESS,await viewAlarm(req.userId)));

  }catch(error){
    console.log(error);
  }
  
}
export const setConfirm=async(req,res)=>{
  try{
    console.log("알림 읽기를 요청하셨습니다.");
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const data={
      "userId":req.userId,
      "alarm_id":req.params.alarm_id
    }
    res.send(response(status.SUCCESS,await updateConfirm(data)));

  }catch(error){
    console.log(error);
  }
  
}
export const deleteAlarm=async(req,res)=>{
  try{
    console.log("알림 삭제를 요청하셨습니다.");
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const data={
      "userId":req.userId,
      "alarm_id":req.params.alarm_id
    }
    res.send(response(status.SUCCESS,await removeAlarm(data)));

  }catch(error){
    console.log(error);
  }
  
}