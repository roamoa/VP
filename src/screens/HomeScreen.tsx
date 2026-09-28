import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Pet, ActivityLogItem } from '../types/pet';
import { ThemeColors } from '../constants/theme';
import { Header } from '../components/Header';
import { PetCard } from '../components/PetCard';
import { TrackerCards } from '../components/TrackerCard';
import { ActivityLogList } from '../components/ActivityLogList';
import { ActionModal } from '../components/ActionModal';
import { AddPetModal } from '../components/AddPetModal';
import { WeightModal } from '../components/WeightModal';
import { AgeModal } from '../components/AgeModal';

interface HomeScreenProps {
  pets: Pet[];
  selectedPet: Pet;
  onSelectPet: (pet: Pet) => void;
  onUpdatePet: (updatedPet: Pet) => void;
  onAddPet: (newPet: Pet) => void;
  colors: ThemeColors;
  isActionModalVisible: boolean;
  setIsActionModalVisible: (visible: boolean) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  pets,
  selectedPet,
  onSelectPet,
  onUpdatePet,
  onAddPet,
  colors,
  isActionModalVisible,
  setIsActionModalVisible,
}) => {
  const [isAddPetVisible, setIsAddPetVisible] = useState(false);
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const [isAgeModalVisible, setIsAgeModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 600);
  };

  // Quick Feed action (supports addition and reduction)
  const handleQuickFeed = (grams: number) => {
    const current = selectedPet.feeding.currentGrams || 0;
    const newCurrent = Math.max(0, current + grams);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const isReduction = grams < 0;
    const changeAmount = Math.abs(grams);

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'feeding',
      title: isReduction ? 'Mama Eksiltildi (Düzeltme)' : 'Mama Verildi',
      time: timeStr,
      detail: isReduction
        ? `-${changeAmount}g mama kaydı geri alındı`
        : `+${changeAmount}g mama kaba döküldü`,
    };

    const updated: Pet = {
      ...selectedPet,
      feeding: {
        ...selectedPet.feeding,
        currentGrams: newCurrent,
        lastFedTime: isReduction ? selectedPet.feeding.lastFedTime : timeStr,
      },
      activities: [newActivity, ...selectedPet.activities],
    };
    onUpdatePet(updated);
  };

  // Toggle meal slot
  const handleToggleMeal = (mealKey: 'breakfast' | 'lunch' | 'dinner') => {
    const updated: Pet = {
      ...selectedPet,
      feeding: {
        ...selectedPet.feeding,
        [mealKey]: !selectedPet.feeding[mealKey],
      },
    };
    onUpdatePet(updated);
  };

  // Quick Water action
  const handleQuickWater = (ml: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newCurrent = (selectedPet.water.currentMl || 0) + ml;
    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'water',
      title: 'Taze Su Eklendi',
      time: timeStr,
      detail: `+${ml} ml su tazelendi`,
    };

    const updated: Pet = {
      ...selectedPet,
      water: {
        ...selectedPet.water,
        currentMl: newCurrent,
      },
      activities: [newActivity, ...selectedPet.activities],
    };
    onUpdatePet(updated);
  };

  // Quick Walk action
  const handleQuickWalk = (mins: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newCurrent = (selectedPet.walk.currentMin || 0) + mins;
    const isCat = selectedPet.type === 'cat';
    const isBird = selectedPet.type === 'bird';
    const isRabbit = selectedPet.type === 'rabbit';
    const activityTitle = isCat
      ? 'Oyun Tamamlandı'
      : isBird
      ? 'Uçuş Tamamlandı'
      : isRabbit
      ? 'Zıplama Tamamlandı'
      : 'Yürüyüş Yapıldı';

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'walk',
      title: activityTitle,
      time: timeStr,
      detail: `${mins} dakika aktif hareket`,
    };

    const updated: Pet = {
      ...selectedPet,
      walk: {
        ...selectedPet.walk,
        currentMin: newCurrent,
      },
      activities: [newActivity, ...selectedPet.activities],
    };
    onUpdatePet(updated);
  };

  // Toggle vaccine check
  const handleToggleVaccine = (vaccineId: string) => {
    const updatedVaccines = selectedPet.vaccines.map((v) => {
      if (v.id === vaccineId) {
        return { ...v, completed: !v.completed };
      }
      return v;
    });

    const vac = selectedPet.vaccines.find((v) => v.id === vaccineId);
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'med',
      title: 'Aşı Tamamlandı',
      time: timeStr,
      detail: `${vac?.name || 'Aşı'} başarıyla uygulandı.`,
    };

    const updated: Pet = {
      ...selectedPet,
      vaccines: updatedVaccines,
      activities: [newActivity, ...selectedPet.activities],
    };
    onUpdatePet(updated);
  };

  // Dedicated weight save handler
  const handleSaveDirectWeight = (newWeight: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'weight',
      title: 'Kilo Güncellendi',
      time: timeStr,
      detail: `Yeni tartım: ${newWeight} kg`,
    };
    onUpdatePet({
      ...selectedPet,
      weight: newWeight,
      activities: [newActivity, ...selectedPet.activities],
    });
  };

  // Dedicated age save handler
  const handleSaveDirectAge = (newAge: number) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'med',
      title: 'Yaş Güncellendi',
      time: timeStr,
      detail: `${selectedPet.name} artık ${newAge} yaşında.`,
    };
    onUpdatePet({
      ...selectedPet,
      age: newAge,
      activities: [newActivity, ...selectedPet.activities],
    });
  };

  // Dedicated neutered status toggle handler
  const handleToggleNeuteredDirect = () => {
    const newStatus = !selectedPet.isNeutered;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newActivity: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: 'med',
      title: 'Kısırlık Durumu Güncellendi',
      time: timeStr,
      detail: newStatus
        ? 'Kısırlaştırılmış olarak kaydedildi.'
        : 'Kısırlaştırılmamış olarak kaydedildi.',
    };
    onUpdatePet({
      ...selectedPet,
      isNeutered: newStatus,
      activities: [newActivity, ...selectedPet.activities],
    });
  };

  // Modal Save Action (from quick action + button)
  const handleSaveModalAction = (type: string, data: any) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    if (type === 'feeding') {
      const grams = data.grams || 50;
      const newCurrent = (selectedPet.feeding.currentGrams || 0) + grams;
      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        type: 'feeding',
        title: 'Mama Verildi',
        time: timeStr,
        detail: `${grams}g ${data.note || 'mama'} verildi`,
      };
      onUpdatePet({
        ...selectedPet,
        feeding: {
          ...selectedPet.feeding,
          currentGrams: newCurrent,
          lastFedTime: timeStr,
        },
        activities: [newActivity, ...selectedPet.activities],
      });
    } else if (type === 'water') {
      const ml = data.ml || 100;
      const newCurrent = (selectedPet.water.currentMl || 0) + ml;
      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        type: 'water',
        title: 'Su Eklendi',
        time: timeStr,
        detail: `+${ml} ml su verildi`,
      };
      onUpdatePet({
        ...selectedPet,
        water: {
          ...selectedPet.water,
          currentMl: newCurrent,
        },
        activities: [newActivity, ...selectedPet.activities],
      });
    } else if (type === 'walk') {
      const mins = data.mins || 20;
      const newCurrent = (selectedPet.walk.currentMin || 0) + mins;
      const isCat = selectedPet.type === 'cat';
      const isBird = selectedPet.type === 'bird';
      const isRabbit = selectedPet.type === 'rabbit';
      const activityTitle = isCat
        ? 'Oyun Süresi'
        : isBird
        ? 'Uçuş Süresi'
        : isRabbit
        ? 'Zıplama Süresi'
        : 'Yürüyüş';

      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        type: 'walk',
        title: activityTitle,
        time: timeStr,
        detail: `${mins} dk - ${data.note || 'Aktivite'}`,
      };
      onUpdatePet({
        ...selectedPet,
        walk: {
          ...selectedPet.walk,
          currentMin: newCurrent,
        },
        activities: [newActivity, ...selectedPet.activities],
      });
    } else if (type === 'vaccine') {
      const newVaccine = {
        id: `vac-${Date.now()}`,
        name: data.name,
        dueDate: data.dueDate,
        completed: false,
      };
      onUpdatePet({
        ...selectedPet,
        vaccines: [newVaccine, ...selectedPet.vaccines],
      });
    } else if (type === 'weight') {
      const weightNum = data.weight;
      const newActivity: ActivityLogItem = {
        id: `act-${Date.now()}`,
        type: 'weight',
        title: 'Kilo Güncellendi',
        time: timeStr,
        detail: `Yeni tartım: ${weightNum} kg`,
      };
      onUpdatePet({
        ...selectedPet,
        weight: weightNum,
        activities: [newActivity, ...selectedPet.activities],
      });
    }
  };

  const getPetTip = () => {
    if (selectedPet.type === 'cat') {
      return 'Kedilerin taze su içmesi böbrek sağlığı için çok önemlidir. Su kabını mamasından en az 1 metre uzakta tutun.';
    }
    if (selectedPet.type === 'dog') {
      return 'Günlük düzenli yürüyüşler ve koku alma egzersizleri köpeğinizin stres seviyesini azaltır ve sakin kalmasını sağlar.';
    }
    if (selectedPet.type === 'bird') {
      return 'Kuşların kafes temizliği ve taze yem/su değişimi günlük yapılmalıdır. Neşeli ötüşler sağlıklı bir ruh halini gösterir.';
    }
    if (selectedPet.type === 'rabbit') {
      return 'Tavşanların beslenmesinde sınırsız kaliteli kuru ot sindirim sistemleri için hayati önem taşır.';
    }
    return 'Dostunuzun günlük beslenme ve su takibini eksiksiz yaparak sağlığını koruyabilirsiniz.';
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
      >
        {/* Header & Pet Switcher */}
        <Header
          pets={pets}
          selectedPet={selectedPet}
          onSelectPet={onSelectPet}
          onAddNewPet={() => setIsAddPetVisible(true)}
          colors={colors}
        />

        {/* Pet Profile Overview Card - with editable weight, age, and neutered status */}
        <PetCard
          pet={selectedPet}
          onUpdateWeight={() => setIsWeightModalVisible(true)}
          onUpdateAge={() => setIsAgeModalVisible(true)}
          onToggleNeutered={handleToggleNeuteredDirect}
          onOpenQuickAction={() => setIsActionModalVisible(true)}
          colors={colors}
        />

        {/* Daily Tip Card */}
        <View
          style={[
            styles.tipCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.cardBorder,
            },
          ]}
        >
          <View
            style={[
              styles.tipIconBadge,
              { backgroundColor: colors.accentYellowLight },
            ]}
          >
            <Ionicons name="bulb" size={20} color={colors.accentYellow} />
          </View>
          <View style={styles.tipTextCol}>
            <Text style={[styles.tipTitle, { color: colors.textPrimary }]}>
              Günün Pati İpucu
            </Text>
            <Text style={[styles.tipDesc, { color: colors.textSecondary }]}>
              {getPetTip()}
            </Text>
          </View>
        </View>

        {/* Trackers: Feeding, Water, Walk, Vaccines */}
        <TrackerCards
          pet={selectedPet}
          colors={colors}
          onQuickFeed={handleQuickFeed}
          onToggleMeal={handleToggleMeal}
          onQuickWater={handleQuickWater}
          onQuickWalk={handleQuickWalk}
          onToggleVaccine={handleToggleVaccine}
          onOpenQuickAction={() => setIsActionModalVisible(true)}
        />

        {/* Activity Log / Timeline */}
        <ActivityLogList activities={selectedPet.activities} colors={colors} />
      </ScrollView>

      {/* Dedicated Weight Edit Modal */}
      <WeightModal
        visible={isWeightModalVisible}
        onClose={() => setIsWeightModalVisible(false)}
        colors={colors}
        pet={selectedPet}
        onSaveWeight={handleSaveDirectWeight}
      />

      {/* Dedicated Age Edit Modal */}
      <AgeModal
        visible={isAgeModalVisible}
        onClose={() => setIsAgeModalVisible(false)}
        colors={colors}
        pet={selectedPet}
        onSaveAge={handleSaveDirectAge}
      />

      {/* Quick Action Modal */}
      <ActionModal
        visible={isActionModalVisible}
        onClose={() => setIsActionModalVisible(false)}
        colors={colors}
        onSaveAction={handleSaveModalAction}
        currentWeight={selectedPet.weight}
      />

      {/* Add New Pet Modal */}
      <AddPetModal
        visible={isAddPetVisible}
        onClose={() => setIsAddPetVisible(false)}
        colors={colors}
        onAddPet={(newPet) => {
          onAddPet(newPet);
          onSelectPet(newPet);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  tipIconBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipTextCol: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  tipDesc: {
    fontSize: 12,
    lineHeight: 16,
  },
});

