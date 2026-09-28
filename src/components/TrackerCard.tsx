import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, LayoutAnimation } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Pet, VaccineItem } from '../types/pet';
import { ThemeColors } from '../constants/theme';

interface TrackerCardProps {
  pet: Pet;
  colors: ThemeColors;
  onQuickFeed: (grams: number) => void;
  onToggleMeal: (meal: 'breakfast' | 'lunch' | 'dinner') => void;
  onQuickWater: (ml: number) => void;
  onQuickWalk: (mins: number) => void;
  onToggleVaccine: (vaccineId: string) => void;
  onOpenQuickAction: () => void;
}

export const TrackerCards: React.FC<TrackerCardProps> = ({
  pet,
  colors,
  onQuickFeed,
  onToggleMeal,
  onQuickWater,
  onQuickWalk,
  onToggleVaccine,
  onOpenQuickAction,
}) => {
  // Collapsible cards state: default to compact overview so user can tap to expand detail
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    feeding: false,
    water: false,
    activity: false,
    vaccine: false,
  });

  const toggleCard = (cardKey: 'feeding' | 'water' | 'activity' | 'vaccine') => {
    if (Platform.OS !== 'web' && LayoutAnimation?.configureNext) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setExpandedCards((prev) => ({
      ...prev,
      [cardKey]: !prev[cardKey],
    }));
  };

  const isFeedingExpanded = expandedCards.feeding;
  const isWaterExpanded = expandedCards.water;
  const isActivityExpanded = expandedCards.activity;
  const isVaccineExpanded = expandedCards.vaccine;

  // Feeding calculations
  const targetGrams = pet.feeding.dailyTargetGrams || 1;
  const currentGrams = pet.feeding.currentGrams || 0;
  const feedRatio = Math.min(1, currentGrams / targetGrams);
  const feedPercent = Math.round(feedRatio * 100);
  const remainingGrams = Math.max(0, targetGrams - currentGrams);
  const portionPerMeal = Math.round(targetGrams / 3);

  // Quick feed buttons tailored to pet type
  const quickFeedAmounts =
    pet.type === 'bird'
      ? [5, 10, 15]
      : pet.type === 'rabbit'
      ? [15, 30, 45]
      : pet.type === 'dog'
      ? [50, 100, 150]
      : [25, 40, 50]; // Cat default

  const decrementAmount = quickFeedAmounts[0];
  const canReduce = (pet.feeding.currentGrams || 0) > 0;

  // Water calculation
  const waterRatio = Math.min(
    1,
    (pet.water.currentMl || 0) / (pet.water.dailyTargetMl || 1)
  );
  const waterPercent = Math.round(waterRatio * 100);

  // Walk calculation
  const walkRatio = Math.min(
    1,
    (pet.walk.currentMin || 0) / (pet.walk.dailyTargetMin || 1)
  );
  const walkPercent = Math.round(walkRatio * 100);

  // Next pending vaccine
  const pendingVaccines = pet.vaccines.filter((v) => !v.completed);
  const nextVaccine: VaccineItem | undefined = pendingVaccines[0];

  // Dynamic activity icon & title
  const getActivityTitle = () => {
    switch (pet.type) {
      case 'cat':
        return 'Oyun & Egzersiz';
      case 'bird':
        return 'Uçuş & Aktivite';
      case 'rabbit':
        return 'Zıplama & Oyun';
      default:
        return 'Yürüyüş';
    }
  };

  const getActivityIcon = (): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (pet.type) {
      case 'cat':
        return 'cat';
      case 'bird':
        return 'bird';
      case 'rabbit':
        return 'rabbit';
      default:
        return 'dog-side';
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. MAMA / BESLENME KARTI - MODERN CIRCULAR RING & MEAL PILLS */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Card Header Row - Clickable to expand/collapse details */}
        <TouchableOpacity
          style={[
            styles.cardHeader,
            !isFeedingExpanded && { marginBottom: 0 },
          ]}
          onPress={() => toggleCard('feeding')}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.accentYellowLight },
              ]}
            >
              <MaterialCommunityIcons name="bowl-mix" size={20} color={colors.accentYellow} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Beslenme Takibi
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {currentGrams}g / {targetGrams}g tüketildi
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.targetPillBadge,
                {
                  backgroundColor:
                    feedPercent >= 100
                      ? colors.primaryLight
                      : colors.accentYellowLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.targetPillText,
                  {
                    color:
                      feedPercent >= 100
                        ? colors.primaryDark
                        : colors.accentYellow,
                  },
                ]}
              >
                {feedPercent >= 100 ? 'Hedef Tamam 🎯' : `%${feedPercent}`}
              </Text>
            </View>
            <Ionicons
              name={isFeedingExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableOpacity>

        {/* Dashboard Body: Left Circular Ring + Right Sleek Meal Pills & Quick Add Buttons */}
        {isFeedingExpanded && (
          <>
        <View style={styles.feedingDashboardRow}>
          {/* Left Column: Modern Ring Gauge */}
          <View style={styles.ringColumn}>
            <View
              style={[
                styles.ringOuter,
                {
                  borderColor:
                    feedPercent >= 100
                      ? colors.primary
                      : feedPercent > 0
                      ? colors.accentYellow
                      : colors.divider,
                  backgroundColor: colors.cardBackground,
                },
              ]}
            >
              <View
                style={[
                  styles.ringInner,
                  {
                    backgroundColor:
                      feedPercent >= 100
                        ? colors.primaryLight
                        : colors.accentYellowLight,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.ringPercentText,
                    {
                      color:
                        feedPercent >= 100
                          ? colors.primaryDark
                          : colors.textPrimary,
                    },
                  ]}
                >
                  %{feedPercent}
                </Text>
                <Text
                  style={[
                    styles.ringRemainingText,
                    {
                      color:
                        remainingGrams === 0
                          ? colors.primaryDark
                          : colors.textMuted,
                    },
                  ]}
                >
                  {remainingGrams > 0 ? `${remainingGrams}g kaldı` : 'Doydu ✨'}
                </Text>
              </View>
            </View>
            <Text style={[styles.ringTargetLabel, { color: colors.textMuted }]}>
              Hedef: {targetGrams}g / gün
            </Text>
          </View>

          {/* Right Column: Sleek Meal Pills (Sabah, Öğle, Akşam) */}
          <View style={styles.mealPillsColumn}>
            {(
              [
                { key: 'breakfast', label: 'Sabah' },
                { key: 'lunch', label: 'Öğle' },
                { key: 'dinner', label: 'Akşam' },
              ] as const
            ).map((meal) => {
              const isDone = pet.feeding[meal.key];
              return (
                <TouchableOpacity
                  key={meal.key}
                  style={[
                    styles.mealPillItem,
                    {
                      backgroundColor: isDone
                        ? colors.primaryLight
                        : colors.inputBackground,
                      borderColor: isDone ? colors.primary : colors.divider,
                    },
                  ]}
                  onPress={() => onToggleMeal(meal.key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.mealPillLeft}>
                    <Ionicons
                      name={isDone ? 'checkmark-circle' : 'ellipse-outline'}
                      size={18}
                      color={isDone ? colors.primary : colors.textMuted}
                    />
                    <Text
                      style={[
                        styles.mealPillName,
                        {
                          color: isDone ? colors.primaryDark : colors.textPrimary,
                          fontWeight: isDone ? '700' : '600',
                        },
                      ]}
                    >
                      {meal.label}
                    </Text>
                  </View>

                  <View style={styles.mealPillRight}>
                    <Text
                      style={[
                        styles.mealPillPortion,
                        {
                          color: isDone ? colors.primaryDark : colors.textSecondary,
                        },
                      ]}
                    >
                      ~{portionPerMeal}g
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Add Buttons & Status */}
        <View style={[styles.actionRow, { borderTopColor: colors.divider }]}>
          <Text style={[styles.statusText, { color: colors.textMuted }]}>
            {pet.feeding.lastFedTime
              ? `🕒 Son: ${pet.feeding.lastFedTime}`
              : '🕒 Henüz verilmedi'}
          </Text>
          <View style={styles.quickBtnGroup}>
            <TouchableOpacity
              style={[
                styles.quickReduceBtn,
                {
                  backgroundColor: canReduce
                    ? colors.accentRedLight
                    : colors.inputBackground,
                  borderColor: canReduce ? colors.accentRed : colors.divider,
                  opacity: canReduce ? 1 : 0.4,
                },
              ]}
              onPress={() => onQuickFeed(-decrementAmount)}
              disabled={!canReduce}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.quickReduceBtnText,
                  { color: canReduce ? colors.accentRed : colors.textMuted },
                ]}
              >
                -{decrementAmount}g
              </Text>
            </TouchableOpacity>

            <View style={[styles.btnGroupDivider, { backgroundColor: colors.divider }]} />

            {/* Hızlı Ekleme Butonları */}
            {quickFeedAmounts.map((amount) => (
              <TouchableOpacity
                key={amount}
                style={[
                  styles.quickFeedBtn,
                  {
                    backgroundColor: colors.accentYellowLight,
                    borderColor: colors.accentYellow,
                  },
                ]}
                onPress={() => onQuickFeed(amount)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.quickFeedBtnText,
                    { color: colors.accentYellow },
                  ]}
                >
                  +{amount}g
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </>
    )}
  </View>

      {/* 2. SU TAKİBİ KARTI */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cardHeader,
            !isWaterExpanded && { marginBottom: 0 },
          ]}
          onPress={() => toggleCard('water')}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.accentBlueLight },
              ]}
            >
              <Ionicons name="water" size={20} color={colors.accentBlue} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Su Tüketimi
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {pet.water.currentMl} / {pet.water.dailyTargetMl} ml tüketildi
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.targetPillBadge,
                {
                  backgroundColor:
                    waterPercent >= 100
                      ? colors.primaryLight
                      : colors.accentBlueLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.targetPillText,
                  {
                    color:
                      waterPercent >= 100
                        ? colors.primaryDark
                        : colors.accentBlue,
                  },
                ]}
              >
                {waterPercent >= 100 ? 'Hedef Tamam 🎯' : `%${waterPercent}`}
              </Text>
            </View>
            <Ionicons
              name={isWaterExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableOpacity>

        {isWaterExpanded && (
          <View style={{ marginTop: 12 }}>
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: colors.inputBackground },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, waterPercent)}%`,
                    backgroundColor: colors.accentBlue,
                  },
                ]}
              />
            </View>

            <View style={styles.quickAddMiniRow}>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.accentBlueLight },
                ]}
                onPress={() => onQuickWater(50)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.accentBlue }]}>
                  +50 ml
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.accentBlueLight },
                ]}
                onPress={() => onQuickWater(150)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.accentBlue }]}>
                  +150 ml
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.accentBlueLight },
                ]}
                onPress={() => onQuickWater(250)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.accentBlue }]}>
                  +250 ml
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 3. AKTİVİTE / YÜRÜYÜŞ KARTI */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cardHeader,
            !isActivityExpanded && { marginBottom: 0 },
          ]}
          onPress={() => toggleCard('activity')}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.primaryLight },
              ]}
            >
              <MaterialCommunityIcons
                name={getActivityIcon()}
                size={20}
                color={colors.primary}
              />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                {getActivityTitle()}
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {pet.walk.currentMin} / {pet.walk.dailyTargetMin} dk tamamlandı
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View
              style={[
                styles.targetPillBadge,
                {
                  backgroundColor:
                    walkPercent >= 100
                      ? colors.primaryLight
                      : colors.primaryLight,
                },
              ]}
            >
              <Text
                style={[
                  styles.targetPillText,
                  {
                    color:
                      walkPercent >= 100
                        ? colors.primaryDark
                        : colors.primary,
                  },
                ]}
              >
                {walkPercent >= 100 ? 'Hedef Tamam 🎯' : `%${walkPercent}`}
              </Text>
            </View>
            <Ionicons
              name={isActivityExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableOpacity>

        {isActivityExpanded && (
          <View style={{ marginTop: 12 }}>
            <View
              style={[
                styles.progressBarBg,
                { backgroundColor: colors.inputBackground },
              ]}
            >
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${Math.min(100, walkPercent)}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.quickAddMiniRow}>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => onQuickWalk(10)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.primary }]}>
                  +10 dk
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => onQuickWalk(20)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.primary }]}>
                  +20 dk
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.miniAddBtn,
                  { backgroundColor: colors.primaryLight },
                ]}
                onPress={() => onQuickWalk(30)}
                activeOpacity={0.7}
              >
                <Text style={[styles.miniAddText, { color: colors.primary }]}>
                  +30 dk
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 3. AŞI VE SAĞLIK HATIRLATICI KARTI */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.cardHeader,
            !isVaccineExpanded && { marginBottom: 0 },
          ]}
          onPress={() => toggleCard('vaccine')}
          activeOpacity={0.7}
        >
          <View style={styles.headerTitleRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: colors.accentRedLight },
              ]}
            >
              <Ionicons name="medical" size={18} color={colors.accentRed} />
            </View>
            <View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Aşı & Sağlık Takvimi
              </Text>
              <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>
                {nextVaccine
                  ? `${nextVaccine.name} (Yaklaşıyor)`
                  : 'Veteriner koruyucu takibi'}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={onOpenQuickAction}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="add-circle" size={24} color={colors.accentRed} />
            </TouchableOpacity>
            <Ionicons
              name={isVaccineExpanded ? 'chevron-up' : 'chevron-down'}
              size={18}
              color={colors.textMuted}
            />
          </View>
        </TouchableOpacity>

        {isVaccineExpanded && (
          <View style={{ marginTop: 12 }}>
            {nextVaccine ? (
              <View
                style={[
                  styles.vaccineItemBox,
                  { backgroundColor: colors.inputBackground },
                ]}
              >
                <View style={styles.vaccineDetails}>
                  <View style={styles.vaccineBadgeRow}>
                    <Text
                      style={[
                        styles.vaccineName,
                        { color: colors.textPrimary },
                      ]}
                    >
                      {nextVaccine.name}
                    </Text>
                    <View
                      style={[
                        styles.tagBadge,
                        { backgroundColor: colors.accentYellowLight },
                      ]}
                    >
                      <Text
                        style={[styles.tagText, { color: colors.accentYellow }]}
                      >
                        Yaklaşıyor
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.vaccineDate, { color: colors.textSecondary }]}>
                    📅 Tarih: {nextVaccine.dueDate}
                  </Text>
                  {nextVaccine.notes ? (
                    <Text style={[styles.vaccineNote, { color: colors.textMuted }]}>
                      ℹ️ {nextVaccine.notes}
                    </Text>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={[
                    styles.doneVaccineBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => onToggleVaccine(nextVaccine.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                  <Text style={styles.doneVaccineText}>Yapıldı</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  styles.emptyVaccineBox,
                  { backgroundColor: colors.primaryLight },
                ]}
              >
                <Ionicons name="checkmark-done-circle" size={24} color={colors.primary} />
                <Text style={[styles.emptyVaccineText, { color: colors.primaryDark }]}>
                  Tüm aşılar güncel! Harika bakım 🌟
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  targetPillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  targetPillText: {
    fontSize: 12,
    fontWeight: '800',
  },
  // Modern Ring & Meal Pills Dashboard Styles
  feedingDashboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
    marginBottom: 14,
  },
  ringColumn: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 104,
  },
  ringOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 5.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  ringInner: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  ringPercentText: {
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  ringRemainingText: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  ringTargetLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 6,
  },
  mealPillsColumn: {
    flex: 1,
    gap: 7,
  },
  mealPillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  mealPillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  mealPillName: {
    fontSize: 13,
  },
  mealPillRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealPillPortion: {
    fontSize: 12,
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    paddingTop: 10,
  },
  statusText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  quickBtnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quickReduceBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickReduceBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  btnGroupDivider: {
    width: 1,
    height: 18,
    marginHorizontal: 2,
  },
  quickFeedBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickFeedBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  // Dual Cards (Water & Activity)
  dualRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
  },
  halfCard: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  halfCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  halfTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 6,
  },
  halfTitleTextCol: {
    flex: 1,
    justifyContent: 'center',
  },
  halfPercentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  halfPercent: {
    fontSize: 13,
    fontWeight: '800',
  },
  halfTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  halfValue: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  quickAddMiniRow: {
    flexDirection: 'row',
    gap: 8,
  },
  miniAddBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  miniAddText: {
    fontSize: 11,
    fontWeight: '700',
  },
  // Vaccine Card
  vaccineItemBox: {
    padding: 12,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  vaccineDetails: {
    flex: 1,
  },
  vaccineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  vaccineName: {
    fontSize: 14,
    fontWeight: '700',
  },
  tagBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  vaccineDate: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  vaccineNote: {
    fontSize: 11,
  },
  doneVaccineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  doneVaccineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyVaccineBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
  },
  emptyVaccineText: {
    fontSize: 13,
    fontWeight: '600',
  },
});

