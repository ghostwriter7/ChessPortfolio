export abstract class BaseCommand<T> {
  public readonly createdAt = Date.now();

  public get name(): string {
    return this.constructor.name;
  }

  protected constructor(public readonly payload: T) {}
}

export type BaseCommandSubClass<TPayload = unknown> = new (
  payload: TPayload
) => BaseCommand<TPayload>;

export type CommandInstance<TPayload = unknown> = InstanceType<
  BaseCommandSubClass<TPayload>
>;
