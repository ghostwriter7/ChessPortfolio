export const EMAIL_NOTIFICATION_REQUESTED =
  'EMAIL_NOTIFICATION_REQUESTED' as const;

export type EventName = typeof EMAIL_NOTIFICATION_REQUESTED;

export type EventToPayload = {
  [EMAIL_NOTIFICATION_REQUESTED]: {
    email: string;
    subject: string;
    message: string;
  };
};
