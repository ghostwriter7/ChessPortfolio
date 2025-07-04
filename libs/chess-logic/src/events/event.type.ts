import { GameEvents, GameEventsPayloadMap } from './game.events';
import { LobbyEvents, LobbyEventsPayloadMap } from './lobby.events';

export type AppEvent = GameEvents | LobbyEvents;

type AppEventPayloadMap = GameEventsPayloadMap & LobbyEventsPayloadMap;

export type AppEventPayload<T extends AppEvent> = AppEventPayloadMap[T];

export type EventHandler<T extends AppEvent> = (
  payload: AppEventPayload<T>
) => void;
