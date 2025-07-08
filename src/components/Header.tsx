import React from 'react';
import { Sun, Moon, LogOut, Film, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useWatchlist } from '../contexts/WatchlistContext';

interface HeaderProps {
  currentView: 'search' | 'watchlist';
  onViewChange: (view: 'search' | 'watchlist') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { watchlist } = useWatchlist();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-lg border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Film className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                MovieDB
              </h1>
            </div>
          </div>

          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('search')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                currentView === 'search'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              Search Movies
            </button>
            
            <button
              onClick={() => onViewChange('watchlist')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                currentView === 'watchlist'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <Heart className="h-4 w-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-yellow-500" />
              ) : (
                <Moon className="h-5 w-5 text-gray-600" />
              )}
            </button>

            <div className="flex items-center space-x-3">
              <div className="text-sm">
                <p className="text-gray-900 dark:text-white font-medium">
                  {user?.username}
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-xs">
                  {user?.email}
                </p>
              </div>
              
              <button
                onClick={logout}
                className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 transition-colors duration-200"
                aria-label="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;