// app/index.tsx (if using Expo Router and _layout.tsx)
import MovieList from "@/components/movieList"; // Adjust path based on your structure
import PopularList from "@/components/popularList";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  const popularsec = () => (
    <View>
      <Text style={styles.title}>Popular</Text>
      <PopularList type="popular" />
    </View>
  );
  return (
    <ScrollView>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Trending</Text>
        <MovieList type="trending" />

        <Text style={styles.title}>Popular</Text>
        <PopularList type="popular" />
        {/* <MovieList /> */}
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    padding: 10,
    backgroundColor: "#f0f0f0",
    overflow: "visible",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  popularSection: {
    // flex: 1,
    // justifyContent: "space-around",
    // alignContent: "space-around",
    flexWrap: "wrap",
  },
});
