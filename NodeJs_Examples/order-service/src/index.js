import express from 'express';
import dotenv from 'dotenv';
import { produceOrder } from './kafka/producer.js';

dotenv.config();

const app = express();
app.use(express.json());

app.post('/order', async (req, res) => {
  const order = req.body;

  if (!order.id || !order.item || !order.quantity) {
    return res.status(400).json({ error: 'Missing order fields' });
  }

  try {
    await produceOrder(order);
    res.status(200).send('Order placed. You will receive a confirmation shortly.');
  } catch (err) {
    console.error('Error publishing order:', err);
    res.status(500).send('Failed to publish order');
  }
});

app.listen(3001, () => {
  console.log('✅ Order service is running on http://localhost:3001');
});
