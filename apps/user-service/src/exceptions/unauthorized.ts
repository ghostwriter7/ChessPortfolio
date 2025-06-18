export class Unauthorized extends Error {
  constructor(message = 'Invalid credentials') {
    super(message);
  }
}
