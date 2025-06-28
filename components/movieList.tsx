// src/components/MovieList.tsx

import React from "react";
import {
  ActivityIndicator, // For loading spinner
  Button, // For efficient list rendering
  Dimensions, // For pagination buttons
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMovieContext } from "@/contexts/movieContext";
import { Movie } from "@/contexts/movieContext/types";

const { width } = Dimensions.get("window"); // Get screen width
type Props = { type: string };

const MovieList: React.FC<Props> = (prop) => {
  const {
    movies,
    loading,
    error,
    currentPage,
    totalPages,
    trending,
    fetchPopularMovies,
  } = useMovieContext();

  //   const [data, setData] = useState<Movie[]>([]);

  const data = () => {
    if (prop.type === "popular") return movies;
    else if (prop.type === "trending") return trending;
  };

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <View style={styles.movieCard}>
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
    </View>
  );

  // ... rest of your MovieList component remains the same ...
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading movies...</Text>
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
        data={data()}
        horizontal={true}
        renderItem={renderMovieItem}
        keyExtractor={(item) => item.id.toString()}
        // numColumns={width > 600 ? 4 : 2} // Adjust columns based on screen width (for tablets vs phones)
        contentContainerStyle={styles.flatListContent}
        // columnWrapperStyle={styles.columnWrapper} // For spacing between columns
        showsVerticalScrollIndicator={false}
        // ListFooterComponent={
        //   // Pagination buttons as a footer
        //   <View style={styles.paginationContainer}>
        //     <Button
        //       title="Previous Page"
        //       onPress={() => fetchPopularMovies(currentPage - 1)}
        //       disabled={currentPage <= 1 || loading}
        //     />
        //     <Text style={styles.pageText}>
        //       {" "}
        //       Page {currentPage} of {totalPages}{" "}
        //     </Text>
        //     <Button
        //       title="Next Page"
        //       onPress={() => fetchPopularMovies(currentPage + 1)}
        //       disabled={currentPage >= totalPages || loading}
        //     />
        //   </View>
        // }
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  flatListContent: {
    paddingBottom: 20, // Space for pagination buttons
  },
  columnWrapper: {
    justifyContent: "space-around", // Distribute items evenly
    marginBottom: 15,
  },
  movieCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width / 2 - 20, // Roughly half screen width minus padding
    // marginHorizontal: 5, // Small horizontal margin to contribute to `space-around`
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3, // For Android shadow
  },
  posterImage: {
    width: "100%",
    height: 150, // Fixed height for posters
    borderRadius: 10,
    marginBottom: 10,
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

export default MovieList;
