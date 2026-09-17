import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Search, X, Building2, Bell } from 'lucide-react';
import { useBookingStore } from '../store/useBookingStore';

interface HeaderProps {
  onSearchChange?: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = () => {
  const { currentUser, filter, setFilter, bookings, setActiveTab } = useBookingStore();
  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <View style={styles.container}>
      {/* Top Bar with VKU Branding & Student Profile */}
      <View style={styles.topRow}>
        <View style={styles.branding}>
          <View style={styles.logoBadge}>
            <Building2 size={20} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.appName}>VKU Study Space</Text>
            <Text style={styles.appSub}>Hệ thống Đặt Phòng Học VKU</Text>
          </View>
        </View>

        <View style={styles.userActions}>
          <TouchableOpacity
            style={styles.bellButton}
            onPress={() => setActiveTab('my-bookings')}
            activeOpacity={0.7}
          >
            <Bell size={20} color="#F8FAFC" />
            {activeBookingsCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{activeBookingsCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveTab('profile')}
            style={styles.avatarContainer}
            activeOpacity={0.8}
          >
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Greeting */}
      <View style={styles.greetingBox}>
        <Text style={styles.greetingText}>
          Chào bạn, <Text style={styles.studentName}>{currentUser.name}</Text> 👋
        </Text>
        <Text style={styles.greetingSub}>
          Tìm phòng tự học, thảo luận nhóm hoặc phòng Lab tại cơ sở VKU
        </Text>
      </View>

      {/* Instant Search Bar */}
      <View style={styles.searchContainer}>
        <Search size={18} color="#94A3B8" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm phòng theo tên, mã phòng (VD: Lab 301, V.A301, Thư viện)..."
          placeholderTextColor="#64748B"
          value={filter.searchQuery}
          onChangeText={(text: string) => setFilter({ searchQuery: text })}
        />
        {filter.searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setFilter({ searchQuery: '' })}
            style={styles.clearButton}
          >
            <X size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  appSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  userActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bellButton: {
    position: 'relative',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  avatarContainer: {
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#3B82F6',
    overflow: 'hidden',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  greetingBox: {
    marginBottom: 12,
  },
  greetingText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  studentName: {
    color: '#60A5FA',
  },
  greetingSub: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    outlineStyle: 'none' as any,
  },
  clearButton: {
    padding: 4,
  },
});
