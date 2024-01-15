import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {getVideoSql,getEntireVideoSql,getSubHeadingSql,getSummarySql,getTagSql,insertVideoOriginSql,insertVideoRevisionSql,connectSubheading,connectSummary,connectTag,connectVideoTag} from "../models/video.sql.js"


export const getVideo=async (req) =>{
    try {
        console.log("dao에서 받아온 정보",req);
        const conn = await pool.getConnection();
        const [video]= await pool.query(getVideoSql,[req.videoID,req.userID,req.version]);
        console.log("비디오값",video[0]);
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
        const videoOriginal = await pool.query(insertVideoOriginSql,['original',req.title,req.link,req.image,req.created_at,req.readed_at,req.updated_at,req.category_id,req.user_id]);
        const videoRevision = await pool.query(insertVideoRevisionSql,[videoOriginal[0].insertId,'revision',req.title,req.link,req.image,req.created_at,req.readed_at,req.updated_at,req.category_id,req.user_id]);
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

