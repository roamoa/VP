import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pet, AppSettings } from '../types/pet';

const PETS_STORAGE_KEY_V2 = '@vitax_pets_list_v2';
const PETS_STORAGE_KEY_V1 = '@vitax_pets_list_v1';
const SETTINGS_STORAGE_KEY = '@vitax_settings_v1';

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-1',
    name: 'Luna',
    type: 'cat',
    breed: 'British Shorthair',
    age: 2,
    birthDate: '15 Mart 2024',
    gender: 'female',
    weight: 4.2,
    chipNumber: 'TR-9820003418293',
    avatarIcon: 'cat',
    color: '#8B5CF6',
    isNeutered: true,
    feeding: {
      dailyTargetGrams: 160,
      currentGrams: 110,
      breakfast: true,
      lunch: true,
      dinner: false,
      lastFedTime: '13:30',
    },
    water: {
      dailyTargetMl: 250,
      currentMl: 180,
    },
    walk: {
      dailyTargetMin: 30,
      currentMin: 20,
    },
    vaccines: [
      {
        id: 'vac-1',
        name: 'Karma Aşı (FVRCP)',
        dueDate: '10 Ekim 2026',
        completed: false,
        notes: 'Yıllık tekrar dozu',
      },
      {
        id: 'vac-2',
        name: 'Kuduz Aşısı',
        dueDate: '15 Kasım 2026',
        completed: false,
        notes: 'Zorunlu aşı',
      },
      {
        id: 'vac-3',
        name: 'İç & Dış Parazit',
        dueDate: '18 Eylül 2026',
        completed: true,
        notes: 'Damla uygulandı',
      },
    ],
    activities: [
      {
        id: 'act-1',
        type: 'feeding',
        title: 'Öğle Maması',
        time: '13:30',
        detail: '55g Somonlu Kuru Mama',
      },
      {
        id: 'act-2',
        type: 'water',
        title: 'Taze Su',
        time: '11:15',
        detail: '80 ml su kabına eklendi',
      },
      {
        id: 'act-3',
        type: 'walk',
        title: 'Oyun Saati',
        time: '09:40',
        detail: '20 dk tüy yumağı ve lazerle oyun',
      },
      {
        id: 'act-4',
        type: 'feeding',
        title: 'Sabah Maması',
        time: '08:00',
        detail: '55g Somonlu Kuru Mama',
      },
    ],
    vetInfo: {
      clinicName: 'Pati Dostları Veteriner Kliniği',
      doctorName: 'Dr. Selin Yılmaz',
      phone: '+90 (212) 555 43 21',
      address: 'Bağdat Caddesi No: 142/A, Kadıköy, İstanbul',
    },
  },
  {
    id: 'pet-2',
    name: 'Çakıl',
    type: 'dog',
    breed: 'Golden Retriever',
    age: 3,
    birthDate: '20 Mayıs 2023',
    gender: 'male',
    weight: 28.5,
    chipNumber: 'TR-9820008817264',
    avatarIcon: 'dog',
    color: '#F59E0B',
    isNeutered: true,
    feeding: {
      dailyTargetGrams: 450,
      currentGrams: 300,
      breakfast: true,
      lunch: false,
      dinner: false,
      lastFedTime: '08:30',
    },
    water: {
      dailyTargetMl: 1500,
      currentMl: 900,
    },
    walk: {
      dailyTargetMin: 60,
      currentMin: 45,
    },
    vaccines: [
      {
        id: 'vac-4',
        name: 'Kuduz Aşısı',
        dueDate: '02 Kasım 2026',
        completed: false,
        notes: 'Ruhsat yenilemesi ile birlikte',
      },
      {
        id: 'vac-5',
        name: 'Kennel Cough (Bronşin)',
        dueDate: '25 Aralık 2026',
        completed: false,
        notes: 'Kış dönemi koruması',
      },
    ],
    activities: [
      {
        id: 'act-5',
        type: 'walk',
        title: 'Sabah Yürüyüşü',
        time: '07:30',
        detail: '45 dk park turu, top yakalama',
      },
      {
        id: 'act-6',
        type: 'feeding',
        title: 'Sabah Maması',
        time: '08:30',
        detail: '300g Kuzu Etli Yetişkin Köpek Maması',
      },
    ],
    vetInfo: {
      clinicName: 'VetCare Hayvan Hastanesi',
      doctorName: 'Dr. Ahmet Kaya',
      phone: '+90 (216) 444 83 83',
      address: 'Ataşehir Bulvarı No: 58, İstanbul',
    },
  },
  {
    id: 'pet-3',
    name: 'Babi',
    type: 'bird',
    breed: 'Muhabbet Kuşu',
    age: 1,
    birthDate: '10 Ocak 2025',
    gender: 'male',
    weight: 0.04,
    avatarIcon: 'bird',
    color: '#3B82F6',
    isNeutered: false,
    feeding: {
      dailyTargetGrams: 20,
      currentGrams: 15,
      breakfast: true,
      lunch: false,
      dinner: false,
      lastFedTime: '10:00',
    },
    water: {
      dailyTargetMl: 50,
      currentMl: 35,
    },
    walk: {
      dailyTargetMin: 20,
      currentMin: 15,
    },
    vaccines: [
      {
        id: 'vac-babi-1',
        name: 'Genel Sağlık & Parazit Kontrolü',
        dueDate: '12 Kasım 2026',
        completed: false,
        notes: 'Gaga ve tırnak bakımı ile birlikte',
      },
      {
        id: 'vac-babi-2',
        name: 'Mevsimsel Vitamin Takviyesi',
        dueDate: '01 Ekim 2026',
        completed: true,
        notes: 'Tüy döküm dönemi için uygulandı',
      },
    ],
    activities: [
      {
        id: 'act-babi-1',
        type: 'feeding',
        title: 'Tohum & Yem',
        time: '10:00',
        detail: '15g taze karışık darı ve kanarya yemi',
      },
      {
        id: 'act-babi-2',
        type: 'water',
        title: 'Taze Su',
        time: '09:30',
        detail: '35 ml vitaminli taze su',
      },
      {
        id: 'act-babi-3',
        type: 'walk',
        title: 'Kafes Dışı Uçuş',
        time: '11:00',
        detail: '15 dakika serbest kafes dışı uçuş',
      },
    ],
    vetInfo: {
      clinicName: 'Kanatlı Dostlar Veteriner Kliniği',
      doctorName: 'Dr. Burak Demir',
      phone: '+90 (212) 555 78 90',
      address: 'Beşiktaş Çarşı No: 44, İstanbul',
    },
  },
  {
    id: 'pet-4',
    name: 'Pamuk',
    type: 'rabbit',
    breed: 'Hollanda Lop',
    age: 1,
    birthDate: '01 Nisan 2025',
    gender: 'female',
    weight: 1.8,
    avatarIcon: 'rabbit',
    color: '#EC4899',
    isNeutered: true,
    feeding: {
      dailyTargetGrams: 120,
      currentGrams: 85,
      breakfast: true,
      lunch: false,
      dinner: false,
      lastFedTime: '09:00',
    },
    water: {
      dailyTargetMl: 250,
      currentMl: 180,
    },
    walk: {
      dailyTargetMin: 30,
      currentMin: 20,
    },
    vaccines: [
      {
        id: 'vac-pamuk-1',
        name: 'RHDV & Miksomatoz Aşısı',
        dueDate: '20 Ekim 2026',
        completed: false,
        notes: 'Yıllık koruma dozu',
      },
    ],
    activities: [
      {
        id: 'act-pamuk-1',
        type: 'feeding',
        title: 'Kuru Yonca & Yeşillik',
        time: '09:00',
        detail: '85g taze çayır otu ve dereotu',
      },
      {
        id: 'act-pamuk-2',
        type: 'walk',
        title: 'Zıplama & Egzersiz',
        time: '10:30',
        detail: '20 dakika serbest gezinme ve oyun',
      },
    ],
    vetInfo: {
      clinicName: 'Pati Dostları Veteriner Kliniği',
      doctorName: 'Dr. Selin Yılmaz',
      phone: '+90 (212) 555 43 21',
      address: 'Bağdat Caddesi No: 142/A, Kadıköy, İstanbul',
    },
  },
];

