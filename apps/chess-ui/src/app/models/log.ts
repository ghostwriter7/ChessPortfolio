export class Log {
  constructor(
    public readonly message: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
