import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { useBookingStore } from './store/useBookingStore';
import { HomeScreen } from './screens/HomeScreen';
import { MyBookingsScreen } from './screens/MyBookingsScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { NotificationToast } from './components/NotificationToast';
import { QRCheckinModal } from './components/QRCheckinModal';
import { Compass, CalendarCheck, User, Wifi, Battery, Signal } from 'lucide-react';

export const App: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    bookings,
    activeQRBooking,
    setActiveQRBooking,
    loadInitialData,
  } = useBookingStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const activeBookingsCount = bookings.filter((b) => b.status === 'CONFIRMED').length;

  return (
    <SafeAreaView style={styles.outerContainer}>
      {/* Smartphone Frame Simulation Container */}
      <View style={styles.phoneFrame}>
        {/* Mobile Status Bar (Simulated) */}
        <View style={styles.statusBar}>
          <Text style={styles.statusTime}>09:41</Text>
          <View style={styles.islandPill}>
            <View style={styles.cameraHole} />
          </View>
          <View style={styles.statusIcons}>
            <Signal size={12} color="#FFFFFF" />
            <Wifi size={12} color="#FFFFFF" />
            <Battery size={13} color="#FFFFFF" />
          </View>
        </View>

        {/* In-app Notification Banner */}
        <NotificationToast />

        {/* Main Screen Content */}
        <View style={styles.screenContent}>
          {activeTab === 'explore' && <HomeScreen />}
          {activeTab === 'my-bookings' && <MyBookingsScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </View>

        {/* Interactive QR Check-in Modal */}
        <QRCheckinModal
          booking={activeQRBooking}
          onClose={() => setActiveQRBooking(null)}
        />

        {/* Bottom Tab Navigation Bar */}
        <View style={styles.tabBar}>
          {/* Tab 1: Explore Rooms */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('explore')}
            activeOpacity={0.7}
          >
            <Compass
              size={22}
              color={activeTab === 'explore' ? '#3B82F6' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'explore' && styles.tabLabelActive,
              ]}
            >
              Phòng học
            </Text>
          </TouchableOpacity>

          {/* Tab 2: My Bookings with Badge */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('my-bookings')}
            activeOpacity={0.7}
          >
            <View style={styles.tabIconWrapper}>
              <CalendarCheck
                size={22}
                color={activeTab === 'my-bookings' ? '#3B82F6' : '#64748B'}
              />
              {activeBookingsCount > 0 && (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{activeBookingsCount}</Text>
                </View>
              )}
            </View>
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'my-bookings' && styles.tabLabelActive,
              ]}
            >
              Lịch của tôi
            </Text>
          </TouchableOpacity>

          {/* Tab 3: Profile */}
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.7}
          >
            <User
              size={22}
              color={activeTab === 'profile' ? '#3B82F6' : '#64748B'}
            />
            <Text
              style={[
                styles.tabLabel,
                activeTab === 'profile' && styles.tabLabelActive,
              ]}
            >
              Tài khoản
            </Text>
          </TouchableOpacity>
        </View>

        {/* Home Indicator Bar */}
        <View style={styles.homeIndicatorBar}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0A0F1D',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 440,
    height: '100%',
    maxHeight: 900,
    backgroundColor: '#0F172A',
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 8,
    borderColor: '#1E293B',
    boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  statusBar: {
    height: 40,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.2,
  },
  islandPill: {
    width: 60,
    height: 12,
    backgroundColor: '#0F172A',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraHole: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#1E293B',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  screenContent: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  tabBar: {
    height: 60,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 6,
  },
  tabIconWrapper: {
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#3B82F6',
    fontWeight: '700',
  },
  homeIndicatorBar: {
    height: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    backgroundColor: '#64748B',
    borderRadius: 2,
  },
});

