import express from 'express';
import { retry, fetchApiFn } from './utils/retry.js';

const app = express();

app.get('/health-check', (req, res) => {
    res.send('server is up and running');
})

app.get('/retry', async  (req, res) => {
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

app.listen(3032, ()=> {
    console.log('server is running on port 3030');
})