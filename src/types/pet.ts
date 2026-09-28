export type PetType = 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
export type Gender = 'male' | 'female';

export interface VaccineItem {
  id: string;
  name: string;
  dueDate: string;
  completed: boolean;
  notes?: string;
}

export interface ActivityLogItem {
  id: string;
  type: 'feeding' | 'water' | 'walk' | 'med' | 'weight' | 'vet';
  title: string;
  time: string;
  detail: string;
}

export interface VetInfo {
  clinicName: string;
  doctorName: string;
  phone: string;
  address: string;
}

export interface FeedingData {
  dailyTargetGrams: number;
  currentGrams: number;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
  lastFedTime?: string;
}

export interface WaterData {
  dailyTargetMl: number;
  currentMl: number;
}

export interface WalkData {
  dailyTargetMin: number;
  currentMin: number;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed: string;
  age: number;
  birthDate?: string;
  gender: Gender;
  weight: number;
  chipNumber?: string;
  avatarIcon: string;
  color: string;
  isNeutered: boolean;
  feeding: FeedingData;
  water: WaterData;
  walk: WalkData;
  vaccines: VaccineItem[];
  activities: ActivityLogItem[];
  vetInfo: VetInfo;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  notificationsEnabled: boolean;
  feedingReminders: boolean;
  waterReminders: boolean;
  vaccineAlerts: boolean;
  weightUnit: 'kg' | 'lbs';
  waterUnit: 'ml' | 'oz';
  language: 'tr' | 'en';
}
