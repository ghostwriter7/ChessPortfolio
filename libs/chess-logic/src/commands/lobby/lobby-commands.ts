export const CHALLENGE_PLAYER_COMMAND = 'CHALLENGE_PLAYER';
export const LOGIN_COMMAND = 'LOGIN';

export type LoginCommandPayload = { token: string };
export type ChallengePlayerCommandPayload = { opponent: string };
