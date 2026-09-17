export type Building = 'A' | 'B' | 'C' | 'V';

export type Equipment = 'Projector' | 'Whiteboard' | 'High-spec PC' | 'AC';

export type RoomStatus = 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE';

export interface Room {
  id: string;
  name: string;
  code: string;
  building: Building;
  floor: number;
  capacity: number;
  equipment: Equipment[];
  photo: string;
  description: string;
  isAvailableNow: boolean;
  type: 'Lab' | 'Study Room' | 'Meeting Room' | 'Lecture Hall';
}

export interface RoomFilterState {
  searchQuery: string;
  selectedBuilding: Building | 'ALL';
  capacityRange: 'ALL' | '2-5' | '6-10' | '10-20' | '20+';
  selectedEquipment: Equipment[];
}

