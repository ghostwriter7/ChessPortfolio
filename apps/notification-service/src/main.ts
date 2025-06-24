import { EMAIL_NOTIFICATION_REQUESTED } from '@api';
import { Kafka } from 'kafkajs';

const PORT = process.env.PORT;
const BROKER_PORT = process.env.BROKER_PORT;

const kafka = new Kafka({
  clientId: 'notification-srv',
  brokers: [`broker:${BROKER_PORT}`],
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
