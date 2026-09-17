import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useBookingStore } from '../store/useBookingStore';
import { notificationService } from '../services/notificationService';
import {
  User,
  GraduationCap,
  Mail,
  Building,
  Bell,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const { currentUser, bookings, resetFilter, loadInitialData } = useBookingStore();

  const totalBookings = bookings.length;
  const checkedInCount = bookings.filter((b) => b.status === 'CHECKED_IN').length;
  const activeCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  const handleTriggerTestReminder = () => {
    notificationService.scheduleBookingReminder({
      id: 'VKU-TEST-99',
      roomId: 'room_va301',
      roomName: 'Phòng Nghiên cứu AI & Data Lab',
      roomCode: 'V.A301',
      building: 'V',
      floor: 3,
      date: 'Hôm nay',
      slotId: 'slot_0730_0930',
      slotLabel: '07:30 - 09:30',
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      purpose: 'Thử nghiệm tính năng Local Notification',
      attendeesCount: 4,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      qrCodeData: 'VKU_TEST',
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Student Profile Card */}
      <View style={styles.profileCard}>
        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
        <Text style={styles.userName}>{currentUser.name}</Text>
        <Text style={styles.userRole}>Sinh viên Đại học VKU</Text>

        <View style={styles.badgeRow}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>MSSV: {currentUser.studentId}</Text>
          </View>
          <View style={styles.classBadge}>
            <Text style={styles.classText}>Lớp: {currentUser.classCode}</Text>
          </View>
        </View>

        <View style={styles.infoList}>
          <View style={styles.infoItem}>
            <Mail size={14} color="#60A5FA" />
            <Text style={styles.infoText}>{currentUser.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <GraduationCap size={14} color="#34D399" />
            <Text style={styles.infoText}>{currentUser.major}</Text>
          </View>
          <View style={styles.infoItem}>
            <Building size={14} color="#FBBF24" />
            <Text style={styles.infoText}>Đại học CNTT & TT Việt - Hàn (VKU)</Text>
          </View>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalBookings}</Text>
          <Text style={styles.statLabel}>Lượt đặt phòng</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#FBBF24' }]}>{activeCount}</Text>
          <Text style={styles.statLabel}>Chờ nhận phòng</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: '#34D399' }]}>{checkedInCount}</Text>
          <Text style={styles.statLabel}>Đã Check-in</Text>
        </View>
      </View>

      {/* Demo Controls & Testing Suite */}
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Sparkles size={16} color="#60A5FA" />
          <Text style={styles.sectionTitle}>Bộ công cụ Kiểm thử & Demo Mini-Project</Text>
        </View>

        <TouchableOpacity
          style={styles.actionRowBtn}
          onPress={handleTriggerTestReminder}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <Bell size={16} color="#60A5FA" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionBtnTitle}>Mô phỏng Local Notification</Text>
            <Text style={styles.actionBtnDesc}>
              Bắn thông báo nhắc Check-in trước 15 phút đến giờ đặt
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowBtn}
          onPress={() => notificationService.requestPermissions()}
          activeOpacity={0.7}
        >
          <View style={styles.actionIconBox}>
            <ShieldCheck size={16} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.actionBtnTitle}>Cấp quyền Web / Push Notifications</Text>
            <Text style={styles.actionBtnDesc}>Cho phép hệ thống gửi pop-up trên trình duyệt</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionRowBtn}
          onPress={() => {
            localStorage.clear();
            loadInitialData();
            alert('Đã reset toàn bộ dữ liệu về trạng thái mẫu ban đầu!');
          }}
          activeOpacity={0.7}
        >
          <View style={[styles.actionIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.15)' }]}>
            <RotateCcw size={16} color="#EF4444" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.actionBtnTitle, { color: '#F87171' }]}>
              Khôi phục Dữ liệu Mẫu (Reset Demo)
            </Text>
            <Text style={styles.actionBtnDesc}>Đặt lại các phòng mẫu và 2 lượt đặt thử nghiệm</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  profileCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#3B82F6',
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userRole: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 10,
  },
  idBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#60A5FA',
  },
  classBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  classText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34D399',
  },
  infoList: {
    width: '100%',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#334155',
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#CBD5E1',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#60A5FA',
  },
  statLabel: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  sectionCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  actionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 12,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  actionBtnDesc: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
});

