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
    name?: string;
}

export interface Series {
    adult: boolean;
    backdrop_path: string;
    genre_ids: number[];
    id: number;
    origin_country: string[],
    original_language: string;
    original_name: string,
    overview: string;
    popularity: number;
    poster_path: string;
    first_air_date: string,
    name: string,
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
    series: Series[];
}

// Define the shape of actions/functions consumers can use
export interface MovieContextActions {
    fetchPopularMovies: (page?: number) => Promise<void>;
    fetchPopularSeries: (page?: number) => Promise<void>;
}

// Combine for the full context value
export type MovieContextType = MovieContextState & MovieContextActions & { hasMore: boolean, loadingMovies: boolean, loadingSeries: boolean };