import { updatePasswordService } from '../services/user.service.js';
import { getUserInfo } from '../models/user.dao.js';
import jwt from 'jsonwebtoken';

export const updatePassword = async (req, res) => {
  try {
    // 토큰 확인
    const token = req.headers.authorization.split(' ')[1]; // 헤더에서 토큰을 추출합니다.
    if (!token) return res.status(403).json({ success: false, message: '토큰이 제공되지 않았습니다.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const response = await updatePasswordService(req.userId, req.body);
    return res.status(response.status).json(response);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '서버 에러',
    });
  }
};

// 유저 정보 반환
export const viewUserInfo = async(req, res) => {
  try{
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(403).json({ success: false, message: '토큰이 제공되지 않았습니다.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    const result = await getUserInfo(req.userId);
    return res.status(200).json(result);

  }catch(error){
    console.log(error);
    return res.status(500).json({
      success: false,
      message: '서버 에러',
    });
  }
}