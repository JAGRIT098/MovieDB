import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Star, Award, Globe, Heart, Loader2 } from 'lucide-react';
import { getMovieDetails, MovieDetailsResponse } from '../services/omdbApi';
import { useWatchlist } from '../contexts/WatchlistContext';

interface MovieModalProps {
  imdbID: string;
  onClose: () => void;
}

const MovieModal: React.FC<MovieModalProps> = ({ imdbID, onClose }) => {
  const [movie, setMovie] = useState<MovieDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  const isWatchlisted = movie ? isInWatchlist(movie.imdbID) : false;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMovieDetails(imdbID);
        
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(data.Error || 'Failed to fetch movie details');
        }
      } catch (err) {
        setError('Failed to fetch movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [imdbID]);

  const handleWatchlistClick = () => {
    if (movie) {
      if (isWatchlisted) {
        removeFromWatchlist(movie.imdbID);
      } else {
        addToWatchlist(movie);
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="text-gray-900 dark:text-white">Loading movie details...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center" onClick={handleBackdropClick}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-red-600">Error</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={handleBackdropClick}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white truncate mr-4">
            {movie.Title}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleWatchlistClick}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                isWatchlisted
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              <Heart className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
              <span>{isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img
                  src={movie.Poster}
                  alt={movie.Title}
                  className="w-full rounded-lg shadow-lg"
                />
              ) : (
                <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">No Image Available</span>
                </div>
              )}
            </div>

            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.Released || movie.Year}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Clock className="h-4 w-4" />
                  <span>{movie.Runtime || 'N/A'}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Star className="h-4 w-4" />
                  <span>{movie.imdbRating || 'N/A'} IMDB</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <Globe className="h-4 w-4" />
                  <span>{movie.Country || 'N/A'}</span>
                </div>
              </div>

              {movie.Genre && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Genre</h3>
                  <div className="flex flex-wrap gap-2">
                    {movie.Genre.split(', ').map((genre, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 rounded-full text-sm font-medium"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.Plot && movie.Plot !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Plot</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{movie.Plot}</p>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {movie.Director && movie.Director !== 'N/A' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Director</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Director}</p>
                  </div>
                )}
                {movie.Writer && movie.Writer !== 'N/A' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Writer</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Writer}</p>
                  </div>
                )}
              </div>

              {movie.Actors && movie.Actors !== 'N/A' && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cast</h3>
                  <p className="text-gray-600 dark:text-gray-400">{movie.Actors}</p>
                </div>
              )}

              {movie.Awards && movie.Awards !== 'N/A' && (
                <div className="flex items-start space-x-2">
                  <Award className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Awards</h3>
                    <p className="text-gray-600 dark:text-gray-400">{movie.Awards}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieModal;