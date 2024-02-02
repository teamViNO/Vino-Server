import { Billingconductor } from "aws-sdk";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { viewVideo,viewSimpleVideo,joinVideo,deleteVideo,  updateVideoService,deleteSelectVideo, viewTag,viewCategoryVideo} from "../services/video.service.js";
import  jwt  from "jsonwebtoken";

export const videoInfo=async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;

        console.log("비디오 정보 조회를 요청하셨습니다.",req.params);
        const data= {
            "userID":req.userId,
            "videoID":req.params.videoId,
            "version":req.params.version
        };
        console.log("요청정보",data);
        res.send(response(status.SUCCESS,await viewVideo(data)));
    }catch(error){
        console.error(error);
    }
}
export const videoSimpleInfo=async (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log("비디오 간편 정보 조회를 요청하셨습니다.");
        const data= {
            "userID":req.userId
        };
        console.log("요청정보",req.userId);
        res.send(response(status.SUCCESS,await viewSimpleVideo(data)));
    }catch(error){
        console.error(error);
    }
}
export const videoCategoryInfo=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log("비디오 카테고리 별 조회를 요청하셨습니다.");
        const data={
            "user_id":req.userId,
            "category_id":req.params.categoryId
        }
        res.send(response(status.SUCCESS,await viewCategoryVideo(data)));
    } catch (error) {
        console.error(error);
    }
}
export const videoInsert=async (req,res,next)=>{
    try{
        console.log("비디오 추가를 요청하셨습니다.");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data= {
            "userID":req.userId
        };
        console.log("요청정보",req.body);
        res.send(response(status.SUCCESS,await joinVideo(req.body,data)));
    }catch(error){
        console.error(error);
    }
}
export const videoDelete=async(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log("비디오 삭제를 요청하셨습니다");
        const data= {
            "userID":req.userId,
            "videoID":req.params.videoId
        };
        res.send(response(status.SUCCESS,await deleteVideo(data)))
    }catch(error){
        console.error(error)
    }
}
export const vidoeSelectDelete=async(req,res,next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log("비디오 선택 삭제를 요청하셨습니다");
        const data={
            "userId":req.userId,
            "videos":req.body.videos
        };
        res.send(response(status.SUCCESS,await deleteSelectVideo(data)));
    }catch(error){
        console.error(error);
    }
}

export const videoUpdate=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        console.log("비디오 수정을 요청하셨습니다.");
        console.log(req.body);
        const data= {
            "userID":req.userId,
            "videoID":req.params.videoId
        };
        console.log(data);
        res.send(response(status.SUCCESS,await updateVideoService(req.body,data)))
    } catch (error) {
        console.error(error)
    }
}
export const getEntireTag=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId
        };
        res.send(response(status.SUCCESS,await viewTag(data)));
    } catch (error) {
        console.error(error)
    }
   
}