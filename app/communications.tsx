import { Stack } from 'expo-router';
import { CommunicationsScreen } from '../src/screens/CommunicationsScreen';

export default function Communications() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <CommunicationsScreen />
    </>
  );
}
