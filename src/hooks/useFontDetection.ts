import { useEffect } from 'react';
import { Platform } from 'react-native';

export const useFontDetection = () => {
  useEffect(() => {
    console.log('🔍 Device Font Detection:');
    console.log('  - Platform:', Platform.OS);
    console.log('  - Version:', Platform.Version);
    
    if (Platform.OS === 'android') {
      console.log('  - Android API Level:', Platform.Version);
      
      if (Platform.Version < 21) {
        console.log('⚠️  WARNING: Old Android version - limited font support');
        console.log('  - Recommended: Use system fonts (Roboto)');
      } else if (Platform.Version < 26) {
        console.log('⚠️  WARNING: Medium Android version - basic font support');
        console.log('  - Custom fonts may work but with limitations');
      } else {
        console.log('✅ Modern Android - full font support');
      }
    } else if (Platform.OS === 'ios') {
      console.log('✅ iOS - full font support');
    }
    
    // Log de fuentes del sistema
    console.log('📱 System Fonts:');
    console.log('  - Android default: Roboto');
    console.log('  - iOS default: San Francisco');
    console.log('  - Web default: Arial, sans-serif');
    
  }, []);
};
