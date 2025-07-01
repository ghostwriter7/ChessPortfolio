export const EMAIL_NOTIFICATION_REQUESTED =
  'EMAIL_NOTIFICATION_REQUESTED' as const;
export const PLAYERS_MATCHED = 'PLAYERS_MATCHED' as const;

export type EventName =
  | typeof EMAIL_NOTIFICATION_REQUESTED
  | typeof PLAYERS_MATCHED;

export type PlayersMatchedPayload = {
  gameId: string;
  playerA: string;
  playerB: string;
};

export type EmailNotificationRequestedPayload = {
  email: string;
  subject: string;
  message: string;
};

export type EventToPayload = {
  [EMAIL_NOTIFICATION_REQUESTED]: EmailNotificationRequestedPayload;
  [PLAYERS_MATCHED]: PlayersMatchedPayload;
};
