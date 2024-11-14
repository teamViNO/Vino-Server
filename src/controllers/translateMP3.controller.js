import { getVideoAudioStream } from '../services/translateToMP3.service.js';
import { checkFileExistsInStorage, uploadStreamToStorage } from '../services/storage.service.js';
import { BaseError } from "../../config/error.js";
import { response } from "../../config/response.js";
import { status } from "../../config/response.status.js";

export const convertMP3 = async (req, res) => {
    let videoId = '';
    
    try {
        const videoUrl = req.query.v ?? '';  // 클라이언트에서 받은 유튜브 비디오 URL
        console.log("Received video URL:", videoUrl);

        // 유튜브 동영상 ID 추출
        videoId = await extractYouTubeId(encodeURI(videoUrl));
        if (!videoId) throw new BaseError("Invalid YouTube URL");

        // Object Storage에 MP3 파일이 있는지 확인
        const mp3Exists = await checkFileExistsInStorage(process.env.OBJECT_STORAGE_BUCKET_NAME, `${videoId}.mp3`);

        if (!mp3Exists) {
            // 오디오 스트림 생성
            const audioStream = getVideoAudioStream(videoId);

            // Object Storage에 스트림 업로드
            const uploadedFilePath = await uploadStreamToStorage(audioStream, `${videoId}.mp3`);

            res.send(response(status.SUCCESS, {
                message: 'MP3 변환 및 업로드 완료', 
                progress: '100', 
                nextEndPoint: '/video/speech', 
                videoId: videoId,
                fileUrl: uploadedFilePath,
            }));
        } else {
            res.send(response(status.SUCCESS, {
                message: 'MP3가 이미 존재합니다!', 
                progress: '100', 
                nextEndPoint: '/video/summary', 
                videoId: videoId 
            }));
        }
    } catch (error) {
        console.error(error);
        res.send(response(status.BAD_REQUEST, {
            message: 'MP3 변환 및 업로드 실패', 
            error: error.toString()
        }));
    }
};

async function extractYouTubeId(url) {
    const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match && match[1] ? match[1] : '';
}