
import CoolsmsMessageService from "coolsms-node-sdk";





// export const sendVerificationCode=(req, res)=>{
//   const { phone_number } = req.body;

//   const messageService= new CoolsmsMessageService(process.env.COOLSMS_KEY, process.env.COOLSMS_SECRET);

//   // 인증코드 생성
//   const verificationCode = Math.floor(1000000 + Math.random() * 9000000); // 7자리

//   // 세션에 인증 코드와 만료 시간 저장
//   req.session.verification_code = {
//     code: verificationCode,
//     expires: Date.now() + 1000 * 60 * 5  // 5분 후 만료
//   };  

//   // 단일 발송 예제
//   messageService.sendOne({
//     to: phone_number,
//     from: process.env.SMS_PHONE,
//     text: '[VI.NO] 인증 코드: ' + verificationCode,
//   }).then(res => console.log(res));

//   // 인증 코드를 응답에 포함시켜 반환
//   res.status(200).json({
//     success: true,
//     message: '인증 코드 전송 성공',
//     verificationCode
//   });
// };

// 인증코드 확인
export const checkVerificationCode=(req, res)=>{
  try {
    console.log(req.session);
  const userCode = req.body.verification_code;
  console.log(userCode);
  const serverCode = req.session.verification_code.code; // 저장된 인증코드 가져오기
  if (userCode === serverCode) {
    res.status(200).json({
      success: true,
      message: '인증 코드가 일치합니다.',
    });
  } else {
    res.status(401).json({
      success: false,
      message: '인증 코드가 일치하지 않습니다.',
    });
  }
  } catch (error) {
    res.status(403).json({
      success: false,
      message: '인증 코드가 전송이 제대로 되지 않았습니다'
    });
    }
  
};

