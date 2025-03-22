import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 bg-gradient-to-b from-purple-800 via-purple-900 to-pink-900">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
        Admin Panel
      </h1>
      <p className="text-gray-300 text-sm sm:text-base mb-12">Manage your gaming platform</p>
      
      <div className="w-full max-w-md space-y-4">
        <button 
          onClick={() => navigate('/games')}
          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-purple-900"
        >
          See List
        </button>
        
        <button 
          onClick={() => navigate('/add-game')}
          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-purple-900"
        >
          Add Game
        </button>
        
        <button 
          onClick={handleLogout}
          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-purple-900"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};