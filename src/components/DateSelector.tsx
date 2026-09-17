import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react';
import { getSevenDaysList, DayOption } from '../services/conflictEngine';

interface DateSelectorProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDate,
  onSelectDate,
}) => {
  const days: DayOption[] = React.useMemo(() => getSevenDaysList(), []);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Calendar size={15} color="#60A5FA" />
          <Text style={styles.title}>Chọn ngày đặt phòng (7 ngày tới):</Text>
        </View>
        <Text style={styles.activeDateHint}>
          {days.find((d) => d.dateString === selectedDate)?.dayOfWeek || ''} (
          {days.find((d) => d.dateString === selectedDate)?.formattedDate || ''})
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {days.map((item) => {
          const isSelected = item.dateString === selectedDate;
          return (
            <TouchableOpacity
              key={item.dateString}
              style={[styles.dayCard, isSelected && styles.dayCardSelected]}
              onPress={() => onSelectDate(item.dateString)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  isSelected && styles.dayOfWeekTextSelected,
                  item.isToday && !isSelected && styles.todayHighlight,
                ]}
              >
                {item.dayOfWeek}
              </Text>
              <Text
                style={[
                  styles.dateText,
                  isSelected && styles.dateTextSelected,
                ]}
              >
                {item.formattedDate}
              </Text>
              {item.isToday && (
                <View style={styles.todayDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
    paddingHorizontal: 2,
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
  activeDateHint: {
    fontSize: 12,
    fontWeight: '700',
    color: '#60A5FA',
  },
  scrollContent: {
    gap: 8,
    paddingVertical: 2,
  },
  dayCard: {
    width: 68,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#0F172A',
    borderWidth: 1,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayCardSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
    boxShadow: '0 4px 10px rgba(37, 99, 235, 0.4)',
  },
  dayOfWeekText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
    marginBottom: 2,
  },
  dayOfWeekTextSelected: {
    color: '#EFF6FF',
    fontWeight: '700',
  },
  todayHighlight: {
    color: '#38BDF8',
    fontWeight: '700',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#F1F5F9',
  },
  dateTextSelected: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
  },
});

