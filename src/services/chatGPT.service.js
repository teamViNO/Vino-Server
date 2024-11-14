// src/services/chatGPTService.js
import axios from 'axios';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

// ChatGPT API 호출을 위한 함수, 주어진 스크립트로부터 5개의 소제목과 내용을 추출하여 JSON 형식으로 반환
export const chatGPTCall = async (scriptText) => {
  try {
    // ChatGPT에 전달할 프롬프트를 구성합니다.
    const system_prompt = 
    `Convert the given Korean script into JSON format, meeting the following requirements.1. **Structure**: The result should follow this JSON format:
   {
     "subheading": [
       {
         "name": "Subheading 1",
         "content": "Script text matching the subheading"
       },
       {
         "name": "Subheading 2",
         "content": "Script text matching the subheading"
       }
     ],
     "tag": [
       {
         "name": "Tag 1"
       },
       {
         "name": "Tag 2"
       }
     ]
   }`;
    
    const prompt = `Run this script from step 1 , Make sure to fulfill the condition given to the system promport. original script: ${scriptText}\n ` ;
    
    console.log("프롬프트",prompt);
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
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
    console.log("챗지피티 데이터",generatedText);
    return generatedText;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
};


export const getTitle=async(title)=>{
  console.log("유튜브제목",title);
  try {
    const system_prompt='Step 1. Please summarize the title in one sentence when you receive the title. It should be given in Korean. Please give it in this json format '+
    '{'+
    '"Title": The original title summarized in one sentence'+
    '}'

    const prompt=` Please summarize the title in one sentence when you receive the title. It should be given in Korean. Please give it in this json format
    { "title":"original title summary"} original title: ${title}\n `
    

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
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
    return generatedText;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
  
}
export const getSummary = async (scriptText) => {
  try {
    const system_prompt = 
    `Proceed with a summary of the original text. Extract the core content from the full text, and provide exactly 5 key summaries of the content in Korean. Each summary should reflect the main conclusions of the content, written in the form of a closing noun. If the script content does not exceed 5 lines, extract only one summary of the core content.

Respond in the following JSON format. Note that the "Summary" field is an array with five elements, each representing one key summary, and "video_name" is a single object with the title as its value.

{
  "Summary": [
    {
      "content": "First key summary"
    },
    {
      "content": "Second key summary"
    },
    {
      "content": "Third key summary"
    },
    {
      "content": "Fourth key summary"
    },
    {
      "content": "Fifth key summary"
    }
  ],
  "video_name": {
    "name": "Title of the video"
  }
}
`;
    
    const prompt = `Run this script from step 1 , Make sure to fulfill the condition given to the system prompt, response to Korean. original script: ${scriptText}\n `;
    
    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-4o",
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

    const generatedText = response.data.choices[0].message.content.trim();
    console.log(generatedText)
    const cleanedText = cleanResponse(generatedText);
    return cleanedText;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
};

export const fineTunningData = async (script)=>{
  try {
    
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY
    })
    
    const result= await openai.completions.create({
      prompt: script,
      model:"ft:davinci-002:personal::8sC2Qcki",
      max_tokens :8000
    })
    console.log("스크립트",result);
  } catch (error) {
    console.log(error);
  }
}

export const cleanResponse = (response) => {
  // 문자열의 길이와 인덱스를 초기화합니다.
  let index = 0;
  const length = response.length;

  // 첫 번째 '{' 문자가 나올 때까지 인덱스를 증가시킵니다.
  while (index < length && response[index] !== '{') {
    index++;
  }

  // 인덱스가 문자열 길이보다 작다면 '{'를 찾은 것이므로 해당 위치부터 문자열을 잘라냅니다.
  let cleanedResponse = '';
  if (index < length) {
    cleanedResponse = response.slice(index);
  } else {
    // '{' 문자를 찾지 못한 경우 에러를 발생시킵니다.
    throw new Error('No opening brace "{" found in the response.');
  }

  // 문자열에서 ``` 문자를 제거합니다.
  cleanedResponse = cleanedResponse.replace(/```/g, '');

  // JSON.parse로 문자열을 JSON 객체로 변환합니다.
  let jsonResponse;
  try {
    jsonResponse = JSON.parse(cleanedResponse);
  } catch (error) {
    console.error('Failed to parse cleaned response to JSON:', cleanedResponse);
    throw error;
  }

  return jsonResponse;
};