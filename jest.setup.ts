// Jest setup — shared mocks for Cornr test suite.
// First test lands 14 April 2026 (S2-T4 reveal screen fallback path).

jest.mock("./src/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
    functions: { invoke: jest.fn() },
    auth: {
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: { subscription: { unsubscribe: jest.fn() } },
      })),
    },
  },
}));

jest.mock("expo-router", () => ({
  Stack: { Screen: () => null },
  useRouter: () => ({ replace: jest.fn(), push: jest.fn() }),
}));

jest.mock("expo-linear-gradient", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    LinearGradient: ({ children, style }: any) =>
      React.createElement(View, { style }, children),
  };
});

jest.mock("react-native-reanimated", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return {
    __esModule: true,
    default: {
      View: (props: any) => React.createElement(View, props),
      Text: (props: any) => React.createElement(Text, props),
    },
    useSharedValue: (v: any) => ({ value: v }),
    useAnimatedStyle: () => ({}),
    withSpring: (v: any) => v,
    withTiming: (v: any) => v,
    withDelay: (_d: any, v: any) => v,
  };
});

jest.mock("@sentry/react-native", () => ({
  captureMessage: jest.fn(),
  captureException: jest.fn(),
}));
