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
    return {"video_id":video[0].id,"title":video[0].title,"image":video[0].image,"link":video[0].link,"youtube_created_at":video[0].youtube_created_at,"created_at":video[0].created_at,"updated_at":video[0].updated_at,"open_at":video[0].open_at,"subHeading":subHeadingData,"summary":summaryData,"tag":tagData};
}
export const updateVideoResponseDTO=(video) =>{
   return {"status": video}
}
export const getSimpleVideoResponseDTO=(video)=>{
    const videoData=[]

    for(let i=0;i<video.length;i++){
        videoData.push({"video_id":video[i].id,"category":video[i].category_id,"title":video[i].title,"image":video[i].image,"link":video[i].link,"created_at":video[i].updated_at,"youtube_created_at":video[i].youtube_created_at,"open_at":video[i].open_at});
        
    }
    return {"videos":videoData};
}

export const joinVideoResponseDTO= (video)=>{
    return {"video_id":video};
}

export const deleteVideoResponseDTO=(video)=>{
    return {"status": video}
}