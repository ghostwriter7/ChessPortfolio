export abstract class BaseEvent<T = unknown> {
  public readonly createdAt = Date.now();
  public readonly payload: T;

  public get name(): string {
    return this.constructor.name;
  }

  protected constructor(payload: T) {
    this.payload = payload;
  }
}

export type BaseEventSubClass<TPayload = unknown> = new (
  payload: TPayload
) => BaseEvent<TPayload>;

export type EventInstance<TPayload = unknown> = InstanceType<
  BaseEventSubClass<TPayload>
>;
