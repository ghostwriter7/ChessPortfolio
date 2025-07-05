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
    return this.runWithRetry(
      () => this.consumer.connect(),
      'Could not connect to broker, retrying in 3000ms'
    );
  }

  public async subscribe(topic: EventName): Promise<void> {
    return this.runWithRetry(
      () => this.consumer.subscribe({ topic }),
      `Could not subscribe to topic ${topic}, retrying in 3000ms`
    );
  }

  public async run(
    callback: (payload: EachMessagePayload) => Promise<void>
  ): Promise<void> {
    return this.consumer.run({ eachMessage: callback });
  }

  private async runWithRetry(
    fn: () => Promise<void>,
    warnLog: string
  ): Promise<void> {
    let lastError: unknown;

    for (let i = 0; i < 10; i++) {
      try {
        return fn();
      } catch (e) {
        this.logger.warn(warnLog);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        lastError = e;
      }
    }

    throw lastError;
  }
}

export async function createSubscriberService(): Promise<SubscriberService> {
  const subscriberService = new SubscriberService();
  await subscriberService.tryInit();
  return subscriberService;
}
