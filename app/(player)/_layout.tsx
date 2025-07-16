import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";

export default function PlayerLayout() {
  SystemUI.setBackgroundColorAsync("#000000");
  return (
    <>
      <StatusBar translucent style={"auto"} />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
