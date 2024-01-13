import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {getVideoSql,getSubHeadingSql,getSummarySql,getTagSql} from "../models/video.sql.js"


export const getVideo=async (req) =>{
    try {
        console.log("dao에서 받아온 정보",req);
        const conn = await pool.getConnection();
        const [video]= await pool.query(getVideoSql,[req.userID,req.videoID,req.version]);
        console.log("비디오값",video[0]);
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