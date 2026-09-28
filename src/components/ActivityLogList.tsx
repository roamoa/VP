import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, LayoutAnimation } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ActivityLogItem } from '../types/pet';
import { ThemeColors } from '../constants/theme';

export interface ActivityLogListProps {
  activities: ActivityLogItem[];
  colors: ThemeColors;
}

export const ActivityLogList: React.FC<ActivityLogListProps> = ({ activities, colors }) => {
  const [showAll, setShowAll] = useState(false);

  const handleToggle = () => {
    if (Platform.OS !== 'web' && LayoutAnimation?.configureNext) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
    setShowAll((prev) => !prev);
  };

  const displayedActivities = showAll ? activities : activities.slice(0, 3);

  const getActivityIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'feeding':
        return { icon: 'nutrition', color: colors.accentYellow, bg: colors.accentYellowLight };
      case 'water':
        return { icon: 'water', color: colors.accentBlue, bg: colors.accentBlueLight };
      case 'walk':
        return { icon: 'walk', color: colors.primary, bg: colors.primaryLight };
      case 'med':
      case 'vet':
        return { icon: 'medical', color: colors.accentRed, bg: colors.accentRedLight };
      case 'weight':
        return { icon: 'scale', color: colors.accentPurple, bg: colors.accentPurpleLight };
      default:
        return { icon: 'time', color: colors.primary, bg: colors.primaryLight };
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
          Günün Aktiviteleri 📋
        </Text>
        {activities.length > 3 && (
          <TouchableOpacity onPress={handleToggle} activeOpacity={0.7}>
            <Text style={[styles.headerSeeAll, { color: colors.primary }]}>
              {showAll ? 'Daha Az' : `Tümünü Gör (${activities.length})`}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {activities.length === 0 ? (
        <View
          style={[
            styles.emptyCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          <Text style={[styles.emptyText, { color: colors.textMuted }]}>
            Bugün için henüz bir aktivite kaydedilmedi.
          </Text>
        </View>
      ) : (
        <View
          style={[
            styles.listCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.cardBorder },
          ]}
        >
          {displayedActivities.map((item, index) => {
            const { icon, color, bg } = getActivityIcon(item.type);
            const isLast = index === displayedActivities.length - 1;

            return (
              <View key={item.id} style={styles.row}>
                {/* Timeline Icon Column */}
                <View style={styles.iconCol}>
                  <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
                    <Ionicons name={icon as any} size={16} color={color} />
                  </View>
                  {!isLast && (
                    <View style={[styles.line, { backgroundColor: colors.divider }]} />
                  )}
                </View>

                {/* Content Column */}
                <View style={[styles.contentCol, !isLast && { paddingBottom: 16 }]}>
                  <View style={styles.contentHeader}>
                    <Text style={[styles.title, { color: colors.textPrimary }]}>
                      {item.title}
                    </Text>
                    <Text style={[styles.time, { color: colors.textMuted }]}>
                      {item.time}
                    </Text>
                  </View>
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    {item.detail}
                  </Text>
                </View>
              </View>
            );
          })}

          {activities.length > 3 && (
            <TouchableOpacity
              style={[
                styles.seeAllButton,
                { backgroundColor: colors.primaryLight },
              ]}
              onPress={handleToggle}
              activeOpacity={0.7}
            >
              <Text style={[styles.seeAllButtonText, { color: colors.primary }]}>
                {showAll
                  ? 'Daha Az Göster'
                  : `Tümünü Gör (${activities.length} aktivite)`}
              </Text>
              <Ionicons
                name={showAll ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={colors.primary}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default ActivityLogList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  headerSeeAll: {
    fontSize: 13,
    fontWeight: '700',
  },
  emptyCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  listCard: {
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
  },
  iconCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  contentCol: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  detail: {
    fontSize: 13,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 4,
  },
  seeAllButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});

