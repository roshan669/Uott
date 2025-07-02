// app/index.tsx (if using Expo Router and _layout.tsx)

import MovieList from "@/components/movieList"; // Adjust path based on your structure
import PopularList from "@/components/popularList";
import { Colors } from "@/constants/Colors";

import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";

import { SafeAreaView } from "react-native-safe-area-context";

export default React.memo(function HomePage() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "dark"];

  // Simulate loading for shimmer demo (replace with real loading logic)

  return (
    <SafeAreaView
      style={{
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      }}
    >
      <Text style={[styles.title, { color: color.text }]}>Trending</Text>
      <MovieList />
      <Text style={[styles.title, { color: color.text }]}>Now Playing</Text>
      <PopularList />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 10,
    // overflow: "visible",
    // paddingBottom: 80, // Add bottom padding to ensure content is not hidden behind the tab bar
  },
  title: {
    fontWeight: "bold",
    fontSize: 26,
    fontStyle: "normal",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
});

export const options = {
  animation: "fade",
};
