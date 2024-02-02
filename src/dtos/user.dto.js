



export const joinAlarmResponseDto= (alarm)=>{
    return {"id":alarm};
}

export const getAlarmResponseDTO=(alarm)=>{
    const alarmData=[]
    console.log("dto 넣기전 alarm:",alarm);
    for(let i=0;i<alarm.length;i++){
        if(alarm[i].title!==null){
            alarmData.push({"alarm_id":alarm[i].id,"title":alarm[i].title,"type":alarm[i].type,"is_confirm":alarm[i].is_confirm,"created_at":alarm[i].created_at,"updated_at":alarm[i].updated_at,"content":alarm[i].content,"state":alarm[i].state,"video_id":alarm[i].video_id});
        }else{
            alarmData.push({"alarm_id":alarm[i].id,"title":alarm[i].alarm_title,"type":alarm[i].type,"is_confirm":alarm[i].is_confirm,"created_at":alarm[i].created_at,"updated_at":alarm[i].updated_at,"content":alarm[i].content,"state":alarm[i].state,"video_id":alarm[i].video_id});
        }
    }
    console.log("알람데이터dto",alarmData);
    return {"alarms":alarmData};
}

export const updateConfirmResponseDTO=(alarm)=>{
    return{"status":alarm};
}

export const deleteAlarmResponseDTO=(alarm)=>{
    return{"status":alarm};
}

export const deleteAllAlarmResponseDTO=(alarm)=>{
    return{"status":alarm};
}