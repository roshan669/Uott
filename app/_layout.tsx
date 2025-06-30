import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

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
