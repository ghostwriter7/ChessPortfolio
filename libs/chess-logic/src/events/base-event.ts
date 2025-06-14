export abstract class BaseEvent<T = unknown> {
  public readonly createdAt = Date.now();

  public get name(): string {
    return this.constructor.name;
  }

  protected constructor(public readonly payload: T) {}
}

export type EventClass<TPayload = unknown> = new (
  payload: TPayload
) => BaseEvent<TPayload>;

export type EventInstance<TPayload = unknown> = InstanceType<
  EventClass<TPayload>
>;

export type EventHandler<TPayload = unknown> = (payload: TPayload) => void;
