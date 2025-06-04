// Send a remote push notification to a collaborator (requires their Expo push token)
export async function sendPushNotificationToUser({
  expoPushToken,
  title,
  body,
  data,
}: {
  expoPushToken: string;
  title: string;
  body: string;
  data?: Record<string, any>;
}) {
  if (!expoPushToken) return;
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
    }),
  });
}

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Trigger a local notification for to-do sharing/unsharing
export async function triggerToDoShareNotification({
  todoTitle,
  userId,
  action,
}: {
  todoTitle: string;
  userId: string;
  action: 'shared' | 'unshared';
}) {
  const title = `To-Do ${action === 'shared' ? 'Shared' : 'Unshared'}`;
  const body = `To-Do "${todoTitle}" was ${action} with ${userId}.`;
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: null, // immediate
  });
}

export async function requestNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleHabitNotification({
  identifier,
  title,
  body,
  trigger,
}: {
  identifier: string;
  title: string;
  body: string;
  trigger: Notifications.NotificationTriggerInput;
}) {
  return Notifications.scheduleNotificationAsync({
    identifier,
    content: { title, body },
    trigger,
  });
}

export async function cancelScheduledNotification(identifier: string) {
  return Notifications.cancelScheduledNotificationAsync(identifier);
}

export async function getAllScheduledNotifications() {
  return Notifications.getAllScheduledNotificationsAsync();
}

// Configure notification handler (foreground behavior)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    // For iOS 15+ (Expo SDK 49+):
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
