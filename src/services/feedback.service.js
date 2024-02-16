import { saveFeedback } from "../models/feedback.dao";

export const feedbackService = async (userId, text) => {
  // const today = new Date().toISOString().split('T')[0];
  
  // const feedbackCount = await getFeedbackCount(userId, today);
  
  // if (feedbackCount >= 3) {
  //   return { status: 400, success: false, message: '피드백 작성 3회 초과'};
  // }
  await saveFeedback(userId, text);
  return { status: 200, success: true, message: '피드백 작성 성공'};
}