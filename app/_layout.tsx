import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TranslationProvider } from '../src/contexts/TranslationContext';
import { useFontDetection } from '../src/hooks/useFontDetection';

// Prevenir que la splash screen se oculte automáticamente
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Detectar capacidades de fuentes del dispositivo
  useFontDetection();

  // Cargar fuentes
  const [loaded, error] = useFonts({
    "Aeonik-Regular": require("../assets/fonts/Aeonik-Regular.otf"),
    "Aeonik-Bold": require("../assets/fonts/Aeonik-Bold.otf"),
    "Aeonik-Light": require("../assets/fonts/Aeonik-Light.otf"),
    "Aeonik-RegularItalic": require("../assets/fonts/Aeonik-RegularItalic.otf"),
    "Aeonik-BoldItalic": require("../assets/fonts/Aeonik-BoldItalic.otf"),
    "Aeonik-LightItalic": require("../assets/fonts/Aeonik-LightItalic.otf"),
    "Frijole-Regular": require("../assets/fonts/Frijole-Regular.ttf"),
  });


  // Ocultar splash screen cuando las fuentes estén cargadas
  useEffect(() => {
    if (loaded || error) {
      console.log('📱 Font Loading Status:');
      console.log('  - Fonts Loaded:', loaded);
      console.log('  - Error:', error);
      console.log('  - Platform:', Platform.OS);
      console.log('  - Android Version:', Platform.Version);
      
      if (loaded) {
        console.log('✅ All fonts loaded successfully!');
      } else if (error) {
        console.log('❌ Font loading error:', error);
      }
      
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // No renderizar nada hasta que las fuentes estén cargadas
  if (!loaded && !error) {
    return null;
  }



  return (
    <SafeAreaProvider>
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
        </Stack>
        <StatusBar style="light" hidden={true} translucent={true} backgroundColor="transparent" />
      </TranslationProvider>
    </SafeAreaProvider>
  );
}
