import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { TranslationProvider } from '../src/contexts/TranslationContext';

export default function RootLayout() {
  return (
    <TranslationProvider>
              <Stack>
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="buildings" options={{ headerShown: false }} />
                <Stack.Screen name="building-detail" options={{ headerShown: false }} />
                <Stack.Screen name="documents" options={{ headerShown: false }} />
                <Stack.Screen name="users" options={{ headerShown: false }} />
                <Stack.Screen name="send-email" options={{ headerShown: false }} />
                <Stack.Screen name="notifications" options={{ headerShown: false }} />
                <Stack.Screen name="my-data" options={{ headerShown: false }} />
                <Stack.Screen name="user-type" options={{ headerShown: false }} />
                <Stack.Screen name="alerts" options={{ headerShown: false }} />
                <Stack.Screen name="change-password" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
      <StatusBar style="light" hidden={true} />
    </TranslationProvider>
  );
}
