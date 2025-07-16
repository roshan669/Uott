// app/index.tsx (if using Expo Router and _layout.tsx)

import MovieList from "@/components/movieList"; // Adjust path based on your structure
import PopularList from "@/components/popularList";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "expo-router";
import { StatusBar } from "expo-status-bar";

import React, { useEffect } from "react";
import { StyleSheet, Text, useColorScheme } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";

import { SafeAreaView } from "react-native-safe-area-context";

export default React.memo(function HomePage() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "dark"];
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  // Simulate loading for shimmer demo (replace with real loading logic)

  return (
    <SafeAreaView
      style={{
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      }}
    >
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
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
