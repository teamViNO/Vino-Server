import express from 'express';
import { updatePassword, viewUserInfo } from '../controllers/user.myPage.controller.js';

export const myPageRoute = express.Router();

myPageRoute.put('/updatePassword', updatePassword);
myPageRoute.get('/myInfo', viewUserInfo);
