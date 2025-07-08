import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { movieDB } from '../services/database';
import { useAuth } from './AuthContext';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
  Plot?: string;
  Director?: string;
  Actors?: string;
  Runtime?: string;
  Genre?: string;
  imdbRating?: string;
  Released?: string;
  Writer?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
}

interface WatchlistContextType {
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => Promise<void>;
  removeFromWatchlist: (imdbID: string) => Promise<void>;
  clearWatchlist: () => Promise<void>;
  isInWatchlist: (imdbID: string) => boolean;
  isLoading: boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};

interface WatchlistProviderProps {
  children: ReactNode;
}

export const WatchlistProvider: React.FC<WatchlistProviderProps> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const loadWatchlist = async () => {
      if (isAuthenticated && user) {
        setIsLoading(true);
        try {
          const userWatchlist = await movieDB.getWatchlist(user.id);
          setWatchlist(userWatchlist);
        } catch (error) {
          console.error('Failed to load watchlist:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setWatchlist([]);
      }
    };

    loadWatchlist();
  }, [isAuthenticated, user]);

  const saveWatchlist = async (newWatchlist: Movie[]) => {
    if (user) {
      try {
        await movieDB.saveWatchlist(user.id, newWatchlist);
        setWatchlist(newWatchlist);
      } catch (error) {
        console.error('Failed to save watchlist:', error);
        throw error;
      }
    }
  };

  const addToWatchlist = async (movie: Movie) => {
    const exists = watchlist.find(item => item.imdbID === movie.imdbID);
    if (!exists) {
      const newWatchlist = [...watchlist, movie];
      await saveWatchlist(newWatchlist);
    }
  };

  const removeFromWatchlist = async (imdbID: string) => {
    const newWatchlist = watchlist.filter(movie => movie.imdbID !== imdbID);
    await saveWatchlist(newWatchlist);
  };

  const clearWatchlist = async () => {
    await saveWatchlist([]);
  };

  const isInWatchlist = (imdbID: string): boolean => {
    return watchlist.some(movie => movie.imdbID === imdbID);
  };

  const value = {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    clearWatchlist,
    isInWatchlist,
    isLoading
  };

  return <WatchlistContext.Provider value={value}>{children}</WatchlistContext.Provider>;
};