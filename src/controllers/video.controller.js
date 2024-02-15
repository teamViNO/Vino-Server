import pkg from 'aws-sdk';
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";
import { viewVideo,viewSimpleVideo,insertCopyVideo,videoCategoryUpdate,viewRecentVideo,viewUnReadDummyVideo,insertSummmary,removeSummary,joinVideo,deleteVideo, insertDummyVideoRead, updateVideoService,deleteSelectVideo, viewTag,viewCategoryVideo} from "../services/video.service.js";
import  jwt  from "jsonwebtoken";

const { Billingconductor } = pkg;

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
        res.send(response(status.VIDEO_NOT_FOUND));
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
        res.send(response(status.BAD_REQUEST,error));
    }
}
export const getUnReadDummyVideo=async(req,res,next)=>{
    try {

        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId
        };
        
        res.send(response(status.SUCCESS,await viewUnReadDummyVideo(data)));
    } catch (error) {
        console.error(error);
        throw BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const videoCopy=async(req,res,next)=>{
    try {
        console.log("비디오 카테고리 수정을 요청하셨습니다.");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId,
            "categoryId":req.params.categoryId,
            "videoId":req.params.dummyVideoId
        };
        res.send(response(status.SUCCESS,await insertCopyVideo(data)));
    } catch (error) {
        console.error(error);
        throw BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const getDummyVideo=async(req,res,next)=>{
    try{
        

        console.log("비디오 정보 조회를 요청하셨습니다.",req.params);
        const data= {
            "userID":"41",
            "videoID":req.params.dummyVideoId,
            "version":"original"
        };
        console.log("요청정보",data);
        res.send(response(status.SUCCESS,await viewVideo(data)));
    } catch(error){
        console.error(error);
        throw BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const updateVideoCategory=async(req,res,next)=>{
    try {
        console.log("비디오 카테고리 수정을 요청하셨습니다.");
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId,
            "categoryId":req.params.categoryId,
            "videoId":req.body.video_id
        };
        res.send(response(status.SUCCESS,await videoCategoryUpdate(data)));
    } catch (error) {
        console.error(error);
        throw BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const getAllDummyVideo=async(req,res,next)=>{
    try {
        const data={
            "userID":"41"
        }
        console.log("요청정보",req.userId);
        res.send(response(status.SUCCESS,await viewSimpleVideo(data)));
    } catch (error) {
        console.error(error);
        res.send(response(status.BAD_REQUEST,error));
    }
    
}
export const getRecentVideo=async(req,res,next)=>{
    try {const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log("비디오 간편 정보 조회를 요청하셨습니다.");
    const data= {
        "userID":req.userId
    };
    console.log("요청정보",req.userId);
    res.send(response(status.SUCCESS,await viewRecentVideo(data)));
        
    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
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
        res.send(response(status.BAD_REQUEST,error));
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
        res.send(response(status.BAD_REQUEST,error));
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
        res.send(response(status.BAD_REQUEST,error));
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
        res.send(response(status.BAD_REQUEST,error));
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
        res.send(response(status.BAD_REQUEST,error));
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
        res.send(response(status.BAD_REQUEST,error));
    }
   
}
export const dummyVideoRead=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId,
            "videoId":req.params.videoId
        }
        res.send(response(status.SUCCESS,await insertDummyVideoRead(data)));
    } catch (error) {
        console.error(error);   
        res.send(response(status.BAD_REQUEST,error));
    }
}
export const summaryDelete=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId,
            "summaryId":req.params.summaryId
        }
        res.send(response(status.SUCCESS,await removeSummary(data)));
    } catch (error) {
        console.error(error);   
        res.send(response(status.BAD_REQUEST,error));
    }
}
export const summaryInsert=async(req,res,next)=>{
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id;
        const data={
            "userId":req.userId,
            "videoId":req.params.videoId,
            "content":req.body.content
        }
        res.send(response(status.SUCCESS,await insertSummmary(data)));
    } catch (error) {
        console.error(error);   
        res.send(response(status.BAD_REQUEST,error));
    }
}