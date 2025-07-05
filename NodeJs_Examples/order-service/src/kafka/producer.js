import { kafka } from './kafkaClient.js';

const producer = kafka.producer();
let isConnected = false;

export async function produceOrder(order) {
  if (!isConnected) {
    await producer.connect();
    isConnected = true;
  }

  await producer.send({
    topic: 'orders',
    messages: [{ key: order.id, value: JSON.stringify(order) }],
  });
}
