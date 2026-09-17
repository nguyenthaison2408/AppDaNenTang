import { Building } from './room';

export type TimeSlotId =
  | 'slot_0730_0930'
  | 'slot_0930_1130'
  | 'slot_1300_1500'
  | 'slot_1500_1700'
  | 'slot_1730_1930';

export interface TimeSlot {
  id: TimeSlotId;
  label: string;
  startTime: string;
  endTime: string;
  period: 'Sáng' | 'Chiều' | 'Tối';
}

export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'CANCELLED' | 'COMPLETED';

export interface Booking {
  id: string; // e.g. "VKU-BK-83921"
  roomId: string;
  roomName: string;
  roomCode: string;
  building: Building;
  floor: number;
  date: string; // YYYY-MM-DD
  slotId: TimeSlotId;
  slotLabel: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  purpose: string;
  attendeesCount: number;
  status: BookingStatus;
  createdAt: string;
  qrCodeData: string;
  reminderScheduled?: boolean;
}

export interface UserSession {
  studentId: string;
  name: string;
  email: string;
  major: string;
  avatar: string;
  classCode: string;
}

