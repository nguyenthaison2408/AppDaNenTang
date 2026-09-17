import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useBookingStore } from '../store/useBookingStore';
import { Booking, BookingStatus } from '../types/booking';
import {
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Inbox,
  ArrowRight,
} from 'lucide-react';

export const MyBookingsScreen: React.FC = () => {
  const { bookings, cancelBooking, setActiveQRBooking, setActiveTab } = useBookingStore();
  const [filterTab, setFilterTab] = useState<'ALL' | 'ACTIVE' | 'HISTORY'>('ALL');

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'ACTIVE') return b.status === 'CONFIRMED';
    if (filterTab === 'HISTORY') return b.status === 'CHECKED_IN' || b.status === 'CANCELLED';
    return true;
  });

  const handleCancel = (booking: Booking) => {
    // Web confirm dialog
    const confirmed = window.confirm(
      `Bạn có chắc chắn muốn huỷ lịch đặt phòng ${booking.roomName} (${booking.slotLabel}, ngày ${booking.date}) không?`
    );
    if (confirmed) {
      cancelBooking(booking.id);
    }
  };

  const renderBookingItem = ({ item }: { item: Booking }) => {
    const isConfirmed = item.status === 'CONFIRMED';
    const isCheckedIn = item.status === 'CHECKED_IN';
    const isCancelled = item.status === 'CANCELLED';

    return (
      <View style={styles.bookingCard}>
        {/* Top Header of Card */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.bookingId}>{item.id}</Text>
            <Text style={styles.roomCodeTitle}>{item.roomCode} - {item.roomName}</Text>
          </View>
          <View
            style={[
              styles.statusPill,
              isConfirmed && styles.statusPillConfirmed,
              isCheckedIn && styles.statusPillCheckedIn,
              isCancelled && styles.statusPillCancelled,
            ]}
          >
            <Text
              style={[
                styles.statusPillText,
                isConfirmed && styles.statusPillTextConfirmed,
                isCheckedIn && styles.statusPillTextCheckedIn,
                isCancelled && styles.statusPillTextCancelled,
              ]}
            >
              {isConfirmed
                ? 'Chờ Check-in'
                : isCheckedIn
                ? 'Đã nhận phòng'
                : 'Đã huỷ'}
            </Text>
          </View>
        </View>

        {/* Card Details */}
        <View style={styles.detailsBox}>
          <View style={styles.metaRow}>
            <MapPin size={13} color="#60A5FA" />
            <Text style={styles.metaText}>
              Toà {item.building} • Tầng {item.floor}
            </Text>
          </View>

          <View style={styles.metaRow}>
            <Calendar size={13} color="#34D399" />
            <Text style={styles.metaText}>Ngày: {item.date}</Text>
          </View>

          <View style={styles.metaRow}>
            <Clock size={13} color="#FBBF24" />
            <Text style={styles.metaText}>Khung giờ: {item.slotLabel}</Text>
          </View>

          <Text style={styles.purposeText} numberOfLines={1}>
            Mục đích: {item.purpose} ({item.attendeesCount} người)
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.qrBtn}
            onPress={() => setActiveQRBooking(item)}
            activeOpacity={0.7}
          >
            <QrCode size={15} color="#FFFFFF" />
            <Text style={styles.qrBtnText}>Thẻ QR Check-in</Text>
          </TouchableOpacity>

          {isConfirmed && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancel(item)}
              activeOpacity={0.7}
            >
              <Trash2 size={14} color="#EF4444" />
              <Text style={styles.cancelBtnText}>Huỷ ca</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lịch Đặt Phòng Của Bạn</Text>
        <Text style={styles.headerSub}>
          Quản lý lịch học nhóm, kiểm tra mã QR và trạng thái phòng
        </Text>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'ALL' && styles.tabBtnActive]}
          onPress={() => setFilterTab('ALL')}
        >
          <Text style={[styles.tabText, filterTab === 'ALL' && styles.tabTextActive]}>
            Tất cả ({bookings.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'ACTIVE' && styles.tabBtnActive]}
          onPress={() => setFilterTab('ACTIVE')}
        >
          <Text style={[styles.tabText, filterTab === 'ACTIVE' && styles.tabTextActive]}>
            Sắp tới ({bookings.filter((b) => b.status === 'CONFIRMED').length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabBtn, filterTab === 'HISTORY' && styles.tabBtnActive]}
          onPress={() => setFilterTab('HISTORY')}
        >
          <Text style={[styles.tabText, filterTab === 'HISTORY' && styles.tabTextActive]}>
            Lịch sử ({bookings.filter((b) => b.status !== 'CONFIRMED').length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Bookings List */}
      <FlatList
        data={filteredBookings}
        keyExtractor={(item: Booking) => item.id}
        renderItem={renderBookingItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={48} color="#475569" />
            <Text style={styles.emptyTitle}>Chưa có lịch đặt phòng nào</Text>
            <Text style={styles.emptyDesc}>
              Khám phá ngay danh sách phòng học và phòng Lab hiện đại tại các toà A, B, C, V của VKU!
            </Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() => setActiveTab('explore')}
            >
              <Text style={styles.exploreBtnText}>Tìm phòng học ngay</Text>
              <ArrowRight size={15} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  headerSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  tabBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  tabBtnActive: {
    backgroundColor: '#2563EB',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  bookingCard: {
    backgroundColor: '#1E293B',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  bookingId: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
    letterSpacing: 0.5,
  },
  roomCodeTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginTop: 2,
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusPillConfirmed: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusPillCheckedIn: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPillCancelled: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusPillTextConfirmed: {
    color: '#FBBF24',
  },
  statusPillTextCheckedIn: {
    color: '#34D399',
  },
  statusPillTextCancelled: {
    color: '#F87171',
  },
  detailsBox: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    gap: 6,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  purposeText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qrBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  qrBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  cancelBtnText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: 12,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    marginBottom: 16,
  },
  exploreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  exploreBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
