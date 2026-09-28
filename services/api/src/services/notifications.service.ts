import { prisma } from '../utils/prisma';

export interface CreateNotificationInput {
  userId: string;
  studentProfileId?: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export async function createNotification(input: CreateNotificationInput) {
  return prisma.notification.create({
    data: {
      userId: input.userId,
      studentProfileId: input.studentProfileId,
      type: input.type,
      title: input.title,
      body: input.body,
      data: input.data ? JSON.stringify(input.data) : null,
    },
  });
}

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: [{ isRead: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function markRead(notificationId: string, userId: string) {
  const notification = await prisma.notification.findFirst({
    where: { id: notificationId, userId },
  });
  if (!notification) throw Object.assign(new Error('Notification not found'), { statusCode: 404 });

  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  });
}

export async function markAllRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, isRead: false },
    data: { isRead: true },
  });
}
