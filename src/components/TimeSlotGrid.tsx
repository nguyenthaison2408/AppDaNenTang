import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Clock, Lock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { TimeSlot, TimeSlotId } from '../types/booking';
import { TIME_SLOTS } from '../data/mockRooms';
import { useBookingStore } from '../store/useBookingStore';

interface TimeSlotGridProps {
  roomId: string;
  selectedDate: string;
  selectedSlotId: TimeSlotId | null;
  onSelectSlot: (slot: TimeSlot) => void;
}

export const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({
  roomId,
  selectedDate,
  selectedSlotId,
  onSelectSlot,
}) => {
  const { bookings, currentUser } = useBookingStore();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Clock size={15} color="#60A5FA" />
          <Text style={styles.title}>Chọn ca học (Khung cố định 2 tiếng):</Text>
        </View>
        <Text style={styles.subHint}>Hệ thống tự động khoá ca đã trùng</Text>
      </View>

      <View style={styles.grid}>
        {TIME_SLOTS.map((slot) => {
          // Check if this slot is already booked for this room on this date
          const existingBooking = bookings.find(
            (b) =>
              b.roomId === roomId &&
              b.date === selectedDate &&
              b.slotId === slot.id &&
              b.status !== 'CANCELLED'
          );

          // Check if current user already booked another room in this exact slot
          const userHasConflict = bookings.find(
            (b) =>
              b.studentId === currentUser.studentId &&
              b.date === selectedDate &&
              b.slotId === slot.id &&
              b.roomId !== roomId &&
              b.status !== 'CANCELLED'
          );

          const isBooked = !!existingBooking;
          const isUserConflict = !!userHasConflict;
          const isDisabled = isBooked || isUserConflict;
          const isSelected = selectedSlotId === slot.id;

          return (
            <TouchableOpacity
              key={slot.id}
              disabled={isDisabled}
              onPress={() => onSelectSlot(slot)}
              style={[
                styles.slotCard,
                isSelected && styles.slotCardSelected,
                isDisabled && styles.slotCardDisabled,
              ]}
              activeOpacity={0.7}
            >
              {/* Top row in slot: Period & Status */}
              <View style={styles.slotTopRow}>
                <Text
                  style={[
                    styles.periodTag,
                    isSelected && styles.periodTagSelected,
                    isDisabled && styles.periodTagDisabled,
                  ]}
                >
                  Ca {slot.period}
                </Text>

                {isDisabled ? (
                  <View style={styles.statusLockedBadge}>
                    <Lock size={10} color="#F87171" />
                    <Text style={styles.lockedText}>
                      {isBooked ? 'Đã có người đặt' : 'Bạn trùng ca khác'}
                    </Text>
                  </View>
                ) : isSelected ? (
                  <CheckCircle2 size={14} color="#60A5FA" />
                ) : (
                  <View style={styles.availableBadge}>
                    <View style={styles.availableDot} />
                    <Text style={styles.availableText}>Còn trống</Text>
                  </View>
                )}
              </View>

              {/* Time Label */}
              <Text
                style={[
                  styles.timeLabel,
                  isSelected && styles.timeLabelSelected,
                  isDisabled && styles.timeLabelDisabled,
                ]}
              >
                {slot.label}
              </Text>

              {/* Conflict indicator note */}
              {isBooked && (
                <Text style={styles.bookedByNote} numberOfLines={1}>
                  Đặt bởi: {existingBooking?.studentName} ({existingBooking?.studentId})
                </Text>
              )}
              {isUserConflict && (
                <Text style={styles.conflictNote} numberOfLines={1}>
                  Trùng với {userHasConflict?.roomCode}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
  },
  subHint: {
    fontSize: 10,
    color: '#94A3B8',
  },
  grid: {
    gap: 8,
  },
  slotCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  slotCardSelected: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
    boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.4)',
  },
  slotCardDisabled: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.65,
  },
  slotTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  periodTag: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  periodTagSelected: {
    color: '#93C5FD',
  },
  periodTagDisabled: {
    color: '#64748B',
  },
  statusLockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  lockedText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#F87171',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availableDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  availableText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#34D399',
  },
  timeLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  timeLabelSelected: {
    color: '#FFFFFF',
  },
  timeLabelDisabled: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  bookedByNote: {
    fontSize: 10,
    color: '#F87171',
    marginTop: 2,
    fontStyle: 'italic',
  },
  conflictNote: {
    fontSize: 10,
    color: '#FBBF24',
    marginTop: 2,
    fontStyle: 'italic',
  },
});

