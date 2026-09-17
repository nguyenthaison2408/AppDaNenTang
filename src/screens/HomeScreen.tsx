import React, { useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import { Room } from '../types/room';
import { useBookingStore } from '../store/useBookingStore';
import { Header } from '../components/Header';
import { FilterBar } from '../components/FilterBar';
import { RoomCard } from '../components/RoomCard';
import { RoomDetailModal } from '../components/RoomDetailModal';
import { Sparkles, Inbox } from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { rooms, filter, selectedRoom, setSelectedRoom } = useBookingStore();

  // Multi-parameter filter engine
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // 1. Text Search (Room name or Code)
      if (filter.searchQuery.trim().length > 0) {
        const q = filter.searchQuery.toLowerCase().trim();
        const matchName = room.name.toLowerCase().includes(q);
        const matchCode = room.code.toLowerCase().includes(q);
        const matchBuilding = `toà ${room.building}`.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchBuilding) {
          return false;
        }
      }

      // 2. Building filter
      if (filter.selectedBuilding !== 'ALL') {
        if (room.building !== filter.selectedBuilding) {
          return false;
        }
      }

      // 3. Capacity range filter
      if (filter.capacityRange !== 'ALL') {
        if (filter.capacityRange === '2-5' && (room.capacity < 2 || room.capacity > 5)) {
          return false;
        }
        if (filter.capacityRange === '6-10' && (room.capacity < 6 || room.capacity > 10)) {
          return false;
        }
        if (filter.capacityRange === '10-20' && (room.capacity < 10 || room.capacity > 20)) {
          return false;
        }
        if (filter.capacityRange === '20+' && room.capacity <= 20) {
          return false;
        }
      }

      // 4. Equipment filter (room must have ALL selected equipments)
      if (filter.selectedEquipment.length > 0) {
        const hasAllEquipment = filter.selectedEquipment.every((eq) =>
          room.equipment.includes(eq)
        );
        if (!hasAllEquipment) {
          return false;
        }
      }

      return true;
    });
  }, [rooms, filter]);

  const handleRoomPress = useCallback((room: Room) => {
    setSelectedRoom(room);
  }, [setSelectedRoom]);

  const renderItem = useCallback(
    ({ item }: { item: Room }) => <RoomCard room={item} onPress={handleRoomPress} />,
    [handleRoomPress]
  );

  const keyExtractor = useCallback((item: Room) => item.id, []);

  // Performance optimization: getItemLayout avoids measuring dynamic layouts
  const getItemLayout = useCallback(
    (_data: any, index: number) => ({
      length: 340,
      offset: 340 * index,
      index,
    }),
    []
  );

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <Header />

      {/* Multi-parameter Filter Chips */}
      <FilterBar />

      {/* Count & Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <Sparkles size={14} color="#60A5FA" />
          <Text style={styles.countText}>
            Tìm thấy <Text style={styles.countBold}>{filteredRooms.length}</Text> phòng học phù hợp
          </Text>
        </View>
        <Text style={styles.fpsText}>60 FPS FlatList</Text>
      </View>

      {/* High Performance FlatList Feed */}
      <FlatList
        data={filteredRooms}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Inbox size={48} color="#475569" />
            <Text style={styles.emptyTitle}>Không tìm thấy phòng phù hợp</Text>
            <Text style={styles.emptyDesc}>
              Hãy thử chọn toà nhà khác hoặc xoá bớt các điều kiện lọc thiết bị.
            </Text>
          </View>
        }
      />

      {/* Detail & Booking Modal */}
      <RoomDetailModal
        room={selectedRoom}
        onClose={() => setSelectedRoom(null)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#0F172A',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  countBold: {
    color: '#60A5FA',
    fontWeight: '700',
  },
  fpsText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#10B981',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
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
  },
});
