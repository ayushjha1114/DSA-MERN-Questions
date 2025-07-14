import express from 'express';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { retry, fetchApiFn } from './utils/retry.js';

const app = express();

app.get('/health-check', (req, res) => {
    res.send('server is up and running');
})

app.get('/retry', async (req, res) => {
    try {
        const retries = 5, delayInMs = 3000;
        const result = await retry(fetchApiFn, retries, delayInMs)
        res.send(result)
        console.warn("🚀 ~ app.get ~ result:", result)
    } catch (error) {
        console.warn("🚀 ~ app.get ~ error:", error)
        res.status(500).send({ message: 'Failed after retries', error: error.message });
    }
})

app.get('/video', async (req, res) => {
    const url = 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

    try {
        const response = await axios.get(url, { responseType: 'stream' });

        res.setHeader('Content-Type', 'video/mp4');
        res.setHeader('Content-Disposition', 'inline; filename="bunny.mp4"');
        response.data.pipe(res);
    } catch (err) {
        console.error('Error streaming video:', err.message);
        res.status(500).send('Failed to stream video');
    }
});

app.listen(3032, () => {
    console.log('server is running on port 3032');
})