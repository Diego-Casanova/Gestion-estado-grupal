import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { SolicitudesProvider } from '@/context/SolicitudesContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SolicitudesProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerTitle: 'Solicitudes locales' }} />
      </ThemeProvider>
    </SolicitudesProvider>
  );
}
