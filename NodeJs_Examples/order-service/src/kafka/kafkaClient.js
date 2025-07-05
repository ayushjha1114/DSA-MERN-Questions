import { Kafka } from 'kafkajs';
import dotenv from 'dotenv';
dotenv.config();

export const kafka = new Kafka({
  clientId: process.env.CLIENT_ID || 'order-service',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
});
