import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Room } from '../types/room';
import { TimeSlot, TimeSlotId } from '../types/booking';
import { useBookingStore } from '../store/useBookingStore';
import { DateSelector } from './DateSelector';
import { TimeSlotGrid } from './TimeSlotGrid';
import {
  X,
  MapPin,
  Users,
  Tv,
  PenTool,
  Monitor,
  Wind,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RoomDetailModalProps {
  room: Room | null;
  onClose: () => void;
}

export const RoomDetailModal: React.FC<RoomDetailModalProps> = ({
  room,
  onClose,
}) => {
  const {
    selectedDate,
    setSelectedDate,
    createBooking,
    currentUser,
    setActiveQRBooking,
    setActiveTab,
  } = useBookingStore();

  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [purpose, setPurpose] = useState<string>('Học nhóm & Làm đồ án học phần');
  const [attendeesCount, setAttendeesCount] = useState<string>('4');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!room) return null;

  const handleConfirmBooking = () => {
    if (!selectedSlot) {
      setErrorMessage('Vui lòng chọn một ca học còn trống.');
      return;
    }

    const count = parseInt(attendeesCount, 10) || 2;
    if (count > room.capacity) {
      setErrorMessage(`Số lượng thành viên tối đa của phòng này là ${room.capacity} sinh viên.`);
      return;
    }

    const result = createBooking({
      roomId: room.id,
      roomName: room.name,
      roomCode: room.code,
      building: room.building,
      floor: room.floor,
      slotId: selectedSlot.id,
      slotLabel: selectedSlot.label,
      date: selectedDate,
      purpose,
      attendeesCount: count,
    });

    if (result.success && result.booking) {
      // Confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.5 },
      });

      onClose();
      // Open QR pass directly
      setActiveQRBooking(result.booking);
    } else {
      setErrorMessage(result.error || 'Không thể đặt phòng. Vui lòng thử lại.');
    }
  };

  return (
    <Modal visible={!!room} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <Text style={styles.headerTitle}>Chi tiết & Đặt phòng</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Room Image & Badge */}
            <View style={styles.heroImageContainer}>
              <Image
                source={{ uri: room.photo }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.codeTag}>
                <Text style={styles.codeText}>{room.code}</Text>
              </View>
            </View>

            {/* Room Info */}
            <View style={styles.infoSection}>
              <Text style={styles.roomName}>{room.name}</Text>
              
              <View style={styles.metaRow}>
                <View style={styles.metaItem}>
                  <MapPin size={14} color="#60A5FA" />
                  <Text style={styles.metaText}>
                    Toà {room.building} • Tầng {room.floor}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Users size={14} color="#34D399" />
                  <Text style={styles.metaText}>
                    Sức chứa tối đa: {room.capacity} người
                  </Text>
                </View>
              </View>

              <Text style={styles.description}>{room.description}</Text>

              {/* Equipment Tags */}
              <View style={styles.equipmentRow}>
                {room.equipment.map((eq) => (
                  <View key={eq} style={styles.eqTag}>
                    <Text style={styles.eqTagText}>✓ {eq}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionDivider} />

            {/* Step 1: 7-day Date Selector */}
            <DateSelector
              selectedDate={selectedDate}
              onSelectDate={(d) => {
                setSelectedDate(d);
                setSelectedSlot(null);
                setErrorMessage(null);
              }}
            />

            {/* Step 2: 2-hour Time Slot Grid */}
            <TimeSlotGrid
              roomId={room.id}
              selectedDate={selectedDate}
              selectedSlotId={selectedSlot?.id || null}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setErrorMessage(null);
              }}
            />

            {/* Step 3: Purpose & Attendees */}
            <View style={styles.formSection}>
              <Text style={styles.formTitle}>Thông tin đăng ký sử dụng:</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mục đích sử dụng:</Text>
                <TextInput
                  style={styles.textInput}
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="Ví dụ: Họp nhóm môn Lập trình Đa nền tảng..."
                  placeholderTextColor="#64748B"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Số thành viên tham gia (Tối đa {room.capacity}):</Text>
                <TextInput
                  style={styles.textInput}
                  value={attendeesCount}
                  onChangeText={setAttendeesCount}
                  keyboardType="numeric"
                  placeholder="4"
                  placeholderTextColor="#64748B"
                />
              </View>
            </View>

            {/* Error Message banner */}
            {errorMessage && (
              <View style={styles.errorBanner}>
                <AlertCircle size={16} color="#EF4444" />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            )}

            {/* Summary & Confirm Button */}
            <View style={styles.footerContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Thời gian chọn:</Text>
                <Text style={styles.summaryValue}>
                  {selectedSlot ? `${selectedDate} | ${selectedSlot.label}` : 'Chưa chọn ca'}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.confirmBtn,
                  !selectedSlot && styles.confirmBtnDisabled,
                ]}
                onPress={handleConfirmBooking}
                disabled={!selectedSlot}
                activeOpacity={0.8}
              >
                <Sparkles size={16} color="#FFFFFF" />
                <Text style={styles.confirmBtnText}>
                  {selectedSlot ? 'Xác nhận & Nhận mã QR' : 'Vui lòng chọn ca học'}
                </Text>
              </TouchableOpacity>
            </View>
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
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  heroImageContainer: {
    position: 'relative',
    height: 170,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  codeTag: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  codeText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
  },
  infoSection: {
    marginBottom: 12,
  },
  roomName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  description: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 18,
    marginBottom: 10,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  eqTag: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
  },
  eqTagText: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 10,
  },
  formSection: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  formTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  inputGroup: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: '#1E293B',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#FFFFFF',
    fontSize: 12,
    borderWidth: 1,
    borderColor: '#334155',
    outlineStyle: 'none' as any,
  },
  errorBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 10,
  },
  errorBannerText: {
    color: '#F87171',
    fontSize: 12,
    flex: 1,
  },
  footerContainer: {
    marginTop: 10,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60A5FA',
  },
  confirmBtn: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.4)',
  },
  confirmBtnDisabled: {
    backgroundColor: '#334155',
    boxShadow: 'none',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});

