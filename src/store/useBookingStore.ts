import { create } from 'zustand';
import { Room, RoomFilterState } from '../types/room';
import { Booking, UserSession } from '../types/booking';
import { MOCK_ROOMS, MOCK_STUDENT_USER } from '../data/mockRooms';
import { AsyncStorage } from '../services/storage';
import { checkBookingConflict, getSevenDaysList } from '../services/conflictEngine';
import { notificationService } from '../services/notificationService';

const STORAGE_KEY_BOOKINGS = 'VKU_BOOKINGS_STORAGE_V1';
const STORAGE_KEY_USER = 'VKU_USER_SESSION_V1';

const initialFilterState: RoomFilterState = {
  searchQuery: '',
  selectedBuilding: 'ALL',
  capacityRange: 'ALL',
  selectedEquipment: [],
};

export interface BookingState {
  // User Session
  currentUser: UserSession;
  setCurrentUser: (user: UserSession) => void;

  // Rooms
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room | null) => void;

  // Filters
  filter: RoomFilterState;
  setFilter: (update: Partial<RoomFilterState>) => void;
  resetFilter: () => void;

  // Selected Date for time-slot booking
  selectedDate: string;
  setSelectedDate: (date: string) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (data: {
    roomId: string;
    roomName: string;
    roomCode: string;
    building: Room['building'];
    floor: number;
    slotId: Booking['slotId'];
    slotLabel: string;
    date: string;
    purpose: string;
    attendeesCount: number;
  }) => { success: boolean; booking?: Booking; error?: string };
  cancelBooking: (bookingId: string) => void;
  checkInBooking: (bookingId: string) => void;

  // Active navigation tab
  activeTab: 'explore' | 'my-bookings' | 'profile';
  setActiveTab: (tab: 'explore' | 'my-bookings' | 'profile') => void;

  // QR Modal State
  activeQRBooking: Booking | null;
  setActiveQRBooking: (booking: Booking | null) => void;

  // Load and hydrate
  isHydrated: boolean;
  loadInitialData: () => Promise<void>;
}

// Initial seed bookings for instant demonstration
const initialDays = getSevenDaysList();
const SEED_BOOKINGS: Booking[] = [
  {
    id: 'VKU-BK-74921',
    roomId: 'room_va301',
    roomName: 'Phòng Nghiên cứu AI & Data Lab',
    roomCode: 'V.A301',
    building: 'V',
    floor: 3,
    date: initialDays[0].dateString, // Today
    slotId: 'slot_0730_0930',
    slotLabel: '07:30 - 09:30',
    studentId: '22IT055',
    studentName: 'Trần Thị Mai',
    studentEmail: 'maitt.22it@vku.udn.vn',
    purpose: 'Họp nhóm đồ án Computer Vision',
    attendeesCount: 6,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    qrCodeData: 'VKU_PASS:room_va301:2026-09-17:slot_0730_0930:22IT055',
  },
  {
    id: 'VKU-BK-82910',
    roomId: 'room_a101',
    roomName: 'Phòng Tự học Nhóm - Thư viện VKU',
    roomCode: 'A.101',
    building: 'A',
    floor: 1,
    date: initialDays[0].dateString, // Today
    slotId: 'slot_1300_1500',
    slotLabel: '13:00 - 15:00',
    studentId: '22IT108',
    studentName: 'Nguyễn Văn An',
    studentEmail: 'annv.22it@vku.udn.vn',
    purpose: 'Ôn thi cuối kỳ Lập trình Đa nền tảng',
    attendeesCount: 4,
    status: 'CONFIRMED',
    createdAt: new Date().toISOString(),
    qrCodeData: 'VKU_PASS:room_a101:2026-09-17:slot_1300_1500:22IT108',
  },
];

export const useBookingStore = create<BookingState>((set, get) => ({
  currentUser: MOCK_STUDENT_USER,
  setCurrentUser: (user) => {
    set({ currentUser: user });
    AsyncStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  },

  rooms: MOCK_ROOMS,
  selectedRoom: null,
  setSelectedRoom: (room) => set({ selectedRoom: room }),

  filter: initialFilterState,
  setFilter: (update) =>
    set((state) => ({ filter: { ...state.filter, ...update } })),
  resetFilter: () => set({ filter: initialFilterState }),

  selectedDate: initialDays[0].dateString,
  setSelectedDate: (date) => set({ selectedDate: date }),

  bookings: SEED_BOOKINGS,
  activeTab: 'explore',
  setActiveTab: (tab) => set({ activeTab: tab }),

  activeQRBooking: null,
  setActiveQRBooking: (booking) => set({ activeQRBooking: booking }),

  isHydrated: false,

  createBooking: (data) => {
    const { bookings, currentUser } = get();

    // Run conflict prevention check
    const conflictResult = checkBookingConflict(bookings, {
      roomId: data.roomId,
      roomName: data.roomName,
      date: data.date,
      slotId: data.slotId,
      studentId: currentUser.studentId,
    });

    if (conflictResult.hasConflict) {
      return { success: false, error: conflictResult.reason };
    }

    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const newBookingId = `VKU-BK-${randomDigits}`;
    const qrData = `VKU_PASS:${data.roomId}:${data.date}:${data.slotId}:${currentUser.studentId}:${newBookingId}`;

    const newBooking: Booking = {
      id: newBookingId,
      roomId: data.roomId,
      roomName: data.roomName,
      roomCode: data.roomCode,
      building: data.building,
      floor: data.floor,
      date: data.date,
      slotId: data.slotId,
      slotLabel: data.slotLabel,
      studentId: currentUser.studentId,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      purpose: data.purpose || 'Học nhóm & Nghiên cứu tự do',
      attendeesCount: data.attendeesCount || 2,
      status: 'CONFIRMED',
      createdAt: new Date().toISOString(),
      qrCodeData: qrData,
      reminderScheduled: true,
    };

    const updatedBookings = [newBooking, ...bookings];
    set({ bookings: updatedBookings });

    // Persist to AsyncStorage
    AsyncStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updatedBookings));

    // Schedule 15-min reminder notification
    notificationService.scheduleBookingReminder(newBooking);

    return { success: true, booking: newBooking };
  },

  cancelBooking: (bookingId) => {
    const updatedBookings = get().bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'CANCELLED' as const } : b
    );
    set({ bookings: updatedBookings });
    AsyncStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updatedBookings));

    // Cancel notification
    notificationService.cancelBookingReminder(bookingId);
  },

  checkInBooking: (bookingId) => {
    const updatedBookings = get().bookings.map((b) =>
      b.id === bookingId ? { ...b, status: 'CHECKED_IN' as const } : b
    );
    set({
      bookings: updatedBookings,
      activeQRBooking: get().activeQRBooking?.id === bookingId
        ? { ...get().activeQRBooking!, status: 'CHECKED_IN' }
        : get().activeQRBooking,
    });
    AsyncStorage.setItem(STORAGE_KEY_BOOKINGS, JSON.stringify(updatedBookings));
  },

  loadInitialData: async () => {
    try {
      const storedBookings = await AsyncStorage.getItem(STORAGE_KEY_BOOKINGS);
      const storedUser = await AsyncStorage.getItem(STORAGE_KEY_USER);

      if (storedBookings) {
        const parsed = JSON.parse(storedBookings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          set({ bookings: parsed });
        }
      }

      if (storedUser) {
        set({ currentUser: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.warn('Failed to load initial data:', e);
    } finally {
      set({ isHydrated: true });
    }
  },
}));

