import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';
import { path as FFmpegPath} from '@ffmpeg-installer/ffmpeg';

// 바탕화면의 상위 폴더 경로
const desktopPath = path.join(__dirname, '..', '..');

// tempMP3 폴더 경로
const outputPath = '/tmp';

export const convertVideoToAudio = async (videoId) => {
    return new Promise((resolve, reject) => {
        const stream = ytdl(`http://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
        const filePath = path.join(outputPath, `${videoId}.mp3`);
        if (!fs.existsSync(outputPath)) {
            fs.mkdirSync(outputPath, { recursive: true });
        }
        ffmpeg.setFfmpegPath(FFmpegPath);
        ffmpeg(stream)
            .audioBitrate(128) 
            .save(filePath)
            .on('end', () => {
                console.log(`Download completed: ${filePath}`);
                resolve(filePath);
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            });
    });
};
