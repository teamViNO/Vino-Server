export const getVideoResponseDTO=(video,subHeading,summary,tag)=>{
    const subHeadingData=[]
    const summaryData=[]
    const tagData=[]
    for(let i= 0; i<subHeading.length;i++){
        subHeadingData.push({"id": subHeading[i].id,"title":subHeading[i].title,"start_time":subHeading[i].start_time,"end_time":subHeading[i].end_time,"content":subHeading[i].content});
    }
    for(let i= 0; i<summary.length;i++){
        summaryData.push({"id": summary[i].id,"content":summary[i].content});
    }
    for(let i= 0; i<tag.length;i++){
        tagData.push({"name":tag[i].name});
    }
    return {"video_id":video[0].id,"title":video[0].title,"description":video[0].description,"image":video[0].image,"link":video[0].link,"youtube_created_at":video[0].youtube_created_at,"created_at":video[0].created_at,"updated_at":video[0].updated_at,"open_at":video[0].open_at,"subHeading":subHeadingData,"summary":summaryData,"tag":tagData};
}
export const updateVideoResponseDTO=(video) =>{
   return {"status": video}
}
export const getSimpleVideoResponseDTO=(video,tag)=>{
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
}
export const insertDummyVideoReadResponseDTO=(data)=>{
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