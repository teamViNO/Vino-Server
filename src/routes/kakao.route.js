import express  from "express";
import { kakaoLogin } from "../controllers/kakao.controller";

export const kakaoRoute = express.Router();

kakaoRoute.get('/kakao-login',kakaoLogin);