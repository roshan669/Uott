import React, { useEffect, useState } from "react";
import {
  Button, // For efficient list rendering
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";

import { Movie, useMovieContext } from "@/contexts/movieContext";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";

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

  const colorScheme = useColorScheme();
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const router = useRouter();

  const [showShimmer, setShowShimmer] = useState(false);

  useEffect(() => {
    if (loadingMovies && movies.length === 0) {
      setShowShimmer(true);
    } else if (!loadingMovies) {
      // Add a short delay for smooth transition
      const timer = setTimeout(() => setShowShimmer(false), 250);
      return () => clearTimeout(timer);
    }
  }, [loadingMovies, movies.length]);

  if (showShimmer) {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            gap: 3,
            marginBottom: 30,
            marginLeft: 10,
          }}
        >
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 230,
              width: "45%",
              borderRadius: 16,
              margin: 5,
            }}
            visible={false}
            duration={600}
            shimmerStyle={{
              opacity: showShimmer ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 230,
              width: "45%",
              borderRadius: 16,
              margin: 5,
            }}
            visible={false}
            duration={600}
            shimmerStyle={{
              opacity: showShimmer ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        </View>
        <View style={{ flexDirection: "row", gap: 3, marginLeft: 10 }}>
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 230,
              width: "45%",
              borderRadius: 16,
              margin: 5,
            }}
            visible={false}
            duration={600}
            shimmerStyle={{
              opacity: showShimmer ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 230,
              width: "45%",
              borderRadius: 16,
              margin: 5,
            }}
            visible={false}
            duration={600}
            shimmerStyle={{
              opacity: showShimmer ? 1 : 0,
              transition: "opacity 0.3s",
            }}
          />
        </View>
      </>
    );
  }

  if (loadingMovies && movies.length === 0) {
    return (
      <>
        <View style={{ flexDirection: "row", gap: 3, marginBottom: 30 }}>
          <ShimmerPlaceholder
            shimmerColors={
              colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
            }
            style={{
              height: 230,
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
              height: 230,
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
              height: 230,
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
              height: 230,
              width: "45%",
              borderRadius: 16,
              // alignSelf: "center",
              margin: 5,
            }}
          />
        </View>
      </>
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
      params: { id: id.toString(), type: "movie" },
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
          <View style={{ flexDirection: "row", gap: 3 }}>
            <ShimmerPlaceholder
              shimmerColors={
                colorScheme === "dark" ? ["#222", "#111", "#222"] : undefined
              }
              style={{
                height: 230,
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
                height: 230,
                width: "45%",
                borderRadius: 16,
                // alignSelf: "center",
                margin: 5,
              }}
            />
          </View>
        ) : null
      }
      ItemSeparatorComponent={() => <View style={{ height: 16 }} />} // 16px vertical space between rows
    />
  );
};

const styles = StyleSheet.create({
  container: {
    // alignItems: "center",
  },
  centeredContainer: {
    // flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },

  movieCard: {
    width: width / 2 - 5, // Roughly half screen width minus padding
    marginHorizontal: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  posterImage: {
    width: "100%",
    height: 250, // Fixed height for posters
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 10, height: 10 },
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
  pageText: {
    fontSize: 16,
    marginHorizontal: 10,
    color: "#666",
  },
});

export default React.memo(PopularList);
