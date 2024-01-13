import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import {getVideo,getSubHeading,getSummary,getTag} from "../models/video.dao.js"
import {getVideoResponseDTO} from "../dtos/video.dto.js"


export const viewVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    const getVideoData=await getVideo(data);
    const getSubHeadingData = await getSubHeading(data);
    const getSummaryData = await getSummary(data);
    const getTagData = await getTag(data);
    console.log("비디오 정보: ",getVideoData);
    return getVideoResponseDTO(getVideoData,getSubHeadingData,getSummaryData,getTagData);


}