import { BaseError } from "../../config/error.js";
import {status} from "../../config/response.status.js"
import {getVideo,getSubHeading,getSummary,getTag,addVideo,addSummmary,setSummary,setSubheading,setTag,getSimpleVideo,dropVideo,updateVideo,updateSubheading,updateSummary,setReadTime,dropSelectedVideo, getEntireTag,getCategory} from "../models/video.dao.js"
import {getVideoResponseDTO,getSimpleVideoResponseDTO,joinVideoResponseDTO,deleteVideoResponseDTO, updateVideoResponseDTO, getEntireTagResponseDTO} from "../dtos/video.dto.js"
import {getSimpleVideoWithVideo,getRecentVideo,updateCategory,addDummyVideoRead,UnReadVideoInfo,addCopyVideo,deleteSummary,getCategoryName} from "../models/video.dao.js";
import {getCategoryVideoResponseDTO,insertDummyVideoReadResponseDTO,addSummmaryResponseDTO} from "../dtos/video.dto.js";

export const viewVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    const time = new Date
    const getVideoData=await getVideo(data);
    const getSubHeadingData = await getSubHeading(data);
    const getSummaryData = await getSummary(data);
    const getTagData = await getTag(data);
    const setTimeData=await setReadTime(data,time);
    let categoryData={};
    if(getVideoData[0].category_id){
        categoryData=await getCategoryName(data.userID,getVideoData[0].category_id);
    }else{
        categoryData=[{"name":null}];
    }
    console.log("비디오 정보: ",getVideoData);
    return getVideoResponseDTO(getVideoData,getSubHeadingData,getSummaryData,getTagData,categoryData);


}
export const viewTag=async(data)=>{
    const getTagData=await getEntireTag(data);
    return getEntireTagResponseDTO(getTagData);
}
export const insertSummmary=async(data)=>{
    const getSummaryData=[]
    for(let i =0;i<data.content.length;i++){
        const summaryData={
            "userId":data.userId,
            "videoId":data.videoId,
            "content":data.content[i]
        }
        getSummaryData.push(await addSummmary(summaryData));
    }
    
    return addSummmaryResponseDTO(getSummaryData);
}
export const removeSummary=async(data)=>{
    const deleteSummaryData=await deleteSummary(data);
    return {"status":"success"};
}
export const viewSimpleVideo=async(data)=>{
    try {
        console.log("서비스에서 전달되는 요청정보",data);
        console.log("123");
        const TagData=[];
        const getVideoData=await getSimpleVideo(data);
        
        for(let i =0; i<getVideoData.length;i++){
            TagData.push(await getTag({
                "videoID":getVideoData[i].id,
                "version":"revision"
            }));
        }
        console.log("비디오 정보: ",getVideoData);
        return getSimpleVideoResponseDTO(getVideoData,TagData);

    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
    
}
export const viewRecentVideo=async(data)=>{
    console.log("서비스에서 전달되는 요청정보",data);
    console.log("123");
    const TagData=[];
    const getVideoData=await getRecentVideo(data);
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
export const viewCategoryVideo=async(data)=>{
    try {
        const categoryData=[];
        const tagData=[];
        const getVideoData=[];
        const categoryResult=await findCategory(categoryData,data.category_id,data.user_id);
        console.log("데이터 정보",categoryResult);
        for(let i=0; i<categoryResult.length;i++){
            
            const result=[];
            result.push(await getSimpleVideoWithVideo(categoryResult[i]));
            
            if(result[0].length!==0){
                getVideoData.push(result[0]);
            }
            
            
        }
        
        for(let j=0;j<getVideoData.length;j++){
            for(let k=0;k<getVideoData[j].length;k++){
                tagData.push(await getTag({
                    "videoID":getVideoData[j][k].id,
                    "version":"revision"
                }));
            }
            
        }
       


        return getCategoryVideoResponseDTO(getVideoData,tagData);
    } catch (error) {
        console.error(error);
        throw new BaseError(status.CATEGORY_IS_EMPTY);
    }
}
async function findCategory(categoryData, category, user) {
    
    if (typeof category == "undefined" || category == null) {
       
        return categoryData;
    } else {
        categoryData.push(category);
        const result = await getCategory(category, user);
        for (let i = 0; i < result.length; i++) {
            await findCategory(categoryData, result[i].id, user);
        }

        if (typeof result[0] == "undefined") {
            await findCategory(categoryData, result[0], user);
        }
        
        // 이 부분에서 루프가 끝난 후 값을 반환하도록 수정
        return categoryData;
    }
}

export const insertCopyVideo=async(data)=>{
    const videoData=await addCopyVideo(data);
    return {"id":videoData};
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
    let youtubeId=body.link.split('v=')[1];
    if (youtubeId.includes('&')) {
        youtubeId = youtubeId.split('&')[0];
    }
    const joinVideoData = await addVideo({
        'user_id':data.userID,
        'title': body.title,
        "description":body.description,
        'link':body.link,
        "youtube_created_at":body.youtube_created_at,
        'image':"https://img.youtube.com/vi/"+youtubeId+"/maxresdefault.jpg",
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
export const viewUnReadDummyVideo=async(data)=>{
    try {
        console.log("서비스에서 전달되는 요청정보",data);
        console.log("123");
        const TagData=[];
        const getVideoData=await UnReadVideoInfo(data);
        
        for(let i =0; i<getVideoData.length;i++){
            TagData.push(await getTag({
                "videoID":getVideoData[i].id,
                "version":"revision"
            }));
        }
        console.log("비디오 정보: ",getVideoData);
        return getSimpleVideoResponseDTO(getVideoData,TagData);

    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const videoCategoryUpdate=async(data)=>{
    const time = new Date;
    for(let i=0;i<data.videoId.length;i++){
        const resultData={
            "userId":data.userId,
            "categoryId":data.categoryId,
            "videoId":data.videoId[i]
        }
        const updatevideoData=await updateCategory(resultData);
    }
    
    return {"status":"success"};
}
export const updateVideoService=async(body,data)=>{
    const time =new Date
    const subHeading=body.subheading;
    const summary = body.summary;
    console.log(body);
    if(body.title&&body.description){
    const updateVideoData = await updateVideo({
        'id': data.videoID,
        'title': body.title,
        'description':body.description,
        'readed_at':time,
        'updated_at':time
    })
    console.log('데이터:',updateVideoData);
    }
    if(subHeading){
        for(let i =0; i<subHeading.length;i++){
            await updateSubheading({
                'id':subHeading[i].id,
                'name':subHeading[i].name,
                'content':subHeading[i].content,
                'video_id': data.videoID
            });
        }
    }
    if(summary){
        for(let i =0; i<summary.length;i++){
            await updateSummary({
                'id':summary[i].id,
                'content': summary[i].content,
                'video_id': data.videoID
            });
        }
    }
    
    return updateVideoResponseDTO("success");
    
}

export const insertDummyVideoRead = async(data)=>{
    try {
        const insertData=await addDummyVideoRead(data);
        return insertDummyVideoReadResponseDTO(insertData)
    } catch (error) {
        
    }
}