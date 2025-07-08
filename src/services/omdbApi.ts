import { Movie } from '../contexts/WatchlistContext';

const API_KEY = '8dc9cc8';
const BASE_URL = 'https://www.omdbapi.com/';

export interface SearchResponse {
  Search: Movie[];
  totalResults: string;
  Response: string;
  Error?: string;
}

export interface MovieDetailsResponse extends Movie {
  Response: string;
  Error?: string;
}

export const searchMovies = async (query: string, page: number = 1): Promise<SearchResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=${page}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (imdbID: string): Promise<MovieDetailsResponse> => {
  try {
    const response = await fetch(
      `${BASE_URL}?apikey=${API_KEY}&i=${imdbID}&plot=full`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};