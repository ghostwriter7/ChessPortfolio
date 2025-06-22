import { EventName, EventToPayload } from '@api';
import { Kafka, Producer, RecordMetadata } from 'kafkajs';

const BROKER_PORT = process.env.BROKER_PORT;

const kafka = new Kafka({
  clientId: 'user-srv',
  brokers: [`broker:${BROKER_PORT}`],
});

export class BrokerService {
  private readonly producer: Producer;

  constructor() {
    this.producer = kafka.producer();
  }

  public async init(): Promise<void> {
    await this.producer.connect();
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
