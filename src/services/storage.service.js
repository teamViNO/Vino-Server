import AWS from 'aws-sdk';

// Naver Cloud Object Storage 설정
const endpoint = new AWS.Endpoint('https://kr.object.ncloudstorage.com');
const s3 = new AWS.S3({
    endpoint,
    region: 'kr-standard',
    credentials: {
        accessKeyId: process.env.OBJECT_STORAGE_ACCESS_KEY,
        secretAccessKey: process.env.OBJECT_STORAGE_SECRET_KEY,
    },
});

// 오디오 스트림을 Object Storage에 직접 업로드
export const uploadStreamToStorage = (stream, fileName) => {
    const params = {
        Bucket: process.env.OBJECT_STORAGE_BUCKET_NAME,
        Key: fileName,
        ACL: 'public-read',
        Body: stream,
        ContentType: 'audio/mpeg',
    };

    return new Promise((resolve, reject) => {
        s3.upload(params)
            .on('httpUploadProgress', (progress) => {
                console.log(`Progress: ${progress.loaded} / ${progress.total}`);
            })
            .send((err, data) => {
                if (err) {
                    console.error('Error in uploading stream to S3:', err);
                    return reject(err);
                }
                console.log(`Upload completed: ${data.Location}`);
                resolve(data.Location);
            });
    });
};
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
// S3에서 파일 존재 여부 확인
export const checkFileExistsInStorage = async (bucketName, fileNamePrefix) => {
    const params = {
        Bucket: bucketName,
        Prefix: fileNamePrefix,
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        return data.Contents.some(file => file.Key.startsWith(fileNamePrefix));
    } catch (error) {
        console.error('Error in checking file existence:', error);
        throw error;
    }
};