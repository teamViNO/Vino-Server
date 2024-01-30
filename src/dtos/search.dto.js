import { BaseError } from "../../config/error";
import { status } from "../../config/response.status.js";

export const getSearchKeywordResponseDTO = (video) => {
    try {
        console.log("넘어온 데이터", video[1][0]);
        const videoData = [];
        const addedIds = [];  // 이미 추가된 id를 기억하는 배열

        
        for (let j = 0; j < video.length; j++) {
            for (let i = 0; i < video[j].length; i++) {
                console.log("초기단계", videoData[i - 1]?.id);
                
                // 이미 추가된 id인지 체크
                if (!addedIds.includes(video[j][i].id)) {
                    videoData.push({
                        "id": video[j][i].id,
                        "title": video[j][i].title,
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

        console.log(videoData);
        return { "video": videoData };
    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
}

export const getSearchTagResponseDTO = (video) => {
    try {
        console.log(video);
        const videoData = [];
        const addedIds = [];  // 이미 추가된 id를 기억하는 배열

        console.log("비디오 데이터 처음", videoData);

        for (let j = 0; j < video.length; j++) {
            for (let i = 0; i < video[j].length; i++) {
                console.log("초기단계", videoData[i - 1]?.id);
                
                // 이미 추가된 id인지 체크
                if (!addedIds.includes(video[j][i].id)) {
                    videoData.push({
                        "id": video[j][i].id,
                        "title": video[j][i].title,
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

        console.log(videoData);
        return { "video": videoData };
    } catch (error) {
        console.error(error);
        throw new BaseError(status.VIDEO_NOT_FOUND);
    }
}