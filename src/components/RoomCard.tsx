import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Room } from '../types/room';
import { Users, MapPin, Monitor, Tv, Wind, PenTool, ChevronRight, Sparkles } from 'lucide-react';

interface RoomCardProps {
  room: Room;
  onPress: (room: Room) => void;
}

const RoomCardComponent: React.FC<RoomCardProps> = ({ room, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.88}
      onPress={() => onPress(room)}
    >
      {/* Room Photo with Badges Overlay */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: room.photo }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Real-time Status Badge */}
        <View style={styles.badgeTopLeft}>
          <View
            style={[
              styles.statusBadge,
              room.isAvailableNow ? styles.statusAvailable : styles.statusOccupied,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                room.isAvailableNow ? styles.dotAvailable : styles.dotOccupied,
              ]}
            />
            <Text style={styles.statusText}>
              {room.isAvailableNow ? 'Đang trống' : 'Đang có lớp'}
            </Text>
          </View>
        </View>

        {/* Room Code & Type Badge */}
        <View style={styles.badgeTopRight}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeBadgeText}>{room.code}</Text>
          </View>
        </View>

        {/* Room Type Tag */}
        <View style={styles.badgeBottomLeft}>
          <View style={styles.typeBadge}>
            <Sparkles size={10} color="#F59E0B" />
            <Text style={styles.typeBadgeText}>{room.type}</Text>
          </View>
        </View>
      </View>

      {/* Card Content */}
      <View style={styles.body}>
        {/* Title & Location */}
        <View style={styles.headerRow}>
          <Text style={styles.roomName} numberOfLines={1}>
            {room.name}
          </Text>
        </View>

        {/* Location & Capacity Badges */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <MapPin size={13} color="#60A5FA" />
            <Text style={styles.metaText}>
              Toà {room.building} • Tầng {room.floor}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Users size={13} color="#34D399" />
            <Text style={styles.metaText}>Sức chứa: {room.capacity} SV</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Equipment Badges */}
        <View style={styles.equipmentRow}>
          {room.equipment.map((eq) => {
            let label: string = eq;
            let icon: React.ReactNode = null;
            if (eq === 'Projector') {
              label = 'Máy chiếu';
              icon = <Tv size={11} color="#94A3B8" />;
            } else if (eq === 'Whiteboard') {
              label = 'Bảng viết';
              icon = <PenTool size={11} color="#94A3B8" />;
            } else if (eq === 'High-spec PC') {
              label = 'PC RTX';
              icon = <Monitor size={11} color="#94A3B8" />;
            } else if (eq === 'AC') {
              label = 'Điều hoà';
              icon = <Wind size={11} color="#94A3B8" />;
            }

            return (
              <View key={eq} style={styles.eqTag}>
                {icon}
                <Text style={styles.eqTagText}>{label}</Text>
              </View>
            );
          })}
        </View>

        {/* Bottom Action Footer */}
        <View style={styles.footerRow}>
          <View>
            <Text style={styles.pricingLabel}>Quyền lợi SV VKU</Text>
            <Text style={styles.pricingValue}>Miễn phí 100%</Text>
          </View>
          <View style={styles.actionBtn}>
            <Text style={styles.actionBtnText}>Đặt phòng ngay</Text>
            <ChevronRight size={15} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

/**
 * Memoized RoomCard to guarantee 60fps scrolling performance in FlatList.
 */
export const RoomCard = React.memo(RoomCardComponent, (prev, next) => {
  return (
    prev.room.id === next.room.id &&
    prev.room.isAvailableNow === next.room.isAvailableNow &&
    prev.room.name === next.room.name
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#334155',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
    width: '100%',
    backgroundColor: '#0F172A',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeTopLeft: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 5,
  },
  statusAvailable: {
    backgroundColor: 'rgba(5, 150, 105, 0.9)',
  },
  statusOccupied: {
    backgroundColor: 'rgba(217, 119, 6, 0.9)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotAvailable: {
    backgroundColor: '#34D399',
  },
  dotOccupied: {
    backgroundColor: '#FCD34D',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTopRight: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  codeBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  codeBadgeText: {
    color: '#60A5FA',
    fontSize: 12,
    fontWeight: '800',
  },
  badgeBottomLeft: {
    position: 'absolute',
    bottom: 8,
    left: 10,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  typeBadgeText: {
    color: '#F1F5F9',
    fontSize: 10,
    fontWeight: '600',
  },
  body: {
    padding: 14,
  },
  headerRow: {
    marginBottom: 6,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F8FAFC',
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: '#CBD5E1',
    lineHeight: 17,
    marginBottom: 10,
  },
  equipmentRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  eqTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F172A',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 4,
  },
  eqTagText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  pricingLabel: {
    fontSize: 10,
    color: '#64748B',
  },
  pricingValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#10B981',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
