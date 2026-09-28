import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pet } from '../types/pet';
import { ThemeColors } from '../constants/theme';

export interface PetCardProps {
  pet: Pet;
  onUpdateWeight: () => void;
  onUpdateAge: () => void;
  onToggleNeutered: () => void;
  onOpenQuickAction?: () => void;
  colors: ThemeColors;
}

export const PetCard: React.FC<PetCardProps> = ({
  pet,
  onUpdateWeight,
  onUpdateAge,
  onToggleNeutered,
  onOpenQuickAction,
  colors,
}) => {
  const getGenderText = () => (pet.gender === 'female' ? 'Dişi ♀' : 'Erkek ♂');

  const getPetTypeText = () => {
    switch (pet.type) {
      case 'cat':
        return 'Kedi';
      case 'dog':
        return 'Köpek';
      case 'bird':
        return 'Kuş';
      case 'rabbit':
        return 'Tavşan';
      default:
        return 'Evcil Hayvan';
    }
  };

  const getPetIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (pet.type) {
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
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.cardBorder,
        },
      ]}
    >
      <View style={styles.topSection}>
        {/* Avatar / Icon Circle with Real Animal Icon */}
        <View
          style={[
            styles.avatarCircle,
            { backgroundColor: pet.color || colors.primary },
          ]}
        >
          <MaterialCommunityIcons name={getPetIcon()} size={38} color="#FFFFFF" />
        </View>

        {/* Pet Name & Breed Info */}
        <View style={styles.infoCol}>
          <Text
            style={[styles.petName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {pet.name}
          </Text>

          <Text
            style={[styles.breedText, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            {pet.breed} • {getPetTypeText()}
          </Text>

          {pet.chipNumber ? (
            <View style={styles.chipRow}>
              <Ionicons name="barcode-outline" size={13} color={colors.textMuted} />
              <Text
                style={[styles.chipText, { color: colors.textMuted }]}
                numberOfLines={1}
              >
                {pet.chipNumber}
              </Text>
            </View>
          ) : null}
        </View>

        {/* Right Action Column: Gender Badge & Hızlı Kayıt Button under it */}
        <View style={styles.rightActionCol}>
          <View
            style={[
              styles.genderBadge,
              {
                backgroundColor:
                  pet.gender === 'female' ? colors.accentPurpleLight : colors.accentBlueLight,
              },
            ]}
          >
            <Text
              style={[
                styles.genderText,
                {
                  color:
                    pet.gender === 'female' ? colors.accentPurple : colors.accentBlue,
                },
              ]}
            >
              {getGenderText()}
            </Text>
          </View>

          {onOpenQuickAction ? (
            <TouchableOpacity
              style={[
                styles.quickActionBtn,
                {
                  backgroundColor: colors.primary,
                },
              ]}
              onPress={onOpenQuickAction}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={14} color="#FFFFFF" />
              <Text style={styles.quickActionBtnText}>Hızlı Kayıt</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Stats Quick Badges - All 3 are interactive (Yaş, Ağırlık, Kısırlık) */}
      <View style={[styles.statsRow, { borderTopColor: colors.divider }]}>
        {/* 1. YAŞ (Değiştirilebilir) */}
        <TouchableOpacity
          style={styles.statItem}
          onPress={onUpdateAge}
          activeOpacity={0.7}
        >
          <View style={styles.statLabelRow}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>YAŞ</Text>
            <Ionicons name="pencil" size={11} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {pet.age} Yaşında
          </Text>
        </TouchableOpacity>

        <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

        {/* 2. AĞIRLIK (Değiştirilebilir) */}
        <TouchableOpacity
          style={styles.statItem}
          onPress={onUpdateWeight}
          activeOpacity={0.7}
        >
          <View style={styles.statLabelRow}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>AĞIRLIK</Text>
            <Ionicons name="pencil" size={11} color={colors.primary} />
          </View>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            {pet.weight} kg
          </Text>
        </TouchableOpacity>

        <View style={[styles.statDivider, { backgroundColor: colors.divider }]} />

        {/* 3. KISIRLIK (Değiştirilebilir) */}
        <TouchableOpacity
          style={styles.statItem}
          onPress={onToggleNeutered}
          activeOpacity={0.7}
        >
          <View style={styles.statLabelRow}>
            <Text style={[styles.statLabel, { color: colors.textMuted }]}>KISIRLIK</Text>
            <Ionicons
              name="sync-outline"
              size={11}
              color={pet.isNeutered ? colors.primary : colors.accentYellow}
            />
          </View>
          <Text
            style={[
              styles.statValue,
              { color: pet.isNeutered ? colors.primary : colors.accentYellow },
            ]}
          >
            {pet.isNeutered ? 'Kısırlaştırılmış' : 'Değil'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PetCard;

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    marginTop: 8,
    marginBottom: 16,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  infoCol: {
    flex: 1,
  },
  petName: {
    fontSize: 21,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  breedText: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  chipText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  rightActionCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 7,
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  genderText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 12,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  statDivider: {
    width: 1,
    height: 24,
  },
});

