import { EMAIL_NOTIFICATION_REQUESTED } from '@api';
import express from 'express';
import { Kafka } from 'kafkajs';

const app = express();

const port = process.env.PORT || 4202;

const kafka = new Kafka({
  clientId: 'notification-srv',
  brokers: ['localhost:9094'],
});

const consumer = kafka.consumer({ groupId: 'notification-srv' });

await consumer.connect();

await consumer.subscribe({
  topic: EMAIL_NOTIFICATION_REQUESTED,
});

await consumer.run({
  eachMessage: async ({ topic, partition, message }) => {
    const payload = JSON.parse(message.value.toString());
    console.log(payload);
    console.log(message.key.toString());
    console.log(topic);
  },
});
app.listen(port, () => {
  console.log(`Notification Service listening at http://localhost:${port}/api`);
});
