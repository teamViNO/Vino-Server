import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';

const outputPath = "/Users/boleum/vino-project/Vino-Server/tempMP3"; // 저장할 파일 경로
const FFmpegPath = "/usr/local/bin/ffmpeg"; // ffmpeg 실행 파일 경로

export const convertVideoToAudio = async (videoId) => {
    return new Promise((resolve, reject) => {
        const stream = ytdl(`http://www.youtube.com/watch?v=${videoId}`, { filter: 'audioonly' });
        const filePath = path.join(outputPath, `${videoId}.mp3`);

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
