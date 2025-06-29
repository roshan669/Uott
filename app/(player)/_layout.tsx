import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { useColorScheme } from "react-native";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <>
      <StatusBar style={colorScheme === "light" ? "dark" : "light"} />
      <Stack screenOptions={{ headerShown: false }}>
        {/* No need to manually add screens for nested routes. Expo Router will handle them. */}
      </Stack>
    </>
  );
}