export const INITIAL_SETTINGS: AppSettings = {
  theme: 'light',
  notificationsEnabled: true,
  feedingReminders: true,
  waterReminders: true,
  vaccineAlerts: true,
  weightUnit: 'kg',
  waterUnit: 'ml',
  language: 'tr',
};

export const PetStorage = {
  async getPets(): Promise<Pet[]> {
    try {
      const data = await AsyncStorage.getItem(PETS_STORAGE_KEY_V2);
      if (data) {
        return JSON.parse(data);
      }
      // Check v1 data and migrate gracefully
      const oldV1 = await AsyncStorage.getItem(PETS_STORAGE_KEY_V1);
      if (oldV1) {
        const parsed: Pet[] = JSON.parse(oldV1);
        const hasBabi = parsed.some(
          (p) => p.name.toLowerCase() === 'babi' || p.type === 'bird'
        );
        if (!hasBabi) {
          const babi = INITIAL_PETS.find((p) => p.name === 'Babi');
          if (babi) parsed.push(babi);
        }
        await AsyncStorage.setItem(PETS_STORAGE_KEY_V2, JSON.stringify(parsed));
        return parsed;
      }
      await AsyncStorage.setItem(PETS_STORAGE_KEY_V2, JSON.stringify(INITIAL_PETS));
      return INITIAL_PETS;
    } catch (e) {
      console.error('Pets yüklenirken hata:', e);
      return INITIAL_PETS;
    }
  },

  async savePets(pets: Pet[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PETS_STORAGE_KEY_V2, JSON.stringify(pets));
    } catch (e) {
      console.error('Pets kaydedilirken hata:', e);
    }
  },

  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    } catch (e) {
      console.error('Settings yüklenirken hata:', e);
      return INITIAL_SETTINGS;
    }
  },

  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch (e) {
      console.error('Settings kaydedilirken hata:', e);
    }
  },

  async resetData(): Promise<{ pets: Pet[]; settings: AppSettings }> {
    try {
      await AsyncStorage.removeItem(PETS_STORAGE_KEY_V2);
      await AsyncStorage.removeItem(PETS_STORAGE_KEY_V1);
      await AsyncStorage.removeItem(SETTINGS_STORAGE_KEY);
    } catch (e) {
      console.error('Veri sıfırlanırken hata:', e);
    }
    return { pets: INITIAL_PETS, settings: INITIAL_SETTINGS };
  },
};

