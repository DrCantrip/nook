import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { DoorOpen } from "phosphor-react-native";
import { useAuth } from "../../src/hooks/useAuth";
import { supabase } from "../../src/lib/supabase";
import { STRINGS } from "../../src/content/strings";
import { colors, spacing, radius, typography } from "../../src/theme/tokens";

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
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>{S.title}</Text>
      </View>

      {rooms.length === 0 ? (
        <View style={styles.emptyState}>
          <DoorOpen size={64} color={colors.warm200} weight="light" />
          <Text style={styles.emptyHeadline}>{S.emptyHeadline}</Text>
          <Text style={styles.emptySubtext}>{S.emptySubtext}</Text>
          <View style={styles.ctaWrapper}>
            <Pressable
              style={({ pressed }) => [styles.ctaPressable, { opacity: pressed ? 0.85 : 1 }]}
              onPress={() => router.push("/(app)/room-setup" as never)}
            >
              <Text style={styles.ctaText}>{S.emptyCta}</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          renderItem={({ item }) => (
            <View style={styles.roomCard}>
              <Text style={styles.roomName}>{item.display_name}</Text>
              <Text style={styles.roomMeta}>
                {item.room_type}
                {item.budget_tier ? ` · ${item.budget_tier}` : ""}
              </Text>
            </View>
          )}
          ListFooterComponent={
            hasRecommendations ? (
              <View style={styles.secondRoomCard}>
                <Text style={styles.secondRoomText}>{S.secondRoomPrompt}</Text>
                <View style={styles.ctaWrapper}>
                  <Pressable
                    style={({ pressed }) => [styles.ctaPressable, { opacity: pressed ? 0.85 : 1 }]}
                    onPress={() => router.push("/(app)/room-setup" as never)}
                  >
                    <Text style={styles.ctaText}>{S.secondRoomCta}</Text>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  loadingText: { ...typography.body, color: colors.warm400 },
  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.xl,
    paddingBottom: spacing.sm,
  },
  title: { ...typography.screenTitle, color: colors.ink },
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: spacing.xl,
    justifyContent: "flex-start",
    paddingTop: "40%",
  },
  emptyHeadline: {
    ...typography.body,
    color: colors.warm600,
    marginTop: spacing.xl,
    textAlign: "center",
  },
  emptySubtext: {
    ...typography.uiLabel,
    color: colors.warm400,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  ctaWrapper: {
    backgroundColor: colors.accentSurface,
    borderRadius: radius.button,
    marginTop: spacing["3xl"],
    alignSelf: "stretch",
    overflow: "hidden",
  },
  ctaPressable: {
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: { ...typography.cta, color: colors.white },
  listContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing["2xl"] },
  roomCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  roomName: { ...typography.cardHeading, color: colors.ink },
  roomMeta: {
    ...typography.uiLabel,
    color: colors.warm600,
    marginTop: spacing.xs,
    textTransform: "capitalize",
  },
  secondRoomCard: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    marginTop: spacing.md,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  secondRoomText: { ...typography.body, color: colors.warm600 },
});
