import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { STRINGS } from "../../src/content/strings";

export default function TradesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-warmstone">
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-[22px] font-semibold tracking-tight text-primary-900">
          {STRINGS.tabs.trades}
        </Text>
      </View>
    </SafeAreaView>
  );
}
