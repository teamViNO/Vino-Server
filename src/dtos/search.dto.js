import { BaseError } from "../../config/error.js";
import { status } from "../../config/response.status.js";
import { getSimpleVideoResponseDTO } from "./video.dto.js";
import { getTag } from "../models/video.dao.js";

export const getSearchKeywordResponseDTO = async (video) => {
    try {
        console.log("넘어온 데이터", video[1][0]);
        const videoData = [];
        const addedIds = [];  // 이미 추가된 id를 기억하는 배열
        const tagData=[];
        
        
        for (let j = 0; j < video.length; j++) {
            for (let i = 0; i < video[j].length; i++) {
                console.log("초기단계", videoData[i - 1]?.id);
                
                // 이미 추가된 id인지 체크
                if (!addedIds.includes(video[j][i].id)) {
                    videoData.push({
                        "id": video[j][i].id,
                        "title": video[j][i].title,
                        "description":video[j][i].description,
                        "image": video[j][i].image,
                        "created_at": video[j][i].created_at,
                        "name": video[j][i].summary,
                        "content": video[j][i].content,
                        "user": video[j][i].name
                    });

                    addedIds.push(video[j][i].id);  // 추가된 id를 기억
                }
            }
        }
        for(let i =0; i<videoData.length;i++){
            console.log(i+"번째 영상 ",videoData[i].id);
            tagData.push(await getTag({
                "videoID":videoData[i].id,
                "version":"revision"
            }));
        }
        return getCombinedResultDTO(videoData,tagData);
    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
}

export const getSearchTagResponseDTO = async(video) => {
    try {
        console.log(video);
        const videoData = [];
        const addedIds = [];  // 이미 추가된 id를 기억하는 배열
        const tagData=[];
        console.log("비디오 데이터 처음", videoData);

        for (let j = 0; j < video.length; j++) {
            for (let i = 0; i < video[j].length; i++) {
                console.log("초기단계", videoData[i - 1]?.id);
                
                // 이미 추가된 id인지 체크
                if (!addedIds.includes(video[j][i].id)) {
                    videoData.push({
                        "id": video[j][i].id,
                        "title": video[j][i].title,
                        "description":video[j][i].description,
                        "image": video[j][i].image,
                        "created_at": video[j][i].created_at,
                        "name": video[j][i].summary,
                        "content": video[j][i].content,
                        "user": video[j][i].name
                    });

                    addedIds.push(video[j][i].id);  // 추가된 id를 기억
                }
            }
        }

        for(let i =0; i<videoData.length;i++){
            console.log(i+"번째 영상 ",videoData[i].id);
            tagData.push(await getTag({
                "videoID":videoData[i].id,
                "version":"revision"
            }));
        }
        return getCombinedResultDTO(videoData,tagData);
    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
}
export const getCombinedResultDTO=(video,tag)=>{
    const videoData=[]
    
    console.log("태그 데이터",tag);
    console.log("비디오는",video);
    for(let i=0;i<tag.length;i++){
        const tagData=[]
        for(let j=0;j<tag[i].length;j++){
            tagData.push({"name":tag[i][j].name});
        }
        videoData.push({
            "video_id":video[i].id,
            "category":video[i].category_id,
            "title":video[i].title,
            "description":video[i].description,
            "image":video[i].image,
            "created_at":video[i].created_at,
            "name":video[i].name,
            "content":video[i].content,
            "user":video[i].user,
            "tag":tagData});
    }
  
    return {"videos":videoData};
}