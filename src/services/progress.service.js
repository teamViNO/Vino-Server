// src/services/progress.service.js
const progressData = {};

export const updateProgress = (videoId, status, percentage) => {
    progressData[videoId] = { status, percentage };
};

export const getProgress = (videoId) => {
    return progressData[videoId] || { status: 'Not started', percentage: 0 };
};
