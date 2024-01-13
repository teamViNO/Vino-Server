import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { viewVideo} from "../services/video.service.js";

export const videoInfoOrigin=async (req,res,next)=>{
    try{
        console.log("비디오 정보 조회를 요청하셨습니다.");
        const data= req.params;
        console.log("요청정보",req.params);
        res.send(response(status.SUCCESS,await viewVideo(data)));
    }catch(error){
        console.error(error);
    }
}