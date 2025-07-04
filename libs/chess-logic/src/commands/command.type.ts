import { GameCommand, GameCommandPayloadMap } from './game.commands';
import { LobbyCommand, LobbyCommandPayloadMap } from './lobby.commands';

export type Command = LobbyCommand | GameCommand;

type CommandPayloadMap = LobbyCommandPayloadMap & GameCommandPayloadMap;

export type CommandPayload<T extends Command> = CommandPayloadMap[T];
