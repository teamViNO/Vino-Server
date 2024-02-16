import express from 'express';
import { feedbackController} from '../controllers/feedback.controller.js';


export const feedbackRoute = express.Router();

feedbackRoute.post('/feedback', feedbackController)

