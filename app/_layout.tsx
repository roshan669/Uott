import { MovieContextProvider } from "@/contexts/movieContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <MovieContextProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </MovieContextProvider>
  );
}
