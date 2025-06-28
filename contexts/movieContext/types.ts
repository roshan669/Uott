// Define the shape of a single movie object based on your API response
export interface Movie {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
}

// Define the shape of the data that the context will hold
export interface MovieContextState {
    movies: Movie[];
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalPages: number;
    totalResults: number;
    trending: Movie[];
}

// Define the shape of actions/functions consumers can use
export interface MovieContextActions {
    fetchPopularMovies: (page?: number) => Promise<void>;
    fetchTrending: (page?: number) => Promise<void>;
}

// Combine for the full context value
export type MovieContextType = MovieContextState & MovieContextActions;