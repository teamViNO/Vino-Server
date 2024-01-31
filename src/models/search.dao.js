import { pool } from "../../config/db.connect.js";
import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import {getVideoKeywordSql,getVideoTagSql}from "../models/search.sql.js";


export const getVideoKeyword =async(req)=>{

    try {
        console.log(req);
        const conn = await pool.getConnection();
        const [video]=await pool.query(getVideoKeywordSql,[req.userId,'%'+req.keyword+'%','%'+req.keyword+'%','%'+req.keyword+'%']);
        console.log("비디오 데이터 원본 ",video);
        conn.release();
        return video;
    } catch (error) {
        console.error(error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
    
}

export const getVideoTag = async(req)=>{
    try{
        console.log(req);
        const conn = await pool.getConnection();
        const [video]=await pool.query(getVideoTagSql,[req.userId,'%'+req.tag+'%']);
        console.log("비디오 데이터",video);
        conn.release();
        return video;
    }catch(error){
        console.error(error);
        throw new BaseError(status.PARAMETER_IS_WRONG);
    }
}