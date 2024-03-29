import { BaseError } from "../../config/error";
import { status } from "../../config/response.status";

export const getVideoResponseDTO=async (video,subHeading,summary,tag,category)=>{
    try {
        console.log("받아온 카테고리 데이터",category);
        const subHeadingData=[]
        const summaryData=[]
        const tagData=[]
        let youtubeId=video[0].link.split('embed/')[1];
       
        for(let i= 0; i<subHeading.length;i++){
            
            subHeadingData.push({"id": subHeading[i].id,"name":subHeading[i].name,"start_time": subHeading[i].start_time,"end_time":subHeading[i].end_time,"content":subHeading[i].content});
        }
        for(let i= 0; i<summary.length;i++){
            summaryData.push({"id": summary[i].id,"content":summary[i].content});
        }
        for(let i= 0; i<tag.length;i++){
            tagData.push({"name":tag[i].name});
        }
        return {"video_id":video[0].id,"title":video[0].title,"youtube_id":youtubeId,"description":video[0].description,"category_id":video[0].category_id,"category_name":category[0].name,"image":video[0].image,"link":video[0].link,"youtube_created_at":video[0].youtube_created_at,"created_at":video[0].created_at,"updated_at":video[0].updated_at,"open_at":video[0].open_at,"subHeading":subHeadingData,"summary":summaryData,"tag":tagData};
    } catch (error) {
        console.log(error);
        throw BaseError(status.VIDEO_NOT_FOUND);
    }
    
    
}
async function convertTimeStringToTimeObject(timeString) {
    // 시간 문자열을 ":"를 기준으로 분리하여 시, 분, 초를 배열로 가져옵니다.
    const [hours, minutes, seconds] = timeString.split(':').map(Number);

    // Date 객체를 사용하여 시간을 생성합니다.
    const time = new Date();
    time.setHours(hours);
    time.setMinutes(minutes);
    time.setSeconds(seconds);

    return time;
}
export const updateVideoResponseDTO=(video) =>{
   return {"status": video}
}
export const getSimpleVideoResponseDTO=(video,tag)=>{
    try {
        const videoData=[]
        console.log("비디오 데이터",video);
        console.log("태그 데이터",tag);
        for(let i=0;i<tag.length;i++){
            const tagData=[]
            for(let j=0;j<tag[i].length;j++){
                tagData.push({"name":tag[i][j].name});
            }
            videoData.push({"video_id":video[i].id,"category":video[i].category_id,"title":video[i].title,"description":video[i].description,"image":video[i].image,"link":video[i].link,"created_at":video[i].updated_at,"youtube_created_at":video[i].youtube_created_at,"open_at":video[i].open_at,"tag":tagData});
                
            
        }
        console.log("최종데이터",videoData);
        return {"videos":videoData};
    } catch (error) {
        return {"videos":[]}
    }
    
}
export const insertDummyVideoReadResponseDTO=(data)=>{
    return{"id":data};
}
export const addSummmaryResponseDTO=(data)=>{
    return{"id":data};
}
export const getCategoryVideoResponseDTO=(video,tag)=>{
    const videoData=[]
    let num=0;
   
    for (let i = 0; i < video.length; i++) {
        for (let j = 0; j < video[i].length; j++) { // 수정: i를 j로 변경
            const tagData = [];
            for (let k = 0; k < tag[num].length; k++) {
                tagData.push({"name": tag[num][k].name});
            }
            videoData.push({
                "video_id": video[i][j].id,
                "category_id": video[i][j].category_id,
                "title": video[i][j].title,
                "description":video[i][j].description,
                "image": video[i][j].image,
                "link": video[i][j].link,
                "created_at": video[i][j].updated_at,
                "youtube_created_at": video[i][j].youtube_created_at,
                "open_at": video[i][j].open_at,
                "tag": tagData
            });
            num++;
        }
    }
    return {"videos":videoData};
}
export const joinVideoResponseDTO= (video)=>{
    return {"video_id":video};
}

export const deleteVideoResponseDTO=(video)=>{
    return {"status": video}
}

export const getEntireTagResponseDTO=(tag)=>{
    return tag;
}