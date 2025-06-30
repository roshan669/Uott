import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";

export default function PlayerLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} hidden />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
