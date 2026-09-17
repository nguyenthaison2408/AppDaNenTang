import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Bell, X, QrCode } from 'lucide-react';
import { notificationService, AppNotification } from '../services/notificationService';
import { useBookingStore } from '../store/useBookingStore';

export const NotificationToast: React.FC = () => {
  const [currentNotification, setCurrentNotification] = useState<AppNotification | null>(null);
  const { bookings, setActiveQRBooking } = useBookingStore();

  useEffect(() => {
    const unsubscribe = notificationService.subscribe((notification) => {
      setCurrentNotification(notification);

      // Auto dismiss after 8 seconds
      const timer = setTimeout(() => {
        setCurrentNotification((prev) => (prev?.id === notification.id ? null : prev));
      }, 8000);

      return () => clearTimeout(timer);
    });

    return () => unsubscribe();
  }, []);

  if (!currentNotification) return null;

  const handleOpenQR = () => {
    const foundBooking = bookings.find((b) => b.id === currentNotification.bookingId);
    if (foundBooking) {
      setActiveQRBooking(foundBooking);
    }
    setCurrentNotification(null);
  };

  return (
    <View style={styles.toastWrapper}>
      <View style={styles.toastContainer}>
        <View style={styles.iconCircle}>
          <Bell size={18} color="#FFFFFF" />
        </View>

        <View style={styles.contentCol}>
          <Text style={styles.title}>{currentNotification.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {currentNotification.body}
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity onPress={handleOpenQR} style={styles.qrBtn}>
              <QrCode size={13} color="#60A5FA" />
              <Text style={styles.qrBtnText}>Mở thẻ Check-in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setCurrentNotification(null)}
              style={styles.dismissBtn}
            >
              <Text style={styles.dismissText}>Đã hiểu</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => setCurrentNotification(null)}
          style={styles.closeIcon}
        >
          <X size={16} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 9999,
  },
  toastContainer: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B82F6',
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  contentCol: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 2,
  },
  body: {
    fontSize: 11,
    color: '#CBD5E1',
    lineHeight: 16,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  qrBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
  },
  dismissBtn: {
    paddingVertical: 4,
  },
  dismissText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  closeIcon: {
    padding: 4,
    marginLeft: 4,
  },
});
