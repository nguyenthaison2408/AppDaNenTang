import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView, Platform } from 'react-native';
import { AppQRCode } from './QRCodeAdapter';
import { Booking } from '../types/booking';
import { useBookingStore } from '../store/useBookingStore';
import { X, CheckCircle2, QrCode, MapPin, Clock, Calendar, User, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRCheckinModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const QRCheckinModal: React.FC<QRCheckinModalProps> = ({
  booking,
  onClose,
}) => {
  const { checkInBooking } = useBookingStore();

  if (!booking) return null;

  const isCheckedIn = booking.status === 'CHECKED_IN';
  const isCancelled = booking.status === 'CANCELLED';

  const handleSimulateScan = () => {
    checkInBooking(booking.id);
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <Modal visible={!!booking} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.titleGroup}>
              <QrCode size={18} color="#60A5FA" />
              <Text style={styles.modalTitle}>Thẻ Thông Hành Check-in</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Ticket Card */}
            <View style={styles.ticketCard}>
              {/* VKU Badge Bar */}
              <View style={styles.ticketTop}>
                <View>
                  <Text style={styles.ticketBrand}>VKU CAMPUS PASS</Text>
                  <Text style={styles.bookingIdText}>{booking.id}</Text>
                </View>
                <View
                  style={[
                    styles.statusTag,
                    isCheckedIn && styles.statusTagCheckedIn,
                    isCancelled && styles.statusTagCancelled,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusTagText,
                      isCheckedIn && styles.statusTagTextCheckedIn,
                      isCancelled && styles.statusTagTextCancelled,
                    ]}
                  >
                    {isCheckedIn
                      ? 'ĐÃ CHECK-IN'
                      : isCancelled
                      ? 'ĐÃ HUỶ'
                      : 'CHỜ CHECK-IN'}
                  </Text>
                </View>
              </View>

              {/* QR Code Container */}
              <View style={styles.qrWrapper}>
                <View style={styles.qrInnerFrame}>
                  <AppQRCode value={booking.qrCodeData} size={170} />
                </View>
                <Text style={styles.qrHelperText}>
                  Đưa mã này trước camera/máy quét tại cửa phòng để mở cửa
                </Text>
              </View>

              {/* Ticket Cutout Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.cutoutLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.cutoutRight} />
              </View>

              {/* Ticket Details */}
              <View style={styles.ticketDetails}>
                <View style={styles.detailRow}>
                  <MapPin size={14} color="#60A5FA" />
                  <View style={styles.detailTextCol}>
                    <Text style={styles.detailLabel}>Phòng học / Lab</Text>
                    <Text style={styles.detailValue}>
                      {booking.roomName} ({booking.roomCode})
                    </Text>
                    <Text style={styles.subDetailValue}>
                      Toà {booking.building} - Tầng {booking.floor}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Calendar size={14} color="#34D399" />
                  <View style={styles.detailTextCol}>
                    <Text style={styles.detailLabel}>Ngày sử dụng</Text>
                    <Text style={styles.detailValue}>{booking.date}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Clock size={14} color="#FBBF24" />
                  <View style={styles.detailTextCol}>
                    <Text style={styles.detailLabel}>Khung giờ</Text>
                    <Text style={styles.detailValue}>{booking.slotLabel}</Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <User size={14} color="#A78BFA" />
                  <View style={styles.detailTextCol}>
                    <Text style={styles.detailLabel}>Người đại diện nhóm</Text>
                    <Text style={styles.detailValue}>
                      {booking.studentName} ({booking.studentId})
                    </Text>
                    <Text style={styles.subDetailValue}>
                      Mục đích: {booking.purpose} ({booking.attendeesCount} người)
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            {!isCheckedIn && !isCancelled && (
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={handleSimulateScan}
                activeOpacity={0.8}
              >
                <ShieldCheck size={18} color="#FFFFFF" />
                <Text style={styles.simulateScanBtnText}>
                  Mô phỏng Quét Check-in Tại Cửa Phòng
                </Text>
              </TouchableOpacity>
            )}

            {isCheckedIn && (
              <View style={styles.checkedInSuccessBanner}>
                <CheckCircle2 size={20} color="#10B981" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.checkedInTitle}>Check-in thành công!</Text>
                  <Text style={styles.checkedInDesc}>
                    Cửa phòng đã mở khóa. Chúc bạn và nhóm có buổi học hiệu quả!
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
  },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  ticketTop: {
    backgroundColor: '#0F172A',
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketBrand: {
    fontSize: 10,
    fontWeight: '800',
    color: '#60A5FA',
    letterSpacing: 1,
  },
  bookingIdText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusTagCheckedIn: {
    backgroundColor: '#D1FAE5',
  },
  statusTagCancelled: {
    backgroundColor: '#FEE2E2',
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#D97706',
  },
  statusTagTextCheckedIn: {
    color: '#059669',
  },
  statusTagTextCancelled: {
    color: '#DC2626',
  },
  qrWrapper: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  qrInnerFrame: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  qrHelperText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 260,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  cutoutLeft: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    marginLeft: -10,
  },
  cutoutRight: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    marginRight: -10,
  },
  dashedLine: {
    flex: 1,
    height: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
  },
  ticketDetails: {
    backgroundColor: '#F8FAFC',
    padding: 14,
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
  },
  detailTextCol: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  subDetailValue: {
    fontSize: 11,
    color: '#475569',
    marginTop: 1,
  },
  simulateScanBtn: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  simulateScanBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  checkedInSuccessBanner: {
    marginTop: 14,
    backgroundColor: '#064E3B',
    borderColor: '#059669',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkedInTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#6EE7B7',
  },
  checkedInDesc: {
    fontSize: 11,
    color: '#D1FAE5',
    marginTop: 2,
  },
});

