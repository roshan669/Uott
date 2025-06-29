import { Colors } from "@/constants/Colors";
import { useGlobalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const Details: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string>();

  const colorScheme = useColorScheme();
  const color = Colors[colorScheme ?? "dark"];
  const { id } = useGlobalSearchParams();
  const API_BEARER_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJhYWFkMGRiOTI0YzI0NmQyYjA0ZjUzNDVhZjg4MiIsIm5iZiI6MTcxNTUxOTIyNy4wMTIsInN1YiI6IjY2NDBiZWZiMThhZDFlNzU4ODIwN2VmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A3W5QcNqUZ_nv8xe67asxpCMNWXlDuUNDILWHEqx-OI";

  useEffect(() => {
    async function fetchDetail() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?language=en-US`,
          {
            headers: {
              Authorization: `Bearer ${API_BEARER_TOKEN}`,
              accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.status_message || `HTTP error! status: ${response.status}`
          );
        }
        const data = await response.json();
        setDetails(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
        setDetails(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!details) {
    return null;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors[colorScheme ?? "dark"].background,
      }}
    >
      <ScrollView style={{ flex: 1 }} bounces={false}>
        <View style={styles.headerContainer}>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w500${details.poster_path}`,
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay} />
            <View style={styles.headerContent}>
              <Text style={styles.title}>{details.title}</Text>
              {details.tagline ? (
                <Text style={styles.tagline}>{details.tagline}</Text>
              ) : null}
            </View>
          </ImageBackground>
        </View>
        <View
          style={[
            styles.card,
            { backgroundColor: Colors[colorScheme ?? "dark"].background },
          ]}
        >
          <Text style={[styles.overview, { color: color.text }]}>
            {details.overview}
          </Text>
          <Text style={[styles.label, { color: color.text }]}>
            Genres:{" "}
            <Text style={[styles.value, { color: color.text }]}>
              {details.genres?.map((g: any) => g.name).join(", ")}
            </Text>
          </Text>
          <Text style={[styles.label, { color: color.text }]}>
            Release Date:{" "}
            <Text style={[styles.value, { color: color.text }]}>
              {details.release_date}
            </Text>
          </Text>
          <Text style={[styles.label, { color: color.text }]}>
            Runtime:{" "}
            <Text style={[styles.value, { color: color.text }]}>
              {details.runtime} min
            </Text>
          </Text>
          <Text style={[styles.label, { color: color.text }]}>
            Rating:{" "}
            <Text style={[styles.value, { color: color.text }]}>
              {details.vote_average} ({details.vote_count} votes)
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    height: height * 0.5,
    position: "relative",
    marginBottom: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "flex-end",
    width: "100%",
    height: "100%",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    // Fade from transparent at top to black at bottom
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#e0e0e0",
    textAlign: "center",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  card: {
    // backgroundColor: "#181818",
    marginHorizontal: 16,
    marginTop: -30,
    borderRadius: 18,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  overview: {
    fontSize: 16,
    color: "#eee",
    textAlign: "center",
    marginBottom: 16,
  },
  label: {
    fontWeight: "bold",
    color: "#fff",
    marginTop: 10,
  },
  value: {
    fontWeight: "normal",
    color: "#eee",
  },
  link: {
    color: "#4faaff",
    textDecorationLine: "underline",
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
});

export default Details;
