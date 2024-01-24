import express from 'express';
import { updatePassword } from '../controllers/user.myPage.controller.js';

export const myPageRoute = express.Router();

myPageRoute.put('/updatePassword', updatePassword);

