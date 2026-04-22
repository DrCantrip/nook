import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Tabs } from "expo-router";
import { House, ShoppingBag, Wrench, User } from "phosphor-react-native";
import { STRINGS } from "../../src/content/strings";
import { colors } from "../../src/theme/tokens";

const S = STRINGS.tabs;

function AnimatedTabIcon({
  Icon,
  color,
  focused,
}: {
  Icon: typeof House;
  color: string;
  focused: boolean;
}) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (focused) {
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1.0,
          duration: 120,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Icon size={24} color={color} weight={focused ? "fill" : "light"} />
    </Animated.View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.warm400,
        tabBarLabelStyle: {
          fontFamily: "DMSans-Medium",
          fontSize: 11,
          fontWeight: "500",
        },
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.warm100,
        },
        tabBarItemStyle: {
          paddingVertical: 4,
          minHeight: 44,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: S.home,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={House} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: S.products,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={ShoppingBag} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="trades"
        options={{
          title: S.trades,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={Wrench} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: S.profile,
          tabBarIcon: ({ color, focused }) => (
            <AnimatedTabIcon Icon={User} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen name="archetype-depth" options={{ href: null }} />
    </Tabs>
  );
}
