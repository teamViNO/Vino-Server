import express from 'express';
import { updatePassword, viewUserInfo, changeInfo } from '../controllers/user.myPage.controller.js';

export const myPageRoute = express.Router();

myPageRoute.put('/updatePassword', updatePassword);
myPageRoute.get('/myInfo', viewUserInfo);
myPageRoute.put('/setInfo', changeInfo);
