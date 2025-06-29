// src/components/MovieList.tsx

import { Colors } from "@/constants/Colors";
import { Movie } from "@/contexts/movieContext";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator, // For loading spinner
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window"); // Get screen width

const Search: React.FC = () => {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const latestCallIdRef = useRef<number>(0);
  const currentAbortControllerRef = useRef<AbortController | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | number | null>(null);

  // Use useCallback to memoize the handleSearch function itself
  const handleSearch = useCallback(async (query: string) => {
    // Increment the ID for this specific call initiation.
    // Use .current on the ref.
    const thisCallId = ++latestCallIdRef.current;

    setSearchQuery(query); // Update the input query display immediately

    // Clear any existing debounce timer immediately
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null; // Clear the ref after clearing
    }

    // Abort any previous in-flight fetch request immediately
    if (currentAbortControllerRef.current) {
      currentAbortControllerRef.current.abort();
      console.log(`Aborting fetch for previous call ID: ${thisCallId - 1}`);
      currentAbortControllerRef.current = null; // Clear the ref after aborting
    }

    if (!query) {
      setSearchResults([]);
      setSearchError(null);
      setSearchLoading(false);
      // If query is cleared, reset the latest ID so a new search is truly 'first'.
      latestCallIdRef.current = 0;
      return;
    }

    setSearchLoading(true); // Indicate loading as soon as a query is present
    setSearchError(null);

    // Set a new debounce timeout for this specific call
    searchTimeoutRef.current = setTimeout(async () => {
      // --- CRITICAL CHECK 1: Is this still the latest intended call after debounce? ---
      // Compare this call's ID with the globally latest initiated ID
      if (thisCallId !== latestCallIdRef.current) {
        console.log(
          `Debounced call (ID: ${thisCallId}) is outdated, new call (ID: ${latestCallIdRef.current}) initiated. Aborting execution.`
        );
        setSearchLoading(false); // Make sure loading is turned off for abandoned calls
        return; // Exit here if a newer call has already started
      }

      // Create a new AbortController for this fetch operation
      const controller = new AbortController();
      currentAbortControllerRef.current = controller; // Store it in the ref
      const signal = controller.signal;

      try {
        console.log(
          `Executing API fetch for call ID: ${thisCallId}, query: "${query}"`
        );

        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(
            query
          )}&language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${
                process.env.EXPO_PUBLIC_TMDB_BEARER_TOKEN ||
                "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJhYWFkMGRiOTI0YzI0NmQyYjA0ZjUzNDVhZjg4MiIsIm5iZiI6MTcxNTUxOTIyNy4wMTIsInN1YiI6IjY2NDBiZWZiMThhZDFlNzU4ODIwN2VmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A3W5QcNqUZ_nv8xe67asxpCMNWXlDuUNDILWHEqx-OI"
              }`,
              accept: "application/json",
            },
            signal: signal, // Link fetch to AbortController
          }
        );

        // --- CRITICAL CHECK 2: After fetch, is this still the latest intended call? ---
        // This handles cases where a new call starts *during* the fetch operation.
        if (thisCallId !== latestCallIdRef.current) {
          console.log(
            `Response received for outdated call (ID: ${thisCallId}), new call (ID: ${latestCallIdRef.current}) exists. Ignoring data.`
          );
          return; // Exit if newer call exists
        }

        // Check if the fetch was explicitly aborted (e.g., by a newer call)
        if (signal.aborted) {
          console.log(
            `Fetch for call ID ${thisCallId} was aborted by a new request. Ignoring response.`
          );
          return; // Exit if aborted
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.status_message || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();

        // --- CRITICAL CHECK 3: Final check before updating state ---
        if (thisCallId === latestCallIdRef.current) {
          console.log(
            `Updating state for the latest call (ID: ${thisCallId}).`
          );
          setSearchResults(data.results || []);
        } else {
          console.log(
            `Not updating state for call ID ${thisCallId}, a newer call is active.`
          );
        }
      } catch (err) {
        // Check if the error is due to abortion (an expected "cancellation")
        if (err instanceof DOMException && err.name === "AbortError") {
          console.log(`Call ID ${thisCallId} was aborted.`);
        }
        // Only set error state if it's not an abort and it's for the currently latest call
        else if (thisCallId === latestCallIdRef.current) {
          console.error(`Error for call ID ${thisCallId}:`, err);
          setSearchError(err instanceof Error ? err.message : "Unknown error");
          setSearchResults([]); // Clear results on error for the latest call
        } else {
          console.log(
            `Error occurred for an outdated call (ID: ${thisCallId}), ignoring.`
          );
        }
      } finally {
        // --- CRITICAL CHECK 4: Ensure loading state is only managed by the latest call ---
        if (thisCallId === latestCallIdRef.current) {
          setSearchLoading(false);
        }
        currentAbortControllerRef.current = null; // Always clear the controller ref when done
      }
    }, 500); // Debounce time: 300 milliseconds
  }, []); // Empty dependency array means this function is created once

  // Optional: Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (currentAbortControllerRef.current) {
        currentAbortControllerRef.current.abort();
      }
    };
  }, []);

  const renderItem = ({ item }: { item: Movie }) => (
    <View
      style={[
        styles.movieCard,
        { backgroundColor: Colors[colorScheme ?? "dark"].background },
      ]}
    >
      {item.poster_path ? (
        <>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w200${item.poster_path}`,
            }}
            style={styles.posterImage}
            resizeMode="contain"
          />

          <Text
            style={[
              styles.movieTitle,
              { color: Colors[colorScheme ?? "dark"].text },
            ]}
          >
            {item.name}
            {item.title}
          </Text>
          <Text
            style={[
              styles.movieTitle,
              { color: Colors[colorScheme ?? "dark"].text },
            ]}
          >
            <MaterialIcons name="star" /> {item.vote_average}
          </Text>
        </>
      ) : // <View style={styles.noPoster}>
      //   <Text style={styles.noPosterText}>No Image</Text>
      // </View>
      null}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <MaterialIcons
          name="search"
          color={Colors[colorScheme ?? "dark"].icon}
          size={25}
          style={{
            width: "10%",
          }}
        />
        <TextInput
          placeholder="Search..."
          placeholderTextColor={Colors[colorScheme ?? "dark"].icon}
          autoFocus={true}
          style={{
            width: "90%",
            height: 40,
            borderRadius: 15,
            borderWidth: 0.2,
            backgroundColor: Colors[colorScheme ?? "dark"].background,
            color: Colors[colorScheme ?? "dark"].text,
            // marginVertical: 1,
            borderColor: Colors[colorScheme ?? "dark"].icon,
            paddingHorizontal: 5,
          }}
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      {searchLoading ? (
        <View
          style={{
            backgroundColor: Colors[colorScheme ?? "dark"].background,
            flex: 1,
          }}
        >
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : searchError ? (
        <Text style={{ color: "red", margin: 10 }}>{searchError}</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={searchQuery ? searchResults : []}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          contentContainerStyle={[
            styles.container,
            { backgroundColor: Colors[colorScheme ?? "dark"].background },
          ]}
          ListEmptyComponent={
            searchQuery && !searchLoading && searchResults.length === 0 ? (
              <Text style={{ color: "#888", margin: 20 }}>
                No results found.
              </Text>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: "center",

    paddingBottom: 20, // Optional: add some bottom padding
    // alignContent: "center",
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
    // paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    width: width / 2, // Roughly half screen width minus padding
    marginHorizontal: 4, // Small horizontal margin to contribute to `space-around`
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.1,
    // shadowRadius: 4,
    // elevation: 3, // For Android shadow
    // marginVertical: 10,
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

export default React.memo(Search);
