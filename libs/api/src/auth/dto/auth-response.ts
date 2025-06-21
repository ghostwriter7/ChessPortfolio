export class AuthResponse {
  constructor(
    public readonly token: string,
    public readonly username: string
  ) {}
}
