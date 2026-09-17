import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Building, Equipment } from '../types/room';
import { useBookingStore } from '../store/useBookingStore';
import { Monitor, Tv, Wind, PenTool, SlidersHorizontal, RotateCcw } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { filter, setFilter, resetFilter } = useBookingStore();

  const buildings: { label: string; value: Building | 'ALL' }[] = [
    { label: 'Tất cả Toà', value: 'ALL' },
    { label: 'Toà V', value: 'V' },
    { label: 'Toà A', value: 'A' },
    { label: 'Toà B', value: 'B' },
    { label: 'Toà C', value: 'C' },
  ];

  const capacities: { label: string; value: 'ALL' | '2-5' | '6-10' | '10-20' | '20+' }[] = [
    { label: 'Mọi quy mô', value: 'ALL' },
    { label: '2–5 chỗ', value: '2-5' },
    { label: '6–10 chỗ', value: '6-10' },
    { label: '10–20 chỗ', value: '10-20' },
    { label: '>20 chỗ', value: '20+' },
  ];

  const equipmentList: { label: string; value: Equipment; icon: React.ReactNode }[] = [
    { label: 'Máy chiếu', value: 'Projector', icon: <Tv size={13} color="#94A3B8" /> },
    { label: 'Bảng viết', value: 'Whiteboard', icon: <PenTool size={13} color="#94A3B8" /> },
    { label: 'PC High-Spec', value: 'High-spec PC', icon: <Monitor size={13} color="#94A3B8" /> },
    { label: 'Máy lạnh', value: 'AC', icon: <Wind size={13} color="#94A3B8" /> },
  ];

  const toggleEquipment = (eq: Equipment) => {
    const current = filter.selectedEquipment;
    if (current.includes(eq)) {
      setFilter({ selectedEquipment: current.filter((item) => item !== eq) });
    } else {
      setFilter({ selectedEquipment: [...current, eq] });
    }
  };

  const hasActiveFilters =
    filter.selectedBuilding !== 'ALL' ||
    filter.capacityRange !== 'ALL' ||
    filter.selectedEquipment.length > 0 ||
    filter.searchQuery.length > 0;

  return (
    <View style={styles.container}>
      {/* Buildings row */}
      <View style={styles.sectionRow}>
        <View style={styles.titleRow}>
          <Text style={styles.sectionLabel}>Toà nhà:</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={resetFilter} style={styles.resetBtn}>
              <RotateCcw size={12} color="#60A5FA" />
              <Text style={styles.resetText}>Đặt lại bộ lọc</Text>
            </TouchableOpacity>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {buildings.map((item) => {
            const isSelected = filter.selectedBuilding === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.chip, isSelected && styles.chipActive]}
                onPress={() => setFilter({ selectedBuilding: item.value })}
                activeOpacity={0.7}
              >
                <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Capacity & Equipment row */}
      <View style={styles.sectionRow}>
        <Text style={styles.sectionLabel}>Sức chứa & Tiện ích:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipScroll}>
          {/* Capacity Chips */}
          {capacities.map((item) => {
            const isSelected = filter.capacityRange === item.value;
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.subChip, isSelected && styles.subChipActive]}
                onPress={() => setFilter({ capacityRange: item.value })}
                activeOpacity={0.7}
              >
                <Text style={[styles.subChipText, isSelected && styles.subChipTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}

          <View style={styles.separator} />

          {/* Equipment Chips */}
          {equipmentList.map((item) => {
            const isSelected = filter.selectedEquipment.includes(item.value);
            return (
              <TouchableOpacity
                key={item.value}
                style={[styles.equipmentChip, isSelected && styles.equipmentChipActive]}
                onPress={() => toggleEquipment(item.value)}
                activeOpacity={0.7}
              >
                <Text style={[styles.equipmentText, isSelected && styles.equipmentTextActive]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  sectionRow: {
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 16,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontSize: 11,
    color: '#60A5FA',
    fontWeight: '600',
  },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: 'center',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#3B82F6',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  subChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#334155',
  },
  subChipActive: {
    backgroundColor: '#0284C7',
  },
  subChipText: {
    fontSize: 11,
    color: '#CBD5E1',
    fontWeight: '500',
  },
  subChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: '#475569',
    marginHorizontal: 4,
  },
  equipmentChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
  },
  equipmentChipActive: {
    backgroundColor: '#059669',
    borderColor: '#10B981',
  },
  equipmentText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  equipmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});

