// src/components/MovieList.tsx

import React from "react";
import {
  ActivityIndicator, // For loading spinner
  Button, // For efficient list rendering
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Movie, useMovieContext } from "@/contexts/movieContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window"); // Get screen width

const PopularList: React.FC = () => {
  const {
    movies,
    loadingMovies,
    error,
    currentPage,
    totalPages,
    fetchPopularMovies,
    hasMore,
  } = useMovieContext();

  const router = useRouter();

  if (loadingMovies && movies.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading movies...</Text>
      </View>
    );
  }

  if (error && movies.length === 0) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>
          Error: {error} please change you dns
        </Text>
        <Button title="Retry" onPress={() => fetchPopularMovies(currentPage)} />
      </View>
    );
  }

  const handlePress = (id: number) => {
    router.push({
      pathname: "/(player)/details",
      params: { id: id.toString() },
    });
  };
  const renderItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => handlePress(item.id)}
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

  const handleEndReached = () => {
    if (!loadingMovies && hasMore && currentPage < totalPages) {
      fetchPopularMovies(currentPage + 1);
    }
  };

  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      data={movies}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.5}
      ListFooterComponent={
        loadingMovies ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : null
      }
    />
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    paddingBottom: 20, // Optional: add some bottom padding
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },

  movieCard: {
    // flex: 1,
    // borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width / 2 - 20, // Roughly half screen width minus padding
    marginHorizontal: 5, // Small horizontal margin to contribute to `space-around`
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3, // For Android shadow
    marginVertical: 10,
  },
  posterImage: {
    width: "100%",
    height: 200, // Fixed height for posters
    // borderRadius: 10,
    // marginBottom: 30,
  },
  noPoster: {
    width: "100%",
    height: 250,
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

export default React.memo(PopularList);
