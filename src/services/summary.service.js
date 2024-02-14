// src/services/summary.Service.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SUMMARY_API_KEY = process.env.CLOVA_SUMMARY_API_KEY; // CLOVA Summary API 키
const SUMMARY_SECRET_KEY = process.env.CLOVA_SUMMARY_SECRET_KEY; // CLOVA Summary API 시크릿 키

export const getSummary = async (text) => {
  try {
    const response = await axios.post(
      'https://naveropenapi.apigw.ntruss.com/text-summary/v1/summarize',
      {
        document: {
          content: text
        },
        option: {
          language: 'ko',
          summaryCount: 5, // 요약할 문장 수
          tone: 2
          // 필요한 경우 다른 옵션들도 추가
        }
      },
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': SUMMARY_API_KEY,
          'X-NCP-APIGW-API-KEY': SUMMARY_SECRET_KEY,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error in getting summary:', error);
    throw error;
  }
};
