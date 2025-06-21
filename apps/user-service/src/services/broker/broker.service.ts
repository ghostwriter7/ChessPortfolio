import { Kafka, Producer, RecordMetadata } from 'kafkajs';
import { EventName, EventToPayload } from '@api';

const kafka = new Kafka({
  clientId: 'user-srv',
  brokers: ['localhost:9092'],
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
      messages: [{ key, value: value.toString() }],
    });
  }
}
