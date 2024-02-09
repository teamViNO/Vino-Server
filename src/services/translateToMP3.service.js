import ffmpeg from 'fluent-ffmpeg';
import ytdl from 'ytdl-core';
import fs from 'fs';
import path from 'path';


// 바탕화면의 상위 폴더 경로
const desktopPath = path.join(__dirname, '..', '..');

// tempMP3 폴더 경로
const outputPath = path.join(desktopPath, 'tempMP3');
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
