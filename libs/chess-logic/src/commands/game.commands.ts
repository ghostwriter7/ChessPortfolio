import { Position } from '../types/position';

export const JOIN_GAME_COMMAND = 'JOIN_GAME' as const;
export const LEAVE_GAME_COMMAND = 'LEAVE_GAME' as const;
export const MAKE_MOVE_COMMAND = 'MAKE_MOVE' as const;

export type JoinGameCommandPayload = { gameId: string };
export type JoinGameCommandCallback = (
  message: string,
  errorCode?: string
) => void;
export type LeaveGameCommandPayload = { reason: string };
export type MakeMoveCommandPayload = {
  from: Position;
  to: Position;
};

export type GameCommand =
  | typeof JOIN_GAME_COMMAND
  | typeof LEAVE_GAME_COMMAND
  | typeof MAKE_MOVE_COMMAND;

export type GameCommandPayloadMap = {
  [JOIN_GAME_COMMAND]: JoinGameCommandPayload;
  [LEAVE_GAME_COMMAND]: LeaveGameCommandPayload;
  [MAKE_MOVE_COMMAND]: MakeMoveCommandPayload;
};
