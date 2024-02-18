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
    `Step 1. Look at the example Json given with the original script and give it to me in json. "subheading" is to break up the paragraphs of the given script according to the subtopics. The name of subheading is the title of the subtopic, and subheading.content should keep the original script divided according to the subtopic. subheading.name and subheading.content should be different. Add the contents in subheading together and we need to divide them so that the original script comes out. This subheading should be able to be at least 1 to highest 10 and contain all of the divided scripts. "tag" is the keyword for the overall scripts. Please indicate at least 2 to 5. The result should be in Korean. You need to have the above conditions and give them to the Json example below
    {
    
    "subheading": [
    {
    "name": "Subtitle 1",
    "start_time": "script1 start time,"
    "end_time": "script 1 end time",
    "content": "script 1"
    },{
    "name": "Subtitle 2",
    "start_time": "script2 start time,"
    "end_time": "script 2 end time",
    "content": "script 2"
    }
    
    ],
    "tag": [
    {
    "name": "Tag 1"
    },
    {
    "name": "Tag 2"
    },
    {
    "name": "Tag 3"
    }
    ]
    }
`;
    
    const prompt = `Run this script from step 1 , Make sure to fulfill the condition given to the system promport. original script: ${scriptText}\n ` ;
    

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
    return generatedText;
  } catch (error) {
    console.error('Error calling ChatGPT API:', error);
    throw error;
  }
  
}
export const getSummary = async (scriptText) => {
  try {
    // ChatGPT에 전달할 프롬프트를 구성합니다.
    const system_prompt = 
    `Proceed with a summary of the original text. Extract the core content from the full text, the summary should contain conclusions about the content, and there should be a total of 5 summaries of the core content. video_name.name is the title of the script. There should be 1 total. The responses should come in Korean, and the format of the summary should be in the form of a closing noun. Also, make sure to give it in the form of json below

    Exception: If the script content does not exceed 5 lines, extract one summary of the core content.

    {
      "Summary": [
        {
         "content": "content"
        },
        {
         "content": "content"
        },
        {
         "content": "content"
        },
        {
         "content": "content"
        },
        {
         "content": "content"
        }
        ...
      ]

      "video_name": [
        {
          "name" : "name"
        }
      ]
    }
`;
    
    const prompt = `Run this script from step 1 , Make sure to fulfill the condition given to the system promport, response to korean. original script: ${scriptText}\n ` ;
    

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
