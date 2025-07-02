// src/components/MovieList.tsx

import React from "react";
import {
  Button, // For efficient list rendering
  Dimensions, // For pagination buttons
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { useMovieContext } from "@/contexts/movieContext";
import { Series } from "@/contexts/movieContext/types";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

const { width } = Dimensions.get("window"); // Get screen width

const MovieList: React.FC = React.memo(function MovieList() {
  const router = useRouter();
  const { loadingSeries, error, currentPage, series, fetchPopularMovies } =
    useMovieContext();
  const colorScheme = useColorScheme();
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const handlePress = (id: number) => {
    router.push({
      pathname: "/(player)/tvDetails",
      params: { id: id.toString() },
    });
  };

  const renderMovieItem = ({ item }: { item: Series }) => (
    <TouchableOpacity
      onPress={() => handlePress(item.id)}
      style={styles.movieCard}
    >
      {item.poster_path ? (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
          style={styles.posterImage}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.noPoster}>
          <Text style={styles.noPosterText}>No Image</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loadingSeries) {
    return (
      <View style={{ flexDirection: "row" }}>
        <ShimmerPlaceholder
          shimmerColors={
            colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
          }
          style={{
            height: 150,
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
            height: 150,
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
            height: 150,
            width: "30%",
            borderRadius: 16,
            // alignSelf: "center",
            margin: 10,
          }}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Button title="Retry" onPress={() => fetchPopularMovies(currentPage)} />
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={series}
        horizontal={true}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.flatListContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  centeredContainer: {},
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  flatListContent: {
    // paddingBottom: 20, // Space for pagination buttons
  },
  columnWrapper: {
    // justifyContent: "space-around", // Distribute items evenly
    width: 20,
    // marginBottom: 15,
  },
  movieCard: {
    marginLeft: 10,
    width: width / 2.75 - 20, // Roughly half screen width minus padding
  },
  posterImage: {
    width: "100%",
    height: 150, // Fixed height for posters
    borderRadius: 10,
    marginBottom: 10,
  },
  noPoster: {
    width: "100%",
    height: 150,
    backgroundColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  noPosterText: {
    color: "#666",
    fontSize: 16,
    textAlign: "center",
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
    color: "#333",
  },
  movieInfo: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  pageText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "#666",
  },
});

export default MovieList;
