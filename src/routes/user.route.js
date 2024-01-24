import express from 'express';
import { register, login, setNicknameController, checkEmail } from '../controllers/user.controller.js';

export const userRoute = express.Router();

userRoute.post('/join', register);
userRoute.post('/login', login);
userRoute.put('/nickname', setNicknameController)
userRoute.post('/checkEmail', checkEmail)