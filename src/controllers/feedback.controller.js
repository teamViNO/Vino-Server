import {feedback, feedbackService} from '../services/feedback.service';
import jwt from 'jsonwebtoken';

export const feedbackController = async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.userId = decoded.id;

  const result = await feedbackService(req.userId, req.body.text);
  res.status(result.status).json(result);
};