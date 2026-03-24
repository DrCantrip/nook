import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "../../src/content/strings";

export default function ProductsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-warmstone">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[22px] font-semibold tracking-tight text-primary-900">
          {STRINGS.tabs.products}
        </Text>
      </View>
    </SafeAreaView>
  );
}
