import React, { memo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../hooks/useThemeColors';
import { typography, spacing, borderRadius } from '../../theme';
import { useSettingsStore, ThemeMode } from '../../store/settingsStore';
import { authService } from '../../services/auth';
import type { ProfileStackScreenProps } from '../../navigation/types';

type Props = ProfileStackScreenProps<'Settings'>;

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { value: 'light', label: 'Acik', icon: 'sunny-outline' },
  { value: 'dark', label: 'Koyu', icon: 'moon-outline' },
  { value: 'system', label: 'Sistem', icon: 'phone-portrait-outline' },
];

function SettingsScreenComponent({ navigation }: Props) {
  const colors = useThemeColors();
  const themeMode = useSettingsStore((s) => s.themeMode);
  const setThemeMode = useSettingsStore((s) => s.setThemeMode);
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotificationsEnabled = useSettingsStore((s) => s.setNotificationsEnabled);

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Cikis Yap',
      'Hesabinizdan cikis yapmak istediginize emin misiniz?',
      [
        { text: 'Iptal', style: 'cancel' },
        {
          text: 'Cikis Yap',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch {
              // Logout should always succeed from user perspective
            }
          },
        },
      ],
    );
  }, []);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      testID="settings-screen"
    >
      {/* Theme Section */}
      <View style={styles.section}>
        <Text style={[typography.subtitle2, styles.sectionLabel, { color: colors.textSecondary }]}>
          TEMA
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          {THEME_OPTIONS.map((option, index) => (
            <React.Fragment key={option.value}>
              {index > 0 && <View style={[styles.divider, { backgroundColor: colors.border }]} />}
              <TouchableOpacity
                style={styles.themeOption}
                onPress={() => setThemeMode(option.value)}
                activeOpacity={0.7}
                testID={`settings-theme-${option.value}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: themeMode === option.value }}
                accessibilityLabel={`${option.label} tema`}
              >
                <View style={styles.themeOptionLeft}>
                  <Ionicons name={option.icon} size={22} color={colors.text} />
                  <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.md }]}>
                    {option.label}
                  </Text>
                </View>
                {themeMode === option.value && (
                  <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Notifications Section */}
      <View style={styles.section}>
        <Text style={[typography.subtitle2, styles.sectionLabel, { color: colors.textSecondary }]}>
          BILDIRIMLER
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchRowLeft}>
              <Ionicons name="notifications-outline" size={22} color={colors.text} />
              <Text style={[typography.body1, { color: colors.text, marginLeft: spacing.md }]}>
                Bildirimler
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: colors.border, true: colors.primary + '80' }}
              thumbColor={notificationsEnabled ? colors.primary : colors.textTertiary}
              testID="settings-notifications-switch"
            />
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={[typography.subtitle2, styles.sectionLabel, { color: colors.textSecondary }]}>
          HESAP
        </Text>
        <View style={[styles.card, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
            testID="settings-logout-button"
            accessibilityRole="button"
            accessibilityLabel="Cikis Yap"
          >
            <Ionicons name="log-out-outline" size={22} color={colors.error} />
            <Text style={[typography.body1, { color: colors.error, marginLeft: spacing.md }]}>
              Cikis Yap
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* App Version */}
      <Text
        style={[
          typography.caption,
          { color: colors.textTertiary, textAlign: 'center', marginTop: spacing.lg },
        ]}
      >
        Stilora v1.0.0
      </Text>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  sectionLabel: {
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
  },
  card: {
    borderRadius: borderRadius.xl,
    overflow: 'hidden',
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  themeOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: spacing.md + 22 + spacing.md,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  switchRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  bottomSpacer: {
    height: spacing.xl,
  },
});

export const SettingsScreen = memo(SettingsScreenComponent);
