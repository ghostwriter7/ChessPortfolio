export class BadRequestException extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, { cause });
  }
}
