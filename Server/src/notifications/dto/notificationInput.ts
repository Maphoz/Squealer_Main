export class NotificationInput {
  notificationType: string;

  senderType: string;

  senderId: string;

  senderName?: string;

  channelName?: string;

  channelReceiverId?: string;

  squealId?: string;

  receiversId: string[];
}
