export const getVideoResponseDTO=(video,subHeading,summary,tag)=>{
    const subHeadingData=[]
    const summaryData=[]
    const tagData=[]
    for(let i= 0; i<subHeading.length;i++){
        subHeadingData.push({"title":subHeading[i].title,"start_time":subHeading[i].start_time,"end_time":subHeading[i].end_time,"content":subHeading[i].content});
    }
    for(let i= 0; i<summary.length;i++){
        summaryData.push({"content":summary[i].content});
    }
    for(let i= 0; i<tag.length;i++){
        tagData.push({"name":tag[i].name});
    }
    return {"video_id":video[0].id,"title":video[0].title,"image":video[0].image,"link":video[0].link,"created_at":video[0].created_at,"updated_at":video[0].updated_at,"open_at":video[0].open_at,"subHeading":subHeadingData,"summary":summaryData,"tag":tagData};
}