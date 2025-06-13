export class BaseCommand<T> {
  public readonly createdAt = Date.now();
  public readonly payload: T;

  public get name(): string {
    return this.constructor.name;
  }

  constructor(payload: T) {
    this.payload = payload;
  }
}

export type BaseCommandSubClass<TPayload = unknown> = new (
  payload: TPayload
) => BaseCommand<TPayload>;

export type CommandInstance<TPayload = unknown> = InstanceType<BaseCommandSubClass<TPayload>>;
