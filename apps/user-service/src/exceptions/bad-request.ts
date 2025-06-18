export class BadRequest extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
  }
}
