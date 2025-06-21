export class InternalServerException extends Error {
  constructor(message = 'Internal server error') {
    super(message);
  }
}
