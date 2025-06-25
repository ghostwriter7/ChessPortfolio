import {
  EMAIL_NOTIFICATION_REQUESTED,
  EventToPayload,
  loggerFactory,
  retry,
} from '@api';
import { Kafka } from 'kafkajs';
import * as nodemailer from 'nodemailer';

const BROKER_PORT = process.env.BROKER_PORT;
const EMAIL_ACCOUNT = process.env.EMAIL_ACCOUNT;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_ACCOUNT,
    pass: EMAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const logger = loggerFactory();

const initialize = async () => {
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
      logger.info(`Received message on ${topic} [${partition}]`);
      try {
        const {
          email,
          subject,
          message: emailMessage,
        } = (JSON.parse(
          message.value.toString()
        ) as EventToPayload['EMAIL_NOTIFICATION_REQUESTED']) || {};

        const info = await transporter.sendMail({
          from: EMAIL_ACCOUNT,
          subject,
          to: email,
          html: emailMessage,
        });

        logger.info(`Message sent: ${info.messageId}`);
      } catch (error) {
        logger.error('Failed to send an e-mail');
        console.error(error);
      }
    },
  });
};

retry(initialize, logger);
