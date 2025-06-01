import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

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
  }),
});
