import {
  createSubscriberService,
  EMAIL_NOTIFICATION_REQUESTED,
  EventToPayload,
  loggerFactory,
} from '@api';
import * as nodemailer from 'nodemailer';

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

try {
  const subscriberService = await createSubscriberService();
  await subscriberService.subscribe(EMAIL_NOTIFICATION_REQUESTED);
  await subscriberService.run(async ({ topic, partition, message }) => {
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
  });
} catch (e) {
  logger.error('Notification-Service failed to start', e);
}
