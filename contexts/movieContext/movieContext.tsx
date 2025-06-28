import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Movie, MovieContextType } from "./types";

// TMDb API Configuration
const API_URL = "https://api.themoviedb.org/3/";

const API_BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkOGJhYWFkMGRiOTI0YzI0NmQyYjA0ZjUzNDVhZjg4MiIsIm5iZiI6MTcxNTUxOTIyNy4wMTIsInN1YiI6IjY2NDBiZWZiMThhZDFlNzU4ODIwN2VmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.A3W5QcNqUZ_nv8xe67asxpCMNWXlDuUNDILWHEqx-OI";

// Default context value for initial creation and for cases where it's used outside a Provider.
// Ensure all properties from MovieContextType are present.
const MovieContext = createContext<MovieContextType | undefined>(undefined);

interface MovieContextProviderProps {
  children: React.ReactNode;
}

export const MovieContextProvider: React.FC<MovieContextProviderProps> = ({
  children,
}) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [trending, setTrending] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const fetchPopularMovies = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${API_URL}movie/popular?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_BEARER_TOKEN}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found)
        const errorData = await response.json();
        throw new Error(
          errorData.status_message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setMovies(data.results);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setMovies([]); // Clear movies on error
    } finally {
      setLoading(false);
    }
  }, []); // No dependencies, as API_URL and TOKEN are constants

  const fetchTrending = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const response = await fetch(
        `${API_URL}trending/all/day?language=en-US&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${API_BEARER_TOKEN}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle HTTP errors (e.g., 401 Unauthorized, 404 Not Found)
        const errorData = await response.json();
        throw new Error(
          errorData.status_message || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setTrending(data.results);
      setCurrentPage(data.page);
      setTotalPages(data.total_pages);
      setTotalResults(data.total_results);
    } catch (err) {
      console.error("Failed to fetch movies:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
      setMovies([]); // Clear movies on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch movies on initial component mount
  useEffect(() => {
    fetchPopularMovies(1);
    fetchPopularMovies(1);
  }, [fetchPopularMovies]); // Dependency array includes fetchPopularMovies

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const contextValue = useMemo<MovieContextType>(
    () => ({
      movies,
      loading,
      error,
      currentPage,
      totalPages,
      totalResults,
      fetchPopularMovies,
      fetchTrending,
      trending,
    }),
    [
      movies,
      loading,
      error,
      currentPage,
      totalPages,
      totalResults,
      fetchPopularMovies,
      fetchTrending,
      trending,
    ]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

// Custom hook for consuming the context
export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error(
      "useMovieContext must be used within a MovieContextProvider"
    );
  }
  return context;
};
