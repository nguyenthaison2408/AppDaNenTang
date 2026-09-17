import { Booking, TimeSlotId } from '../types/booking';

export interface DayOption {
  dateString: string; // YYYY-MM-DD
  dayOfWeek: string;  // "Hôm nay", "T.Hai", "T.Ba", etc.
  formattedDate: string; // "18/09"
  isToday: boolean;
}

/**
 * Generates an array of 7 consecutive days starting from today.
 */
export function getSevenDaysList(): DayOption[] {
  const days: DayOption[] = [];
  const today = new Date();
  
  const dayNames = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const formattedDate = `${day}/${month}`;
    const dayOfWeek = i === 0 ? 'Hôm nay' : dayNames[d.getDay()];

    days.push({
      dateString,
      dayOfWeek,
      formattedDate,
      isToday: i === 0,
    });
  }

  return days;
}

/**
 * Checks if a specific room is already booked on a date & slot.
 */
export function isRoomSlotBooked(
  bookings: Booking[],
  roomId: string,
  date: string,
  slotId: TimeSlotId
): boolean {
  return bookings.some(
    (b) =>
      b.roomId === roomId &&
      b.date === date &&
      b.slotId === slotId &&
      b.status !== 'CANCELLED'
  );
}

/**
 * Detailed conflict check engine:
 * 1. Checks if room is taken
 * 2. Checks if student is already booked elsewhere in the same slot
 */
export function checkBookingConflict(
  bookings: Booking[],
  params: {
    roomId: string;
    roomName: string;
    date: string;
    slotId: TimeSlotId;
    studentId: string;
  }
): { hasConflict: boolean; reason?: string } {
  // 1. Room already booked
  const roomConflict = bookings.find(
    (b) =>
      b.roomId === params.roomId &&
      b.date === params.date &&
      b.slotId === params.slotId &&
      b.status !== 'CANCELLED'
  );

  if (roomConflict) {
    return {
      hasConflict: true,
      reason: `Phòng ${params.roomName} đã được sinh viên ${roomConflict.studentName} (${roomConflict.studentId}) đặt trước cho khung giờ này.`,
    };
  }

  // 2. Student already booked another room in the same slot
  const studentConflict = bookings.find(
    (b) =>
      b.studentId === params.studentId &&
      b.date === params.date &&
      b.slotId === params.slotId &&
      b.status !== 'CANCELLED'
  );

  if (studentConflict) {
    return {
      hasConflict: true,
      reason: `Bạn đã có lịch đặt phòng ${studentConflict.roomName} vào cùng khung giờ này (${params.date}). Vui lòng chọn ca khác hoặc huỷ ca cũ trước.`,
    };
  }

  return { hasConflict: false };
}

