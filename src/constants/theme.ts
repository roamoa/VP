export const Colors = {
  light: {
    background: '#F8FAFC',
    cardBackground: '#FFFFFF',
    cardBorder: '#F1F5F9',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    primary: '#10B981', // Canlı Zümrüt Yeşili
    primaryLight: '#D1FAE5',
    primaryDark: '#047857',
    secondary: '#F97316', // Sıcak Turuncu
    secondaryLight: '#FFEDD5',
    accentBlue: '#3B82F6',
    accentBlueLight: '#DBEAFE',
    accentPurple: '#8B5CF6',
    accentPurpleLight: '#EDE9FE',
    accentRed: '#EF4444',
    accentRedLight: '#FEE2E2',
    accentYellow: '#F59E0B',
    accentYellowLight: '#FEF3C7',
    tabBarBackground: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabBarActive: '#10B981',
    tabBarInactive: '#94A3B8',
    inputBackground: '#F1F5F9',
    divider: '#E2E8F0',
    shadowColor: '#000000',
  },
  dark: {
    background: '#0F172A',
    cardBackground: '#1E293B',
    cardBorder: '#334155',
    textPrimary: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    primary: '#34D399',
    primaryLight: '#064E3B',
    primaryDark: '#059669',
    secondary: '#FB923C',
    secondaryLight: '#7C2D12',
    accentBlue: '#60A5FA',
    accentBlueLight: '#1E3A8A',
    accentPurple: '#A78BFA',
    accentPurpleLight: '#4C1D95',
    accentRed: '#F87171',
    accentRedLight: '#7F1D1D',
    accentYellow: '#FBBF24',
    accentYellowLight: '#78350F',
    tabBarBackground: '#1E293B',
    tabBarBorder: '#334155',
    tabBarActive: '#34D399',
    tabBarInactive: '#64748B',
    inputBackground: '#334155',
    divider: '#334155',
    shadowColor: '#000000',
  },
};

export type ThemeColors = typeof Colors.light;

export const FONT_FAMILY = {
  regular: 'Poppins_400Regular',
  medium: 'Poppins_500Medium',
  semiBold: 'Poppins_600SemiBold',
  bold: 'Poppins_700Bold',
  extraBold: 'Poppins_800ExtraBold',
};

export const Typography = {
  h1: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 26,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: FONT_FAMILY.bold,
    fontSize: 20,
    fontWeight: '700' as const,
    letterSpacing: -0.3,
  },
  h3: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 17,
    fontWeight: '600' as const,
  },
  body: {
    fontFamily: FONT_FAMILY.regular,
    fontSize: 15,
    fontWeight: '400' as const,
  },
  bodyBold: {
    fontFamily: FONT_FAMILY.semiBold,
    fontSize: 15,
    fontWeight: '600' as const,
  },
  caption: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 13,
    fontWeight: '500' as const,
  },
  small: {
    fontFamily: FONT_FAMILY.medium,
    fontSize: 11,
    fontWeight: '500' as const,
  },
};

