import axios from 'axios';
import { createUserKakao } from '../models/user.dao';
import  jwt  from 'jsonwebtoken';
import { addWelcomeAlarm } from '../models/user.dao';
import { createDefaultCategory } from '../models/user.dao';

export const getKakaoUserInfo = async function(code) {
    // Access token 가져오기
    const res1 = await axios.post('https://kauth.kakao.com/oauth/token', {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        params:{
            grant_type: 'authorization_code',
            client_id: process.env.KAKAO_CLIENT_ID,
            code,
            redirect_uri: 'https://www.vi-no.site/social-account'
        }
    });

    // Access token을 이용해 정보가져오기
    const res2 = await axios.post('https://kapi.kakao.com/v2/user/me', {}, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'Bearer ' + res1.data.access_token
        }
    });

    const data = res2.data;
    const user = {
        id: data.id,
        name: data.properties.nickname,
        email: data.kakao_account.email,
        platform: 'kakao',
        birth_date: '0000-00-00',
        gender: '',
        phone_number: '',
        theme: '0',
        nick_name: ''
    };

    const existingUser = await findUser(user.id); // 사용자가 이미 존재하는지 확인하는 함수
    if (existingUser) { // 사용자가 이미 존재한다면,
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); 
        return { status: 200, success: true, message: '로그인 성공', result: { token } };
    }

    const newUser = await createUserKakao(user);
    const time = new Date;
    const alarmdata={
        'user_id':user.id,
        'title': user.name+"님 반가워요!",
        'is_confirm': false,
        "created_at": time,
        "updated_at": time,
        "content": '이제부터 어떻게 vino를 사용하면 좋을지 소개해드릴게요 :)',
        "type": "notice"
    }
    
      // // 환영 인사 알림 추가
    await addWelcomeAlarm(alarmdata);
    
    const categoryData1={
        "user_id":user.id,
        "name":"전체",
        "created_at": time
    }
       // // 기본 카테고리 생성
    const category = await createDefaultCategory(categoryData1);
    
    const categoryData2={
        "user_id": user.id,
        "name":"기본",
        "top_category": category.id,
        "created_at": time
    };
    
    await createDefaultCategory(categoryData2);
    
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET); 
    return { status: 200, success: true, message: '로그인 성공', result: { token } };
};