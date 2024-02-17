// index.js
import express from 'express';
import { specs } from './config/swagger.config.js';
import SwaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';

import { v4 as uuidv4 } from 'uuid';
import { response } from './config/response.js';
import { BaseError } from './config/error.js';
import { status } from './config/response.status.js';
import { healthRoute } from './src/routes/health.route.js';
import { videoRoute } from './src/routes/video.route.js';
import { s3Router } from './src/routes/s3.route.js';
import { userRoute } from './src/routes/user.route.js';
import { myPageRoute } from './src/routes/user.myPage.route.js';
import { smsRoute } from './src/routes/sms.route.js';
import session from 'express-session';
import { dummyRoute } from './src/routes/dummy.route.js';
import { searchRoute } from './src/routes/search.route.js';
import { categoryRoute } from './src/routes/category.route.js';

import { kakaoRoute } from './src/routes/kakao.route.js';
import { feedbackRoute } from './src/routes/feedback.route.js';
import { translateToMP3 } from './src/routes/translateToMP3.route.js';





dotenv.config();    // .env 파일 사용 (환경 변수 관리)

const app = express();

// server setting - veiw, static, body-parser etc..
app.set('port', process.env.PORT || 3000)   // 서버 포트 지정


const corsOptions = {
    origin: ["https://www.vi-no.site", "http://vi-no.site", "http://localhost:5173", "https://vi-no.site"],
    optionsSuccessStatus: 200,
    credentials: true,// 응답 헤더에 Access-Control-Allow-Credentials 추가
};

app.use(cors(corsOptions)); // 옵션을 추가한 CORS 미들웨어 추가
                     // cors 방식 허용
app.use(express.static('public'));          // 정적 파일 접근
app.use(express.json());                    // request의 본문을 json으로 해석할 수 있도록 함 (JSON 형태의 요청 body를 파싱하기 위함)
app.use(express.urlencoded({ extended: false })); // 단순 객체 문자열 형태로 본문 데이터 해석
app.use(session({
    secret: process.env.SESSION_KEY, // 이곳에는 고유한 키를 입력하세요.
    resave: false,
    saveUninitialized: true
}));
app.use('/api-docs', SwaggerUi.serve, SwaggerUi.setup(specs));
app.use('/sms', smsRoute);
app.use('/health', healthRoute);
app.use('/videos', videoRoute);
app.use('/images', s3Router);
app.use('/user', userRoute);
app.use('/user/myPage', myPageRoute);
app.use('/dummies', dummyRoute);
app.use('/search', searchRoute);
app.use('/category', categoryRoute);

app.use(kakaoRoute);
app.use(feedbackRoute);

app.use('/search', searchRoute);
app.use('/video', translateToMP3); // script 라우트 적용

app.use(cookieParser()); // 쿠키 파서 미들웨어

app.get('/', generateTempToken, (req, res) => {
    
})


// error handling
app.use((req, res, next) => {
    const err = new BaseError(status.NOT_FOUND);
    next(err);
});


app.use((err, req, res, next) => {
    // 템플릿 엔진 변수 설정
    res.locals.message = err.message;
    // 개발환경이면 에러를 출력하고 아니면 출력하지 않기
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    console.error(err);
    res.status(err.data.status || status.INTERNAL_SERVER_ERROR).send(response(err.data));
});

app.listen(app.get('port'), () => {
    console.log(`Example app listening on port ${app.get('port')}`);
});



// 임시 토큰 생성 및 쿠키 저장 미들웨어
function generateTempToken(req, res, next) {
    // 임시 토큰 생성 (여기서는 간단히 예시를 위한 토큰을 생성합니다)
    const uniqueId = uuidv4(); // 'uuid' 모듈의 v4 함수를 사용하여 UUID 생성
    const tempToken = jwt.sign({ userId: uniqueId }, process.env.JWT_SECRET);

    // 토큰 정보를 JSON 형태로 응답
    res.status(200).json({ status: 200, success: true, message: '임시토큰이 발행되었습니다.', result: { tempToken }});

}

