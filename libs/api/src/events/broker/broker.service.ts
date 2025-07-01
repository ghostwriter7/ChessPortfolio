import { loggerFactory } from '../../logger/logger-factory';
import { EventName, EventToPayload } from '../events';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';

export class BrokerService {
  private readonly logger = loggerFactory({ service: BrokerService.name });
  private readonly producer: Producer;

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
    this.producer = kafka.producer();
  }

  public async init(): Promise<void> {
    await this.producer.connect();
    this.logger.info('Producer has been successfully connected to the broker');
  }

  public send<T extends EventName>(
    topic: T,
    key: string,
    value: EventToPayload[T]
  ): Promise<RecordMetadata[]> {
    return this.producer.send({
      topic,
      messages: [{ key, value: JSON.stringify(value) }],
    });
  }
}

export async function createBrokerService(): Promise<BrokerService> {
  const brokerService = new BrokerService();
  await brokerService.init();
  return brokerService;
}
