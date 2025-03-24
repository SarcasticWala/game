import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ArrowLeft, Download, Star, Trash2, X, Check } from 'lucide-react';
import axios from 'axios';
interface Game {
  _id: string;
  name: string;
  imageUrl: string;
  gameUrl: string;
  landingPageUrl: string;
  signUpBonus: number;
  minWithdraw: number;
}

export const GameList: React.FC = () => {
  const navigate = useNavigate();
  const [games, setGames] = useState<Game[]>([]);
  console.log(games);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [editingGame, setEditingGame] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
      // Set the first game as selected by default
      if (data.length > 0) {
        setSelectedGame(data[0]);
      }
    } catch (err) {
      setError('Failed to load games. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (game: Game) => {
    try {
      if (!game.gameUrl) {
        alert('No download link available for this game yet.');
        return;
      }
      window.open(game.gameUrl, '_blank');
    } catch (err) {
      setError('Failed to download game. Please try again.');
    }
  };

  const handleDelete = async (gameId: string) => {
    if (!window.confirm('Are you sure you want to delete this game?')) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/games/${gameId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete game');
      }

      setGames(games.filter(game => game._id !== gameId));
      if (selectedGame?._id === gameId) {
        setSelectedGame(games[0] || null);
      }
    } catch (err) {
      setError('Failed to delete game. Please try again.');
    }
  };

  const startEditing = (game: Game) => {
    setEditingGame(game._id);
    setEditName(game.name);
  };

  const cancelEditing = () => {
    setEditingGame(null);
    setEditName('');
  };

  const saveGameName = async (gameId: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/${gameId}/name`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: editName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update game name');
      }

      const updatedGame = await response.json();
      setGames(games.map(game => 
        game._id === gameId ? updatedGame : game
      ));
      if (selectedGame?._id === gameId) {
        setSelectedGame(updatedGame);
      }
      setEditingGame(null);
    } catch (err) {
      setError('Failed to update game name. Please try again.');
    }
  };

  if (isLoading) {
  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-between mb-12">
          <div className="flex items-center gap-4 w-full">
        <button
          onClick={() => navigate('/')}
          className="text-white flex items-center gap-2 hover:text-gray-200"
        >
          <ArrowLeft size={24} />
          Back
        </button>
            <div className="flex-1 text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
                Game Collection
              </h1>
              <p className="text-gray-400 mt-2">Manage your game library</p>
            </div>
            <div className="w-[88px]"></div> {/* Spacer for alignment */}
          </div>
        </div>
        <div className="text-white text-center">Loading games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from-purple-800 via-purple-900 to-pink-900">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-white flex items-center gap-2 hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Game Collection
          </h1>
          <div className="w-[60px] sm:w-[88px]"></div>
        </div>

        {error && (
          <div className="text-red-500 text-center mb-4 text-sm sm:text-base">{error}</div>
        )}

        {/* Featured Game Section */}
        {selectedGame && (
          <div className="mb-6 sm:mb-8 bg-white/5 rounded-xl p-4 sm:p-6 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="w-full md:w-1/3">
                <img 
                  src={selectedGame.imageUrl}
                  alt={selectedGame.name} 
                  className="w-full h-40 sm:h-48 rounded-lg object-contain"
                />
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4">{selectedGame.name}</h2>
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                      <span className="text-white text-sm sm:text-base">4.7</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span className="text-gray-300 text-sm sm:text-base">22-100 MB</span>
                    <span className="text-gray-300">|</span>
                    <span className="text-green-400 text-sm sm:text-base">Free</span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownload(selectedGame)}
                  className="w-full py-2 sm:py-3 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-lg text-sm sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                  Download {selectedGame.name}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Game List */}
        <div className="space-y-3 sm:space-y-4">
          {games.map((game) => (
            <div 
              key={game._id} 
              className={`bg-white/5 backdrop-blur-sm rounded-xl p-3 sm:p-4 flex items-center justify-between ${
                selectedGame?._id === game._id ? 'ring-2 ring-yellow-400' : 'hover:bg-white/10'
              }`}
              onClick={() => setSelectedGame(game)}
            >
              <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <img 
                  src={game.imageUrl}
                  alt={game.name} 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                />
                {editingGame === game._id ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-white/10 text-white px-2 py-1 rounded flex-1 min-w-0 text-sm sm:text-base"
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                ) : (
                  <span className="text-white font-medium text-sm sm:text-base truncate">{game.name}</span>
                )}
            </div>
            
              <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                {editingGame === game._id ? (
                  <>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        saveGameName(game._id);
                      }}
                      className="p-2 sm:px-3 sm:py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm hover:from-green-600 hover:to-green-700"
                      title="Save name"
                    >
                      <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEditing();
                      }}
                      className="p-2 sm:px-3 sm:py-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full text-sm hover:from-gray-600 hover:to-gray-700"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </>
                ) : (
                  <>
              <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditing(game);
                      }}
                      className="p-2 sm:px-3 sm:py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm hover:from-blue-600 hover:to-blue-700"
                      title="Edit name"
                    >
                      <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              {/* <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/generate-landing/${game._id}`);
                      }}
                      className="p-2 sm:px-3 sm:py-1 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-sm hover:from-green-600 hover:to-green-700"
                      title="Set download link"
                    >
                      <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button> */}
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(game._id);
                      }}
                      className="p-2 sm:px-3 sm:py-1 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full text-sm hover:from-red-600 hover:to-red-700"
                      title="Delete game"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
          </div>
      </div>
    </div>
  );
};