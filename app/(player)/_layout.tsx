import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SystemUI from "expo-system-ui";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function PlayerLayout() {
  SystemUI.setBackgroundColorAsync("#000000");
  return (
    <GestureHandlerRootView>
      <StatusBar translucent style={"auto"} />
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
