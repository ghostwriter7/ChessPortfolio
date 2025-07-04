export const CHALLENGE_PLAYER_COMMAND = 'CHALLENGE_PLAYER';
export const LOGIN_COMMAND = 'LOGIN';

export type LoginCommandPayload = { token: string };
export type ChallengePlayerCommandPayload = { opponent: string };
export type ChallengePlayerCommandCallback = (result: {
  response: boolean;
  message?: string;
}) => void;

export type LobbyCommand =
  | typeof CHALLENGE_PLAYER_COMMAND
  | typeof LOGIN_COMMAND;

export type LobbyCommandPayloadMap = {
  [CHALLENGE_PLAYER_COMMAND]: ChallengePlayerCommandPayload;
  [LOGIN_COMMAND]: LoginCommandPayload;
};
