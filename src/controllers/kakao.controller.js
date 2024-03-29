import { getKakaoUserInfo } from "../services/kakao.service";

export const kakaoLogin = async function(req, res) {
  try {
    const code = req.query.code;
    const data = await getKakaoUserInfo(code);
    return res.status(200).json(data);
  } catch(e) {
      console.log(e);
      res.status(400).end('Sorry, Login Error!');
  }
}