import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TranslationProvider } from '../src/contexts/TranslationContext';

export default function RootLayout() {
  return (
    <TranslationProvider>
      <Stack>
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="light" hidden={true} />
    </TranslationProvider>
  );
}
