import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemeColors } from '../constants/theme';

export interface BottomNavProps {
  currentTab: 'home' | 'settings';
  onSelectTab: (tab: 'home' | 'settings') => void;
  onOpenQuickAction: () => void;
  colors: ThemeColors;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenQuickAction,
  colors,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.tabBarBackground,
          borderTopColor: colors.tabBarBorder,
        },
      ]}
    >
      {/* Ana Sayfa Tab */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('home')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconWrapper,
            currentTab === 'home' && { backgroundColor: colors.primaryLight },
          ]}
        >
          <Ionicons
            name={currentTab === 'home' ? 'paw' : 'paw-outline'}
            size={22}
            color={currentTab === 'home' ? colors.primary : colors.tabBarInactive}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: currentTab === 'home' ? colors.primary : colors.tabBarInactive,
              fontWeight: currentTab === 'home' ? '700' : '500',
            },
          ]}
        >
          Ana Sayfa
        </Text>
      </TouchableOpacity>

      {/* Quick Action Center Button */}
      <TouchableOpacity
        style={[styles.centerButton, { backgroundColor: colors.primary }]}
        onPress={onOpenQuickAction}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Ayarlar Tab */}
      <TouchableOpacity
        style={styles.tabButton}
        onPress={() => onSelectTab('settings')}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.iconWrapper,
            currentTab === 'settings' && { backgroundColor: colors.primaryLight },
          ]}
        >
          <Ionicons
            name={currentTab === 'settings' ? 'settings' : 'settings-outline'}
            size={22}
            color={currentTab === 'settings' ? colors.primary : colors.tabBarInactive}
          />
        </View>
        <Text
          style={[
            styles.tabLabel,
            {
              color: currentTab === 'settings' ? colors.primary : colors.tabBarInactive,
              fontWeight: currentTab === 'settings' ? '700' : '500',
            },
          ]}
        >
          Ayarlar
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNav;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: Platform.OS === 'ios' ? 76 : 64,
    paddingBottom: Platform.OS === 'ios' ? 18 : 6,
    borderTopWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  iconWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 2,
  },
  tabLabel: {
    fontSize: 12,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    marginHorizontal: 10,
    marginTop: -16,
  },
});

