export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface TokensWithUsername extends Tokens {
  username: string;
}
