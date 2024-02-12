import { getKakaoUserInfo } from "../services/kakao.service";

export const kakaoLogin = async function(req, res) {
  try {
    const code = req.query.code;
    let host = req.headers.host;
    console.log(host);
    if (host == 'vi-no.site') {
      host = 'http://vi-no.site/social-account'
    }
    else {
      host = 'https://www.vi-no.site/social-account'
    }
    const data = await getKakaoUserInfo(code, host);
    return res.status(200).json(data);
  } catch(e) {
      console.log(e);
      res.status(400).end('Sorry, Login Error!');
  }
}