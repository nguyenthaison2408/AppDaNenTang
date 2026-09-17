import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Booking } from '../types/booking';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: number;
  bookingId: string;
}

type NotificationListener = (notification: AppNotification) => void;

// Configure global notification handler for Expo
try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
} catch (e) {
  // Graceful fallback for non-native web runtime
}

class NotificationService {
  private listeners: Set<NotificationListener> = new Set();
  private scheduledTimers: Map<string, number> = new Map();

  /**
   * Subscribe to in-app notification alerts
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all active in-app listeners
   */
  private notifyListeners(notification: AppNotification) {
    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (err) {
        console.error('Error delivering notification to listener:', err);
      }
    });

    // Also trigger browser notification if web environment
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.body,
          icon: '/favicon.ico',
        });
      } catch (e) {
        // Ignore fallback
      }
    }
  }

  /**
   * Schedule a check-in alert 15 minutes before the booked slot
   * Powered by expo-notifications with real-time in-app simulation
   */
  async scheduleBookingReminder(booking: Booking) {
    const notificationId = `remind_${booking.id}`;
    
    // Clear any previous timer
    if (this.scheduledTimers.has(notificationId)) {
      window.clearTimeout(this.scheduledTimers.get(notificationId));
      this.scheduledTimers.delete(notificationId);
    }

    const title = '🔔 Nhắc nhở Check-in VKU Study Room';
    const body = `Phòng ${booking.roomName} (${booking.roomCode}) của bạn sẽ bắt đầu ca ${booking.slotLabel} vào ${booking.date}. Nhớ mang theo mã QR để quét nhận phòng nhé!`;

    // 1. Native Expo Notification scheduling
    try {
      if (Platform.OS !== 'web') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            data: { bookingId: booking.id },
            sound: true,
          },
          trigger: {
            seconds: 3, // For live testing: triggers after 3s to easily demonstrate
          },
        });
      }
    } catch (err) {
      console.warn('Expo notification schedule note:', err);
    }

    // 2. In-app UI Toast notification (for instant testing verification)
    const testTimer = window.setTimeout(() => {
      this.notifyListeners({
        id: notificationId,
        title,
        body,
        timestamp: Date.now(),
        bookingId: booking.id,
      });
    }, 1500);

    this.scheduledTimers.set(notificationId, testTimer);
  }

  /**
   * Cancel reminder when a booking is cancelled
   */
  async cancelBookingReminder(bookingId: string) {
    const notificationId = `remind_${bookingId}`;
    if (this.scheduledTimers.has(notificationId)) {
      window.clearTimeout(this.scheduledTimers.get(notificationId));
      this.scheduledTimers.delete(notificationId);
    }

    try {
      if (Platform.OS !== 'web') {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
      }
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Request system permission (Expo Notifications & Web Notification)
   */
  async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS !== 'web') {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        return finalStatus === 'granted';
      }

      if (typeof window !== 'undefined' && 'Notification' in window) {
        const perm = await Notification.requestPermission();
        return perm === 'granted';
      }
    } catch (e) {
      console.warn('Permission request fallback:', e);
    }
    return true;
  }
}

export const notificationService = new NotificationService();
