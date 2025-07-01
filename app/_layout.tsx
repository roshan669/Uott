import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
export const unstable_settings = {
  initialRouteName: "index",
  // Only include these as tabs
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <StatusBar
        style={colorScheme === "light" ? "dark" : "light"}
        translucent
      />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
