// app/index.tsx (if using Expo Router and _layout.tsx)

import MovieList from "@/components/movieList"; // Adjust path based on your structure
import PopularList from "@/components/popularList";
import { Colors } from "@/constants/Colors";

import React from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "dark"];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: color.background }]}
    >
      <Text style={[styles.title, { color: color.text }]}>Trending </Text>
      <MovieList />

      <Text style={[styles.title, { color: color.text }]}>Now Playing</Text>
      <PopularList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    justifyContent: "center",
    alignContent: "center",
    overflow: "visible",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  popularSection: {
    // flexWrap: "wrap",
  },
});

export const options = {
  animation: "fade",
};
