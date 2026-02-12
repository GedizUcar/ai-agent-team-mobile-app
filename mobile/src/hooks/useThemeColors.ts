import { useColorScheme } from 'react-native';
import { lightColors, darkColors, ThemeColors } from '../theme/colors';
import { useSettingsStore } from '../store/settingsStore';

export function useThemeColors(): ThemeColors {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  if (themeMode === 'system') {
    return systemScheme === 'dark' ? darkColors : lightColors;
  }

  return themeMode === 'dark' ? darkColors : lightColors;
}

export function useIsDarkMode(): boolean {
  const systemScheme = useColorScheme();
  const themeMode = useSettingsStore((s) => s.themeMode);

  if (themeMode === 'system') {
    return systemScheme === 'dark';
  }

  return themeMode === 'dark';
}
