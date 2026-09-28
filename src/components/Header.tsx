import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pet } from '../types/pet';
import { ThemeColors } from '../constants/theme';

export interface HeaderProps {
  pets: Pet[];
  selectedPet: Pet;
  onSelectPet: (pet: Pet) => void;
  onAddNewPet: () => void;
  colors: ThemeColors;
}

export const Header: React.FC<HeaderProps> = ({
  pets,
  selectedPet,
  onSelectPet,
  onAddNewPet,
  colors,
}) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın ☀️';
    if (hour < 18) return 'İyi Günler 🌿';
    return 'İyi Akşamlar 🌙';
  };

  const getPetTypeLabel = (type: string) => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'cat':
        return 'Kedi';
      case 'dog':
        return 'Köpek';
      case 'bird':
        return 'Kuş';
      case 'rabbit':
        return 'Tavşan';
      default:
        return 'Kuş';
    }
  };

  const getPetIcon = (type: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const t = (type || '').toLowerCase();
    switch (t) {
      case 'cat':
        return 'cat';
      case 'dog':
        return 'dog';
      case 'bird':
        return 'bird';
      case 'rabbit':
        return 'rabbit';
      default:
        return 'paw';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Top Branding & Subtitle */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            {getGreeting()}
          </Text>
          <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
            Pati Takibi
          </Text>
        </View>

        <View style={[styles.logoBadge, { backgroundColor: colors.primaryLight }]}>
          <MaterialCommunityIcons name="paw" size={20} color={colors.primary} />
          <Text style={[styles.logoBadgeText, { color: colors.primary }]}>Vitax</Text>
        </View>
      </View>

      {/* Pet Selector Horizontal Carousel */}
      <View style={styles.selectorWrapper}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>
          Evcil Hayvanlarım
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.petScroll}
        >
          {pets.map((pet) => {
            const isSelected = pet.id === selectedPet.id;
            const iconName = getPetIcon(pet.type);
            const typeLabel = getPetTypeLabel(pet.type);

            return (
              <TouchableOpacity
                key={pet.id}
                style={[
                  styles.petChip,
                  {
                    backgroundColor: isSelected ? colors.primary : colors.cardBackground,
                    borderColor: isSelected ? colors.primary : colors.cardBorder,
                  },
                ]}
                onPress={() => onSelectPet(pet)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.chipIconContainer,
                    {
                      backgroundColor: isSelected
                        ? 'rgba(255,255,255,0.25)'
                        : colors.primaryLight,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={iconName}
                    size={17}
                    color={isSelected ? '#FFFFFF' : colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.petChipName,
                    {
                      color: isSelected ? '#FFFFFF' : colors.textPrimary,
                      fontWeight: isSelected ? '700' : '600',
                    },
                  ]}
                >
                  {pet.name}
                </Text>
                <Text
                  style={[
                    styles.petChipBreed,
                    { color: isSelected ? 'rgba(255,255,255,0.85)' : colors.textSecondary },
                  ]}
                >
                  {typeLabel}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Add New Pet Button */}
          <TouchableOpacity
            style={[
              styles.addPetChip,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.primary,
              },
            ]}
            onPress={onAddNewPet}
            activeOpacity={0.7}
          >
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.addPetText, { color: colors.primary }]}>Yeni Ekle</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  appTitle: {
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  logoBadgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
  selectorWrapper: {
    marginTop: 4,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  petScroll: {
    gap: 10,
    paddingRight: 20,
  },
  petChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  chipIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  petChipName: {
    fontSize: 14,
  },
  petChipBreed: {
    fontSize: 12,
  },
  addPetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    gap: 6,
  },
  addPetText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
