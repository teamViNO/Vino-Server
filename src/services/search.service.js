import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import {getVideoKeyword,getVideoTag} from "../models/search.dao.js";
import {getSearchKeywordResponseDTO,getSearchTagResponseDTO} from "../dtos/search.dto.js";
import { getTag, getVideo } from "../models/video.dao.js";

export const viewSearchKeyword=async(data)=>{
    
    const getVideoData=[];
    
    
    getVideoData.push(await getVideoKeyword({
        "userId":data.userId,
        "keyword":data.keyword}));
    
    console.log("서비스에서 전달되는 요청 정보",getVideoData);
    
    
   
    return getSearchKeywordResponseDTO(getVideoData);
}

export const viewSearchTag=async(data)=>{
    //console.log("서비스에서 전달되는 요청 정보",data);
    const getVideoData=[];
    
    getVideoData.push(await getVideoTag({
        "userId":data.userId,
        "tag":data.hashtag
    }));
    
    //console.log("비디오 정보",getVideoData);
    return getSearchTagResponseDTO(getVideoData);
}

