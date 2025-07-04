import { Consumer, EachMessagePayload, Kafka } from 'kafkajs';
import { loggerFactory } from '../../logger/logger-factory';
import { EventName } from '../events';

export class SubscriberService {
  private readonly logger = loggerFactory({ service: SubscriberService.name });
  private readonly consumer: Consumer;

  constructor() {
    const BROKER_PORT = process.env['BROKER_PORT'];

    if (!BROKER_PORT) {
      throw new Error('BROKER_PORT is not defined');
    }

    const clientId = process.env['SERVICE_NAME'];

    if (!clientId) {
      throw new Error('SERVICE_NAME is not defined');
    }

    const kafka = new Kafka({
      clientId,
      brokers: [`broker:${BROKER_PORT}`],
    });
    this.consumer = kafka.consumer({ groupId: clientId });
    this.logger.info(
      `Consumer has been successfully created for groupId: ${clientId}`
    );
  }

  public async tryInit(): Promise<void> {
    let lastError: unknown;

    for (let i = 0; i < 10; i++) {
      try {
        return this.consumer.connect();
      } catch (e) {
        this.logger.warn(`Failed to connect to broker, retrying in 3000ms`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        lastError = e;
      }
    }

    throw lastError;
  }

  public async subscribe(topic: EventName): Promise<void> {
    return this.consumer.subscribe({ topic });
  }

  public async run(
    callback: (payload: EachMessagePayload) => Promise<void>
  ): Promise<void> {
    return this.consumer.run({ eachMessage: callback });
  }
}

export async function createSubscriberService(): Promise<SubscriberService> {
  const subscriberService = new SubscriberService();
  await subscriberService.tryInit();
  return subscriberService;
}
