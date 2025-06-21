export class UnauthorizedException extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
  }
}
