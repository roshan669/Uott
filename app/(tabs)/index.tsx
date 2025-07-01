// app/index.tsx (if using Expo Router and _layout.tsx)

import MovieList from "@/components/movieList"; // Adjust path based on your structure
import PopularList from "@/components/popularList";
import { Colors } from "@/constants/Colors";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

import React, { useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
// import { ScrollView } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

export default React.memo(function HomePage() {
  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "dark"];
  const [loading, setLoading] = useState(true);

  // Simulate loading for shimmer demo (replace with real loading logic)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colorScheme === "dark" ? "#000" : "#fff",
      }}
    >
      {loading ? (
        <>
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 40,
              width: 180,
              borderRadius: 8,
              margin: 20,
            }}
          />
          <View style={{ flexDirection: "row" }}>
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 120,
                width: "30%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 10,
              }}
            />
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 120,
                width: "30%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 10,
              }}
            />
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 120,
                width: "30%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 10,
              }}
            />
          </View>
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 40,
              width: 180,
              borderRadius: 8,
              margin: 20,
            }}
          />
          <View style={{ flexDirection: "row", gap: 3 }}>
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 200,
                width: "45%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 5,
              }}
            />
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 200,
                width: "45%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 5,
              }}
            />
          </View>
          <View style={{ flexDirection: "row", gap: 3 }}>
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 200,
                width: "45%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 5,
              }}
            />
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 200,
                width: "45%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 5,
              }}
            />
          </View>
        </>
      ) : (
        <>
          <Text style={[styles.title, { color: color.text }]}>Trending </Text>
          <MovieList />
          <Text style={[styles.title, { color: color.text }]}>Now Playing</Text>
          <PopularList />
        </>
      )}
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    // flex: 1,

    padding: 10,
    // overflow: "visible",
    // paddingBottom: 80, // Add bottom padding to ensure content is not hidden behind the tab bar
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
    fontStyle: "italic",
    paddingHorizontal: 20,
    marginVertical: 10,
  },
});

export const options = {
  animation: "fade",
};
