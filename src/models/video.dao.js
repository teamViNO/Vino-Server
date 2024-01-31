import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {getVideoSql,getEntireVideoSql,getSubHeadingSql,getSummarySql,getTagSql,insertVideoOriginSql,insertVideoRevisionSql,connectSubheading,connectSummary,connectTag,connectVideoTag,deleteVideoTagSql,deleteTagSql,deleteSubheadingSql,deleteSummarySql,deleteVideoSql,updateVideoSql,updateSummarySql,updateSubheadingSql,setTimeSql, entireTagSql} from "../models/video.sql.js"



export const setReadTime=async(data,time)=>{
    const conn =await pool.getConnection();
    const [video] =await pool.query(setTimeSql,[time,data.videoID]);
    conn.release();
}

export const getVideo=async (req) =>{
    try {
        console.log("dao에서 받아온 정보",req);
        const conn = await pool.getConnection();
        const [video]= await pool.query(getVideoSql,[req.videoID,req.userID,req.version]);
        console.log("비디오값",video[0]);
        conn.release();
        return video;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
export const getSimpleVideo=async (req)=>{
    try{
        const conn =await pool.getConnection();
        const [video]=await pool.query(getEntireVideoSql,[req.userID])
        conn.release();
        return video;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
export const getSubHeading=async (req) =>{
    try {
        
        const conn = await pool.getConnection();
        const [subHeading]= await pool.query(getSubHeadingSql,[req.videoID,req.version]);
        console.log("소제목값",subHeading);
        conn.release();
        return subHeading;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
export const getSummary=async (req) =>{
    try {
        const conn = await pool.getConnection();
        const [summary]= await pool.query(getSummarySql,[req.videoID,req.version]);
        console.log("요약값",summary);
        conn.release();
        return summary;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}
export const getTag=async (req) =>{
    try {
        const conn = await pool.getConnection();
        const [tag]= await pool.query(getTagSql,[req.videoID,req.version]);
        conn.release();
        return tag;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const addVideo=async (req) =>{
    try{
        console.log();
        const conn =await pool.getConnection();
        const videoOriginal = await pool.query(insertVideoOriginSql,['original',req.title,req.link,req.image,req.youtube_created_at,req.created_at,req.readed_at,req.updated_at,req.category_id,req.user_id]);
        const videoRevision = await pool.query(insertVideoRevisionSql,[videoOriginal[0].insertId,'revision',req.title,req.link,req.image,req.youtube_created_at,req.created_at,req.readed_at,req.updated_at,req.category_id,req.user_id]);
        conn.release();
        return videoOriginal[0].insertId;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

export const setSubheading=async (subHeading)=>{
    try{
        const conn = await pool.getConnection();
        const subHeadingOriginal = await pool.query(connectSubheading,[subHeading.name,subHeading.start_time,subHeading.end_time,subHeading.content,subHeading.video_id,'original']);
        const subHeadingRevision = await pool.query(connectSubheading,[subHeading.name,subHeading.start_time,subHeading.end_time,subHeading.content,subHeading.video_id,'revision']);
        conn.release();
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

export const setSummary=async (summary)=>{
    try{
        const conn = await pool.getConnection();
        const subHeadingOriginal = await pool.query(connectSummary,[summary.content,summary.video_id,'original']);
        const subHeadingRevision = await pool.query(connectSummary,[summary.content,summary.video_id,'revision']);
        conn.release();
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};

export const setTag=async (tag)=>{
    try{
        const conn = await pool.getConnection();
        const tagData=await pool.query(connectTag,[tag.name]);
        const tagVideoOriginal = await pool.query(connectVideoTag,[tag.video_id,tagData[0].insertId,'original']);
        const tagVideoRevision = await pool.query(connectVideoTag,[tag.video_id,tagData[0].insertId,'revision']);
        conn.release();
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};
export const updateSummary=async (summary)=>{
    try{
        const conn = await pool.getConnection();
        const summaryData= await pool.query(updateSummarySql,[summary.content,summary.id,summary.video_id]);
        conn.release();
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};
export const updateSubheading=async (subheading)=>{
    try{
        const conn = await pool.getConnection();
        const subheadingData= await pool.query(updateSubheadingSql,[subheading.name,subheading.content,subheading.id,subheading.video_id,]);
        conn.release();
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
};
export const updateVideo=async (video)=>{
    try{
        console.log("비디오",video);
        const conn = await pool.getConnection();
        const videoData= await pool.query(updateVideoSql,[video.title,video.readed_at,video.updated_at,video.category_id,video.id]);
        conn.release();
        return video.id;
    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const dropVideo=async (data)=>{
    try{
        console.log("삭제 요청 : ",data.videoID);
        const conn = await pool.getConnection();
        const deleteVideoTag= await pool.query(deleteVideoTagSql,[data.videoID]);
        const deleteSummary= await pool.query(deleteSummarySql,[data.videoID]);
        const deleteSubheading= await pool.query(deleteSubheadingSql,[data.videoID]);
        const deleteVideo= await pool.query(deleteVideoSql,[data.videoID]);
        conn.release();
        return "success";

    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const dropSelectedVideo=async (user,video)=>{
    try{
        console.log("삭제 요청 : ",video);
        const conn = await pool.getConnection();
        const deleteVideoTag= await pool.query(deleteVideoTagSql,[video]);
        const deleteSummary= await pool.query(deleteSummarySql,[video]);
        const deleteSubheading= await pool.query(deleteSubheadingSql,[video]);
        const deleteVideo= await pool.query(deleteVideoSql,[video]);
        conn.release();
        return "success";

    }catch(err){
        console.error(err);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}

export const getEntireTag=async(req)=>{
    try {
        const conn=await pool.getConnection();
        const [getTagData]= await pool.query(entireTagSql,req.userId);
        conn.release();
        return getTagData
    } catch (error) {
        console.error(error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}