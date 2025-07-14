import express from 'express';

const app = express();
const PORT = 4000;

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

const rateLimitMap = new Map<string, { count : number, timestamp: number }>();

function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
    const ip = req.ip;
    const currentDate = Date.now();

    const record = rateLimitMap.get(ip);

    if (!record) {
        rateLimitMap.set(ip, { count: 1, timestamp: currentDate });
        return next();
    }

    const timePassed = currentDate - record.timestamp

    if (timePassed < WINDOW_MS) {

        if (record.count > MAX_REQUESTS) {
            return res.status(429).send("Too many requests. Please try again later")
        } else {
            record.count++;
            return next();
        }
    } else {
        rateLimitMap.set(ip, { count : 1, timestamp: currentDate })
        return next();
    }
}

app.use(rateLimiter);

app.get("/", (req: express.Request, res: express.Response) => {
    res.send("Welcome!!")
})

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})