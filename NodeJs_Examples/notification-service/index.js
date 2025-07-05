// index.js
require('dotenv').config();
const { Kafka } = require('kafkajs');
const express = require('express');
const { register, redisQueueGauge } = require('./metrics');
const redis = require('./redisClient');
const sendEmail = require('./emailService');

const app = express();

const kafka = new Kafka({
    clientId: 'notification-service',
    brokers: [process.env.KAFKA_BROKER],
});

const consumer = kafka.consumer({ groupId: process.env.KAFKA_GROUP_ID });

async function run() {
    await consumer.connect();
    await consumer.subscribe({ topic: process.env.KAFKA_TOPIC, fromBeginning: true });

    console.log('📡 Listening for orders...');

    await consumer.run({
        eachMessage: async ({ message }) => {
            const value = message.value.toString();
            console.log(`📨 Received: ${value}`);
            try {
                const order = JSON.parse(value);
                await sendEmail(order);
            } catch (err) {
                console.error('❌ Invalid message format:', err.message);
            }
        },
    });
}

run().catch(console.error);




app.get('/metrics', async (req, res) => {
  // update DLQ gauge
  const length = await redis.llen('failed-orders');
  redisQueueGauge.set(length);

  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(9000, () => {
  console.log('📈 Metrics server running on http://localhost:9000/metrics');
});

