import React from 'react';
import { Heart, Trash2, Film } from 'lucide-react';
import { useWatchlist } from '../contexts/WatchlistContext';
import MovieCard from './MovieCard';

const Watchlist: React.FC = () => {
  const { watchlist, clearWatchlist } = useWatchlist();

  const handleClearWatchlist = () => {
    if (window.confirm('Are you sure you want to clear your entire watchlist?')) {
      clearWatchlist();
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            My Watchlist
          </h1>
        </div>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {watchlist.length === 0
            ? 'Your watchlist is empty. Add some movies to get started!'
            : `You have ${watchlist.length} ${watchlist.length === 1 ? 'movie' : 'movies'} in your watchlist`
          }
        </p>
      </div>

      {watchlist.length > 0 ? (
        <>
          <div className="flex justify-center mb-8">
            <button
              onClick={handleClearWatchlist}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <Trash2 className="h-5 w-5" />
              <span>Clear Watchlist</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.imdbID} movie={movie} showRemoveButton />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-full p-8 mb-6 inline-block">
              <Film className="h-16 w-16 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
              No movies in your watchlist yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start building your watchlist by searching for movies and adding your favorites.
            </p>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <p>• Search for movies and TV shows</p>
              <p>• Click the heart icon to add to your watchlist</p>
              <p>• Keep track of what you want to watch</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;