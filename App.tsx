import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from './src/constants/theme';
import { Pet, AppSettings } from './src/types/pet';
import { PetStorage, INITIAL_PETS, INITIAL_SETTINGS } from './src/storage/petStorage';
import { HomeScreen } from './src/screens/HomeScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { BottomNav } from './src/components/BottomNav';
import { ActionModal } from './src/components/ActionModal';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary yakaladı:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Bir şeyler ters gitti</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Bilinmeyen hata'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
            activeOpacity={0.8}
          >
            <Text style={styles.retryBtnText}>Yeniden Dene</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [pets, setPets] = useState<Pet[]>(INITIAL_PETS || []);
  const [selectedPetId, setSelectedPetId] = useState<string>(
    INITIAL_PETS && INITIAL_PETS.length > 0 ? INITIAL_PETS[0].id : ''
  );
  const [settings, setSettings] = useState<AppSettings>(
    INITIAL_SETTINGS || {
      theme: 'light',
      notificationsEnabled: true,
      feedingReminders: true,
      waterReminders: true,
      vaccineAlerts: true,
      weightUnit: 'kg',
      waterUnit: 'ml',
      language: 'tr',
    }
  );
  const [currentTab, setCurrentTab] = useState<'home' | 'settings'>('home');
  const [isActionModalVisible, setIsActionModalVisible] = useState(false);

  // Initialize data from local storage asynchronously without blocking initial render
  useEffect(() => {
    async function loadData() {
      try {
        const storedPets = await PetStorage.getPets();
        const storedSettings = await PetStorage.getSettings();
        if (storedPets && storedPets.length > 0) {
          setPets(storedPets);
          setSelectedPetId((prev) => {
            const exists = storedPets.some((p) => p.id === prev);
            return exists ? prev : storedPets[0].id;
          });
        }
        if (storedSettings) {
          setSettings(storedSettings);
        }
      } catch (e) {
        console.error('Veri yüklenirken hata:', e);
      }
    }
    loadData();
  }, []);

  const activeColors = settings?.theme === 'dark' ? Colors.dark : Colors.light;

  const selectedPet =
    pets?.find((p) => p.id === selectedPetId) || pets?.[0] || INITIAL_PETS?.[0];

  // Update a pet
  const handleUpdatePet = (updatedPet: Pet) => {
    const updatedList = pets.map((p) => (p.id === updatedPet.id ? updatedPet : p));
    setPets(updatedList);
    PetStorage.savePets(updatedList);
  };

  // Add a new pet
  const handleAddPet = (newPet: Pet) => {
    const updatedList = [newPet, ...pets];
    setPets(updatedList);
    setSelectedPetId(newPet.id);
    PetStorage.savePets(updatedList);
  };

  // Delete a pet
  const handleDeletePet = (petId: string) => {
    const remaining = pets.filter((p) => p.id !== petId);
    if (remaining.length > 0) {
      setPets(remaining);
      setSelectedPetId(remaining[0].id);
      PetStorage.savePets(remaining);
    }
  };

  // Update app settings
  const handleUpdateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    PetStorage.saveSettings(newSettings);
  };

  // Reset all data
  const handleResetData = async () => {
    const result = await PetStorage.resetData();
    setPets(result.pets);
    setSelectedPetId(result.pets[0]?.id || '');
    setSettings(result.settings);
  };

  // Quick Action Modal save from bottom center button
  const handleSaveQuickAction = (type: any, data: any) => {
    if (!selectedPet) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (type === 'feeding') {
      const grams = data.grams || 50;
      const newCurrent = (selectedPet.feeding.currentGrams || 0) + grams;
      const updated: Pet = {
        ...selectedPet,
        feeding: {
          ...selectedPet.feeding,
          currentGrams: newCurrent,
          lastFedTime: timeStr,
        },
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'feeding',
            title: 'Mama Verildi',
            time: timeStr,
            detail: `${grams}g ${data.note || 'mama'} verildi`,
          },
          ...selectedPet.activities,
        ],
      };
      handleUpdatePet(updated);
    } else if (type === 'water') {
      const ml = data.ml || 100;
      const newCurrent = (selectedPet.water.currentMl || 0) + ml;
      const updated: Pet = {
        ...selectedPet,
        water: {
          ...selectedPet.water,
          currentMl: newCurrent,
        },
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'water',
            title: 'Su Eklendi',
            time: timeStr,
            detail: `+${ml} ml su verildi`,
          },
          ...selectedPet.activities,
        ],
      };
      handleUpdatePet(updated);
    } else if (type === 'walk') {
      const mins = data.mins || 20;
      const newCurrent = (selectedPet.walk.currentMin || 0) + mins;
      const updated: Pet = {
        ...selectedPet,
        walk: {
          ...selectedPet.walk,
          currentMin: newCurrent,
        },
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'walk',
            title: selectedPet.type === 'cat' ? 'Oyun Süresi' : 'Yürüyüş',
            time: timeStr,
            detail: `${mins} dk - ${data.note || 'Aktivite'}`,
          },
          ...selectedPet.activities,
        ],
      };
      handleUpdatePet(updated);
    } else if (type === 'vaccine') {
      const newVaccine = {
        id: `vac-${Date.now()}`,
        name: data.name,
        dueDate: data.dueDate,
        completed: false,
      };
      const updated: Pet = {
        ...selectedPet,
        vaccines: [newVaccine, ...selectedPet.vaccines],
      };
      handleUpdatePet(updated);
    } else if (type === 'weight') {
      const weightNum = data.weight;
      const updated: Pet = {
        ...selectedPet,
        weight: weightNum,
        activities: [
          {
            id: `act-${Date.now()}`,
            type: 'weight',
            title: 'Kilo Güncellendi',
            time: timeStr,
            detail: `Yeni tartım: ${weightNum} kg`,
          },
          ...selectedPet.activities,
        ],
      };
      handleUpdatePet(updated);
    }
  };

  return (
    <SafeAreaProvider style={styles.root}>
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: activeColors.background }]}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style={settings?.theme === 'dark' ? 'light' : 'dark'} />

        <ErrorBoundary>
          {/* Current Active Screen */}
          <View style={styles.screenContainer}>
            {currentTab === 'home' ? (
              <HomeScreen
                pets={pets}
                selectedPet={selectedPet}
                onSelectPet={(p) => setSelectedPetId(p.id)}
                onUpdatePet={handleUpdatePet}
                onAddPet={handleAddPet}
                colors={activeColors}
                isActionModalVisible={isActionModalVisible}
                setIsActionModalVisible={setIsActionModalVisible}
              />
            ) : (
              <SettingsScreen
                pets={pets}
                selectedPet={selectedPet}
                onUpdatePet={handleUpdatePet}
                onDeletePet={handleDeletePet}
                settings={settings}
                onUpdateSettings={handleUpdateSettings}
                onResetData={handleResetData}
                colors={activeColors}
              />
            )}
          </View>
        </ErrorBoundary>

        {/* Global Quick Action Modal */}
        <ActionModal
          visible={isActionModalVisible}
          onClose={() => setIsActionModalVisible(false)}
          colors={activeColors}
          onSaveAction={handleSaveQuickAction}
          currentWeight={selectedPet?.weight}
        />

        {/* Bottom Navigation Bar */}
        <BottomNav
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          onOpenQuickAction={() => setIsActionModalVisible(true)}
          colors={activeColors}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  screenContainer: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#10B981',
    borderRadius: 12,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
});
