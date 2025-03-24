import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Coins as Check } from 'lucide-react';

interface Game {
  _id: string;
  name: string;
  imageUrl: string;
  gameUrl: string;
  landingPageUrl: string;
}

// Update to use Vite's development server URL


export const GenerateLanding: React.FC = () => {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const [downloadLink, setDownloadLink] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [game, setGame] = useState<Game | null>(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/games/${gameId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game');
        }
        const data = await response.json();
        console.log('Game data in admin:', data);
        console.log('Image URL in admin:', data.imageUrl);
        setGame(data);
        // If game has a download link already, populate it
        if (data.gameUrl) {
          setDownloadLink(data.gameUrl);
        }
      } catch (err) {
        setError('Failed to load game. Please try again.');
      }
    };

    if (gameId) {
      fetchGame();
    } else {
      // If no gameId, try to get from localStorage (for new games)
      const currentGame = localStorage.getItem('currentGame');
      if (currentGame) {
        const parsedGame = JSON.parse(currentGame);
        setGame(parsedGame);
        if (parsedGame.gameUrl) {
          setDownloadLink(parsedGame.gameUrl);
        }
      }
    }
  }, [gameId]);

  const handleSubmit = async () => {
    if (!downloadLink.trim()) {
      setError('Please enter a valid game URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKENDURL}/api/games/${game?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameUrl: downloadLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to update game URL');
      }

      const updatedGame = await response.json();
      setGame(updatedGame);
      setIsSuccess(true);
    } catch (err) {
      setError('Failed to update game URL. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleCopy = async () => {
  //   if (!game) return;
    
  //   const landingPageUrl = `${FRONTEND_URL}/game/${game._id}`;
  //   try {
  //     await navigator.clipboard.writeText(landingPageUrl);
  //     setCopied(true);
  //     setTimeout(() => setCopied(false), 2000);
  //   } catch (err) {
  //     setError('Failed to copy link. Please try again.');
  //   }
  // };

  // const handlePreviewLanding = () => {
  //   if (!game?._id) {
  //     setError('Game information not available');
  //     return;
  //   }
  //   const previewUrl = `${FRONTEND_URL}/game/${game._id}`;
  //   console.log('Opening preview URL:', previewUrl); // Debug log
  //   window.open(previewUrl, '_blank');
  // };

  if (isSuccess) {
    return (
      <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from-purple-800 via-purple-900 to-pink-900">
        <div className="max-w-md mx-auto flex flex-col items-center gap-6 sm:gap-8 text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center mt-8 sm:mt-12">
            <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Successful</h2>
          <p className="text-gray-300 text-sm sm:text-base mb-12">Game download link updated successfully</p>
          <div>
          <button 
          onClick={() => navigate('/games')}
          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-purple-900"
        >
          See List
        </button>
          </div>
          {/* <button
            onClick={handleCopy}
            className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-purple-900"
          >
            {copied ? 'Copied!' : 'Copy the new landing page link'}
            <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
          </button> */}

          {/* <button
            onClick={handlePreviewLanding}
            className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-blue-500 hover:to-blue-600 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-purple-900"
          >
            Preview Landing Page
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button> */}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-gradient-to-b from-purple-800 via-purple-900 to-pink-900">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-12">
          <button
            onClick={() => navigate('/')}
            className="text-white flex items-center gap-2 hover:text-gray-200 p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            Generate Landing
          </h1>
          <div className="w-[60px] sm:w-[88px]"></div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Set Download Link</h2>
          <p className="text-gray-300 text-sm sm:text-base mb-12">Add the game download URL to complete setup</p>
        </div>

        {error && (
          <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>
        )}

        <input
          type="text"
          value={downloadLink}
          onChange={(e) => setDownloadLink(e.target.value)}
          placeholder="Paste game download link here..."
          className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base mb-6"
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-purple-900 mb-4"
        >
          {isLoading ? 'Updating...' : 'Update game download link'}
        </button>

        {/* {game && (
          <button
            onClick={handlePreviewLanding}
            className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-blue-500 hover:to-blue-600 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-purple-900"
          >
            Preview Landing Page
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )} */}
      </div>
    </div>
  );
};