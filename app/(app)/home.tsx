import { useCallback, useEffect, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { DoorOpen } from "phosphor-react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { supabase } from "../../src/lib/supabase";
import { STRINGS } from "../../src/content/strings";

const S = STRINGS.home;

type Room = {
  id: string;
  room_type: string;
  display_name: string;
  budget_tier: string;
  room_analysis: Record<string, unknown> | null;
};

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRooms = useCallback(async () => {
    if (!user) {
      setRooms([]);
      setLoading(false);
      return;
    }
    const { data } = await Promise.resolve(
      supabase
        .from("rooms")
        .select("id, room_type, display_name, budget_tier, room_analysis")
        .eq("user_id", user.id)
        .order("display_name")
    );
    setRooms(data ?? []);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRooms();
    setRefreshing(false);
  }, [fetchRooms]);

  const hasRecommendations =
    rooms.length === 1 && rooms[0].room_analysis !== null;

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-warmstone" edges={["top"]}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray-400">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-warmstone" edges={["top"]}>
      <View className="px-5 pt-6 pb-2">
        <Text className="text-[22px] font-semibold text-primary-900" style={{ letterSpacing: -0.3 }}>
          {S.title}
        </Text>
      </View>

      {rooms.length === 0 ? (
        <View className="flex-1 items-center px-5" style={{ justifyContent: "flex-start", paddingTop: "40%" }}>
          <DoorOpen size={64} color="#D1D5DB" weight="light" />
          <Text className="text-base font-normal text-gray-600 mt-5 text-center" style={{ lineHeight: 24 }}>
            {S.emptyHeadline}
          </Text>
          <Text className="text-sm font-normal text-gray-500 mt-2 text-center" style={{ lineHeight: 20 }}>
            {S.emptySubtext}
          </Text>
          <View className="bg-primary-900 rounded-button mt-8 self-stretch overflow-hidden">
            <Pressable
              className="min-h-[52px] items-center justify-center"
              onPress={() => router.push("/(app)/room-setup" as never)}
              style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
            >
              <Text className="text-white text-base font-semibold" style={{ letterSpacing: 0.2, lineHeight: 20 }}>
                {S.emptyCta}
              </Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View className="bg-white rounded-card p-4 mb-3 shadow-sm">
              <Text className="text-[17px] font-semibold text-primary-900">
                {item.display_name}
              </Text>
              <Text className="text-sm text-gray-500 mt-1 capitalize">
                {item.room_type}
                {item.budget_tier ? ` · ${item.budget_tier}` : ""}
              </Text>
            </View>
          )}
          ListFooterComponent={
            hasRecommendations ? (
              <View className="bg-white rounded-card p-4 mt-3 shadow-sm">
                <Text className="text-base text-gray-700">
                  {S.secondRoomPrompt}
                </Text>
                <View className="bg-primary-900 rounded-button mt-4 overflow-hidden">
                  <Pressable
                    className="min-h-[52px] items-center justify-center"
                    onPress={() => router.push("/(app)/room-setup" as never)}
                    style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                  >
                    <Text className="text-white text-base font-semibold" style={{ letterSpacing: 0.2, lineHeight: 20 }}>
                      {S.secondRoomCta}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}
