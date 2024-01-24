import { registerService, loginService, setNicknameService} from '../services/user.service.js';
import { findUserByEmail } from '../models/user.dao.js';
import jwt from 'jsonwebtoken';

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
