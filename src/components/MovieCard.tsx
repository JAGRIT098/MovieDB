import React, { useState } from 'react';
import { Heart, Eye, Calendar, Film } from 'lucide-react';
import { Movie } from '../contexts/WatchlistContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import MovieModal from './MovieModal';

interface MovieCardProps {
  movie: Movie;
  showRemoveButton?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, showRemoveButton = false }) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isWatchlisted = isInWatchlist(movie.imdbID);

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWatchlisted || showRemoveButton) {
      removeFromWatchlist(movie.imdbID);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden group"
      >
        <div className="relative">
          <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {movie.Poster && movie.Poster !== 'N/A' && !imageError ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-4">
                <Film className="h-12 w-12 mb-2" />
                <span className="text-sm text-center">No Image Available</span>
              </div>
            )}
          </div>
          
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              onClick={handleWatchlistClick}
              className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                isWatchlisted || showRemoveButton
                  ? 'bg-red-500/90 text-white hover:bg-red-600/90'
                  : 'bg-white/90 text-gray-600 hover:bg-red-500/90 hover:text-white'
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isWatchlisted || showRemoveButton ? 'fill-current' : ''}`}
              />
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true);
              }}
              className="p-2 rounded-full bg-blue-500/90 text-white hover:bg-blue-600/90 backdrop-blur-sm transition-colors duration-200"
            >
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
            {movie.Title}
          </h3>
          
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{movie.Year}</span>
            </div>
            
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs font-medium capitalize">
              {movie.Type}
            </span>
          </div>
        </div>
      </div>

      {showModal && (
        <MovieModal
          imdbID={movie.imdbID}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default MovieCard;