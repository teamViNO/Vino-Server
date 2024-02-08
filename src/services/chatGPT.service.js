// src/services/chatGPTService.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ChatGPT API 호출을 위한 함수, 주어진 스크립트로부터 5개의 소제목과 내용을 추출하여 JSON 형식으로 반환
export const chatGPTCall = async (scriptText) => {
  try {
    // ChatGPT에 전달할 프롬프트를 구성합니다.
    const system_prompt = 
    `Step1. It must have three keywords and must be in either word or phrase form. The maximum word length must be 10 characters long and must be about a topic. Keywords must be words that are directly mentioned in the original script or words that contain content. and answer to korean,Only one content comes in one title. and Return using json method. ex) Keywords: ["keyword1", "keyword2", "keyword3"]
    
    Step2. Divide the original script into paragraphs 
    Condition 1 of Step 2. Please respond using Json method ex) script1: ~, script2: ~
    condition of Step2. When all the scripts given in response are combined, they should be the same as the original script.
    Condition 2 of Step 2. Divide paragraphs based on contents.
    Condition 3 of Step 2. Divide paragraphs whenever contents are distinguished.
    Condition 4 of Step 2. All script must be at least 500 character lengths and must contain all the content of the script and must not be modified or summarized.
    Condition 6 of Step 2. The number of scripts can be from 1 to 30, depending on the amount of original script
    

    Step3. Make a title for each paragraph you divide
    Condition 1 of Step 3. Please respond using Json method ex) title1: ~, title2: ~
    Condition 2 of Step 3. Extract the 1 sentence of the core topic from the separated paragraph.
    
`;
    
    const prompt = `Run this script from step 1 to step 3, Make sure to fulfill the condition given to the system promport. original script: ${scriptText}\n ` ;
    

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo-16k",
        messages: [
          {"role": "system", "content": system_prompt},
          {"role": "user", "content": prompt}
        ]
      },
      {
        headers: {  
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    // API 응답에서 생성된 텍스트 추출
    const generatedText = response.data.choices[0].message.content.trim();

    // 생성된 텍스트를 JSON 객체로 변환
    // 이 부분에서는 생성된 텍스트가 원하는 JSON 형식을 따른다고 가정합니다.
    // 실제 구현에서는 생성된 텍스트의 형식을 확인하고, 필요에 따라 추가 처리가 필요할 수 있습니다.
    
    /*
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(generatedText);
    } catch (error) {
      console.error('Failed to parse generated text to JSON:', generatedText);
      throw error;
    }
    */

    return generatedText;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
};
