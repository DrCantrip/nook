import { useFonts } from 'expo-font';

export function useAppFonts() {
  const [fontsLoaded] = useFonts({
    'Lora-SemiBold': require('../../assets/fonts/Lora-SemiBold.ttf'),
    'Lora-Bold': require('../../assets/fonts/Lora-Bold.ttf'),
    'DMSans-Regular': require('../../assets/fonts/DMSans-Regular.ttf'),
    'DMSans-Medium': require('../../assets/fonts/DMSans-Medium.ttf'),
    'DMSans-SemiBold': require('../../assets/fonts/DMSans-SemiBold.ttf'),
    'NewsreaderItalic': require('../../assets/fonts/NewsreaderItalic.ttf'),
  });
  return { fontsLoaded };
}
