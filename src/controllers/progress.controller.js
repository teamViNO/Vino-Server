// src/controllers/progress.controller.js
import { updateProgress, getProgress } from '../services/progress.service.js';

export const updateProgressStatus = async (req, res) => {
    const { videoId, status, percentage } = req.body;
    try {
        updateProgress(videoId, status, percentage);
        res.status(200).json({ message: 'Progress updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating progress', error: error.toString() });
    }
};

export const getProgressStatus = async (req, res) => {
    const { videoId } = req.params;
    try {
        const progress = getProgress(videoId);
        res.status(200).json({ progress });
    } catch (error) {
        res.status(500).json({ message: 'Error getting progress', error: error.toString() });
    }
};
