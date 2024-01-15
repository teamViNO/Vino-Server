import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { viewVideo,viewSimpleVideo,joinVideo} from "../services/video.service.js";

export const videoInfo=async (req,res,next)=>{
    try{
        console.log("비디오 정보 조회를 요청하셨습니다.");
        const data= req.params;
        console.log("요청정보",req.params);
        res.send(response(status.SUCCESS,await viewVideo(data)));
    }catch(error){
        console.error(error);
    }
}
export const videoSimpleInfo=async (req,res,next)=>{
    try{
        console.log("비디오 간편 정보 조회를 요청하셨습니다.");
        const data= req.params;
        console.log("요청정보",req.params);
        res.send(response(status.SUCCESS,await viewSimpleVideo(data)));
    }catch(error){
        console.error(error);
    }
}
export const videoInsert=async (req,res,next)=>{
    try{
        console.log("비디오 추가를 요청하셨습니다.");
        const data= req.params;
        console.log("요청정보",req.body);
        res.send(response(status.SUCCESS,await joinVideo(req.body,data)));
    }catch(error){
        console.error(error);
    }
}