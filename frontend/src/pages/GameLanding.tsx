import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Download } from 'lucide-react';

interface Game {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  gameUrl: string;
  landingPageUrl: string;
  signUpBonus: number;
  minWithdraw: number;
}

const BACKEND_URL = 'http://127.0.0.1:5000';

const GameLanding: React.FC = () => {
  const { landingPageUrl, gameId } = useParams<{ landingPageUrl?: string; gameId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isDownloadPage = location.pathname.startsWith('/download/');

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const id = gameId || landingPageUrl;
        console.log('Fetching game with ID:', id);
        
        // Fetch the specific game directly
        const response = await fetch(`${BACKEND_URL}/api/games/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch game');
        }
        
        const game = await response.json();
        console.log('Game data received:', game);
        console.log('Image URL:', game.imageUrl);
        setGame(game);

        // If this is the download page, automatically trigger the download
        if (isDownloadPage && game.gameUrl) {
          window.location.href = game.gameUrl;
          // Navigate back to the landing page after initiating download
          setTimeout(() => {
            navigate(`/game/${game._id}`);
          }, 1000);
        }
      } catch (err) {
        console.error('Error fetching game:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (landingPageUrl || gameId) {
      fetchGame();
    } else {
      setError('No game ID provided');
      setLoading(false);
    }
  }, [landingPageUrl, gameId, isDownloadPage, navigate]);

  const handleDownload = (gameUrl: string) => {
    if (gameUrl) {
      console.log('Redirecting to download URL:', gameUrl); // Debugging log
      window.location.href = gameUrl; // Redirect to the download link
    } else {
      alert('Download link not available yet');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#1E0B4B] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-[#1E0B4B] flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Game not found'}</div>
      </div>
    );
  }

  // If this is the download page, show a loading message
  if (isDownloadPage) {
    return (
      <div className="min-h-screen bg-[#1E0B4B] flex items-center justify-center">
        <div className="text-white text-xl">Starting download...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1E0B4B] relative overflow-hidden">
      {/* Navigation */}
      {/* <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white text-2xl font-bold">Logo</div>
          <div className="flex items-center space-x-8">
            <a href="/" className="text-white hover:text-gray-300">Home</a>
            <a href="/about" className="text-white hover:text-gray-300">About</a>
            <a href="/t&c" className="text-white hover:text-gray-300">T&C</a>
            <a href="/contact" className="text-white hover:text-gray-300">Contact</a>
            <button className="bg-red-500 px-6 py-1.5 rounded-full text-white text-sm">
              ⚡ NOW
            </button>
          </div>
        </div>
      </nav> */}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pt-32 pb-12">
        <div className="flex flex-col lg:flex-row items-start justify-between">
          {/* Left Section */}
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-7xl font-bold text-white leading-tight mb-16">
              Get Y<span className="opacity-50">o</span>ur<br />
              Game <span className="opacity-50">o</span>n
            </h1>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#1a103c]/50 backdrop-blur-lg rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-pink-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="ml-3 text-white font-medium">100% Money Back</span>
                </div>
              </div>
              <div className="bg-[#1a103c]/50 backdrop-blur-lg rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-orange-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M13 2L3 14h9l-1 8L21 10h-9l1-8z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="ml-3 text-white font-medium">Unlimited Gaming</span>
                </div>
              </div>
              <div className="bg-[#1a103c]/50 backdrop-blur-lg rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-yellow-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V18h14v-1.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05.02.01.03.03.04.04 1.14.83 1.93 1.94 1.93 3.41V18h6v-1.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="ml-3 text-white font-medium">+20,000 Downloads</span>
                </div>
              </div>
              <div className="bg-[#1a103c]/50 backdrop-blur-lg rounded-xl p-4">
                <div className="flex items-center">
                  <div className="bg-blue-500 p-2 rounded-lg">
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z" fill="currentColor"/>
                    </svg>
                  </div>
                  <span className="ml-3 text-white font-medium">Many Surprises!</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Game Card */}
          <div className="lg:w-1/2 flex justify-center lg:justify-end">
            <div className="bg-purple-600/90 backdrop-blur-sm rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center mb-4">
                <img 
                  src={`${BACKEND_URL}${game.imageUrl}`} // Prepend BACKEND_URL to the imageUrl
                  alt={game.name}
                  className="w-16 h-16 object-contain rounded-lg"
                  onError={(e) => {
                    console.error('Error loading image:', game.imageUrl);
                    e.currentTarget.src = `${BACKEND_URL}/uploads/default-placeholder.png`; // Use a local fallback image
                  }}
                />
                <div className="ml-4">
                  <h2 className="text-white text-2xl font-bold">{game.name}</h2>
                  <div className="flex items-center mt-1">
                    <span className="text-yellow-400">★ 4.7</span>
                    <span className="mx-2 text-white">|</span>
                    <span className="text-white">22-100 MB</span>
                    <span className="mx-2 text-white">|</span>
                    <span className="text-green-400">Free</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload(game.gameUrl)}
                className="w-full py-3 bg-yellow-400 hover:bg-yellow-300 rounded-xl text-black text-lg font-semibold transition-colors duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download {game.name}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameLanding;