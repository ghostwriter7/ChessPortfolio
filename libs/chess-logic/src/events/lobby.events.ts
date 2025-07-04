export const PLAYER_JOINED_EVENT = 'PLAYER_JOINED';
export const PLAYER_LEFT_EVENT = 'PLAYER_LEFT';
export const PLAYER_LIST_CHANGED_EVENT = 'PLAYER_LIST_CHANGED';
export const PLAYERS_MATCHED_EVENT = 'PLAYERS_MATCHED';
export const GAME_REQUESTED_EVENT = 'GAME_REQUESTED';

export type LobbyEvents =
  | typeof PLAYER_JOINED_EVENT
  | typeof PLAYER_LEFT_EVENT
  | typeof PLAYER_LIST_CHANGED_EVENT
  | typeof PLAYERS_MATCHED_EVENT
  | typeof GAME_REQUESTED_EVENT;

export type PlayerJoinedEventPayload = { username: string };
export type PlayerLeftEventPayload = { username: string };
export type PlayerListChangedEventPayload = { usernames: string[] };
export type PlayersMatchedEventPayload = {
  gameId: string;
  playerA: string;
  playerB: string;
};
export type GameRequestedEventPayload = { opponent: string };

export type LobbyEventsPayloadMap = {
  [PLAYER_JOINED_EVENT]: PlayerJoinedEventPayload;
  [PLAYER_LEFT_EVENT]: PlayerLeftEventPayload;
  [PLAYER_LIST_CHANGED_EVENT]: PlayerListChangedEventPayload;
  [PLAYERS_MATCHED_EVENT]: PlayersMatchedEventPayload;
  [GAME_REQUESTED_EVENT]: GameRequestedEventPayload;
};
