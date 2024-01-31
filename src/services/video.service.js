import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import {getVideo,getSubHeading,getSummary,getTag,addVideo,setSummary,setSubheading,setTag,getSimpleVideo,dropVideo,updateVideo,updateSubheading,updateSummary,setReadTime,dropSelectedVideo, getEntireTag} from "../models/video.dao.js"
import {getVideoResponseDTO,getSimpleVideoResponseDTO,joinVideoResponseDTO,deleteVideoResponseDTO, updateVideoResponseDTO, getEntireTagResponseDTO} from "../dtos/video.dto.js"


export const viewVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    const time = new Date
    const getVideoData=await getVideo(data);
    const getSubHeadingData = await getSubHeading(data);
    const getSummaryData = await getSummary(data);
    const getTagData = await getTag(data);
    const setTimeData=await setReadTime(data,time);
    console.log("비디오 정보: ",getVideoData);
    return getVideoResponseDTO(getVideoData,getSubHeadingData,getSummaryData,getTagData);


}
export const viewTag=async(data)=>{
    const getTagData=await getEntireTag(data);
    return getEntireTagResponseDTO(getTagData);
}
export const viewSimpleVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    console.log("123");
    const TagData=[];
    const getVideoData=await getSimpleVideo(data);
    console.log(getVideoData[0].id);
    for(let i =0; i<getVideoData.length;i++){
        TagData.push(await getTag({
            "videoID":getVideoData[i].id,
            "version":"revision"
        }));
    }
    console.log("비디오 정보: ",getVideoData);
    return getSimpleVideoResponseDTO(getVideoData,TagData);

}
export const deleteVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청 정보",data);
    const deleteVideoStatus= await dropVideo(data);
    return deleteVideoResponseDTO(deleteVideoStatus);
}

export const deleteSelectVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청 정보",data);
    const deleteVideoStatus=[];
    for(let i =0; i<data.videos.length;i++){
        deleteVideoStatus.push(await dropSelectedVideo(data.userId,data.videos[i]));

    }

    return deleteVideoResponseDTO(deleteVideoStatus[0]);
}

export const joinVideo=async(body,data)=>{
    const time =new Date
    const subHeading=body.subheading;
    const summary = body.summary;
    const tag = body.tag;
    
    const joinVideoData = await addVideo({
        'user_id':data.userID,
        'title': body.title,
        'link':body.link,
        "youtube_created_at":body.youtube_created_at,
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

export const updateVideoService=async(body,data)=>{
    const time =new Date
    const subHeading=body.subheading;
    const summary = body.summary;
    console.log(body);
    
    const updateVideoData = await updateVideo({
        'id': data.videoID,
        'title': body.title,
        'category_id':body.category_id,
        'readed_at':time,
        'updated_at':time
    })
    console.log('데이터:',updateVideoData);
    if(updateVideoData==-1){
        throw new BaseError(status.VIDEO_ALREADY_EXIST);
    }else{
        for(let i =0; i<subHeading.length;i++){
            await updateSubheading({
                'id':subHeading[i].id,
                'name':subHeading[i].name,
                'content':subHeading[i].content,
                'video_id': data.videoID
            });
        }
        for(let i =0; i<summary.length;i++){
            await updateSummary({
                'id':summary[i].id,
                'content': summary[i].content,
                'video_id': data.videoID
            });
        }
        console.log("전달되는 정보",updateVideoData);
        return updateVideoResponseDTO(updateVideoData);
    }
}