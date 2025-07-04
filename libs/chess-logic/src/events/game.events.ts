import { Board } from '../types/board';
import { Color } from '../types/color';

export const GAME_STARTED_EVENT = 'GAME_STARTED' as const;
export const GAME_ENDED_EVENT = 'GAME_ENDED' as const;
export const BOARD_UPDATED_EVENT = 'BOARD_UPDATED' as const;
export const LOG_CREATED_EVENT = 'LOG_CREATED' as const;

export type BoardUpdatedEventPayload = Partial<Board>;
export type GameEndedEventPayload = string;
export type GameStartedEventPayload = { [color in Color]: string };
export type LogCreatedEventPayload = string;

export type GameEvents =
  | typeof GAME_STARTED_EVENT
  | typeof GAME_ENDED_EVENT
  | typeof BOARD_UPDATED_EVENT
  | typeof LOG_CREATED_EVENT;

export type GameEventsPayloadMap = {
  [GAME_STARTED_EVENT]: GameStartedEventPayload;
  [GAME_ENDED_EVENT]: GameEndedEventPayload;
  [BOARD_UPDATED_EVENT]: BoardUpdatedEventPayload;
  [LOG_CREATED_EVENT]: LogCreatedEventPayload;
};
