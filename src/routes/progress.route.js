// src/routes/progress.route.js

import express from 'express';
import { addClient, sendProgress } from '../services/progress.service.js';

const progressRoute = express.Router();

router.get('/progress-stream', (req, res) => {
    const clientId = req.query.clientId || new Date().toISOString();

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    addClient(clientId, res);
});

export { progressRoute };
