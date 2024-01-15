import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import {getVideo,getSubHeading,getSummary,getTag,addVideo,setSummary,setSubheading,setTag,getSimpleVideo} from "../models/video.dao.js"
import {getVideoResponseDTO,getSimpleVideoResponseDTO,joinVideoResponseDTO} from "../dtos/video.dto.js"


export const viewVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    const getVideoData=await getVideo(data);
    const getSubHeadingData = await getSubHeading(data);
    const getSummaryData = await getSummary(data);
    const getTagData = await getTag(data);
    console.log("비디오 정보: ",getVideoData);
    return getVideoResponseDTO(getVideoData,getSubHeadingData,getSummaryData,getTagData);


}
export const viewSimpleVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    const getVideoData=await getSimpleVideo(data);
    console.log("비디오 정보: ",getVideoData);
    return getSimpleVideoResponseDTO(getVideoData);


}

export const joinVideo=async(body,data)=>{
    const time =new Date
    const subHeading=body.subheading;
    const summary = body.summary;
    const tag = body.tag;
    
    const joinVideoData = await addVideo({
        'user_id':body.user_id,
        'title': body.title,
        'link':body.link,
        'image':body.image,
        'category_id':body.category_id,
        'created_at':time,
        'readed_at':time,
        'updated_at':time
    })
    console.log('데이터:',joinVideoData);
    if(joinVideoData==-1){
        throw new BaseError(status.VIDEO_ALREADY_EXIST);
    }else{
        for(let i =0; i<subHeading.length;i++){
            await setSubheading({
                'name':subHeading[i].name,
                'start_time':subHeading[i].start_time,
                'end_time':subHeading[i].end_time,
                'content':subHeading[i].content,
                'video_id': joinVideoData
            });
        }
        for(let i =0; i<summary.length;i++){
            await setSummary({
                'content': summary[i].content,
                'video_id': joinVideoData
            });
        }
        for(let i =0; i<tag.length;i++){
            await setTag({
                'name' :tag[i].name,
                'video_id':joinVideoData
            });
        }
        console.log("전달되는 정보",joinVideoData);
        return joinVideoResponseDTO(joinVideoData);
    }
    
}