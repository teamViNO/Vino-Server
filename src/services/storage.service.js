// src/services/storageService.js
import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';


// Naver Cloud Object Storage 설정
const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const region = 'kr-standard';
const bucketName = process.env.OBJECT_STORAGE_BUCKET_NAME;
const s3 = new AWS.S3({
    endpoint,
    region,
    credentials: {
        accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY
    }
});

// 로컬 파일을 S3에 업로드
export const uploadFileToStorage = async (filePath) => {
    const fileContent = fs.readFileSync(filePath);
    const fileName = path.basename(filePath);

    const params = {
        Bucket: process.env.OBJECT_STORAGE_BUCKET_NAME,
        Key: fileName,
        ACL: 'public-read',
        Body: fileContent
    };

    try {
        const { Location } = await s3.upload(params).promise();

        // 업로드 성공 후 로컬 파일 삭제
        fs.unlink(filePath, (err) => {
            if (err) console.error('Error deleting local file:', err);
            else console.log('Local file deleted successfully');
        });

        return Location; // S3에 업로드된 파일의 URL 반환
    } catch (error) {
        console.error('Error in uploading file to S3:', error);
        throw error;
    }
};

// S3에서 파일 다운로드
export const downloadFileFromStorage = async (bucketName, filePath, localPath) => {
    const params = {
        Bucket: bucketName,
        Key: filePath
    };

    return new Promise((resolve, reject) => {
        const stream = s3.getObject(params).createReadStream();
        const fileStream = fs.createWriteStream(localPath);

        stream.on('error', (error) => reject(error));
        fileStream.on('error', (error) => reject(error));
        fileStream.on('close', () => resolve(localPath));
        
        stream.pipe(fileStream);
    });
};


//json파일 읽기
export const readFileFromObjectStorage = async (bucketName, objectKey) => {

    const params = {
        Bucket: bucketName,
        Key: objectKey
    };

    try {
        const data = await s3.getObject(params).promise();
        return JSON.parse(data.Body.toString('utf-8'));
    } catch (error) {
        console.error('Error in reading file from storage:', error);
        throw error;
    }
};

export const checkFileExistsInStorage = async (bucketName, fileNamePrefix) => {
    const params = {
        Bucket: bucketName,
        Prefix: fileNamePrefix
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.some(file => file.Key.startsWith(fileNamePrefix));
    } catch (error) {
        console.error('Error in checking file existence:', error);
        throw error;
    }
};

// videoId.mp3로 시작하고 .json으로 끝나는 파일 이름 가져오기
export const getScriptFileName = async (bucketName, videoId) => {
    const params = {
        Bucket: bucketName,
        Prefix: `${process.env.OBJECT_STORAGE_BUCKET_NAME}:${videoId}.mp3`
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const scriptFile = data.Contents.find(file => file.Key.endsWith('.json'));
        return scriptFile ? scriptFile.Key : null;
    } catch (error) {
        console.error('Error in getting script file name:', error);
        throw error;
    }
};