import React, { useState } from 'react';
import Header from './Header';
import SearchMovies from './SearchMovies';
import Watchlist from './Watchlist';

const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<'search' | 'watchlist'>('search');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main>
        {currentView === 'search' ? <SearchMovies /> : <Watchlist />}
      </main>
    </div>
  );
};

export default Dashboard;