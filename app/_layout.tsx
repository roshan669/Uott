import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "react-native";
export const unstable_settings = {
  initialRouteName: "index",
  // Only include these as tabs
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  SystemUI.setBackgroundColorAsync("#000000");

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
