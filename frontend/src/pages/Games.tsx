import React, { useEffect, useState } from 'react';
import { Gift, DollarSign } from 'lucide-react';

interface Game {
  _id: string;
  name: string;
  imageUrl: string;
  landingPageUrl: string;
  signUpBonus: number;
  minWithdraw: number;
}

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'; // Use environment variable

const Games: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/games`);
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();

      // Filter out games with missing or invalid data
      const validGames = data.filter((game: Game) => game.name && game.landingPageUrl && game.imageUrl);
      setGames(validGames);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();

    // Refresh games list every 30 seconds
    const intervalId = setInterval(fetchGames, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleGameClick = (landingPageUrl: string) => {
    if (landingPageUrl) {
      const url = landingPageUrl.startsWith('/game/')
        ? `${window.location.origin}${landingPageUrl}`
        : landingPageUrl;

      console.log('Navigating to URL:', url); // Debugging log
      window.location.href = url; // Navigate to the landing page
    } else {
      alert('Landing page not available yet');
    }
  };

  if (loading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen" 
        style={{ 
          background: 'linear-gradient(359.71deg, #050B27 4.71%, #000000 98.07%)', 
          width: '100%'
        }}
      >
        <div className="text-white text-xl">Loading games...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen" 
        style={{ 
          background: 'linear-gradient(359.71deg, #050B27 4.71%, #000000 98.07%)', 
          width: '100%'
        }}
      >
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen" 
        style={{ 
          background: 'linear-gradient(359.71deg, #050B27 4.71%, #000000 98.07%)', 
          width: '100%'
        }}
      >
        <div className="text-white text-xl">No games available</div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col items-center justify-between pt-12 sm:pt-20 px-4 sm:px-6 md:px-8" 
      style={{ 
        background: 'linear-gradient(359.71deg, #050B27 4.71%, #000000 98.07%)', 
        width: '100%', 
        minHeight: '100vh', 
        position: 'relative'
      }}
    >
      <div className="w-full flex flex-col gap-4 sm:gap-6">
        {games.map((game) => (
          <div 
            key={game._id} 
            className="flex flex-col sm:flex-row items-center p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] w-full cursor-pointer" 
            style={{ 
              background: 'linear-gradient(180deg, #000C34 0%, #000000 100%)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
            }}
            onClick={() => handleGameClick(game.landingPageUrl)}
          >
            {/* Game Image */}
            <img 
              src={game.imageUrl.startsWith('http') ? game.imageUrl : `${BACKEND_URL}${game.imageUrl}`} // Handle both absolute and relative URLs
              alt={game.name} 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mr-0 sm:mr-6 mb-4 sm:mb-0"
              onError={(e) => {
                console.error('Error loading image:', game.imageUrl); // Debugging log
                e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image'; // Fallback image
              }}
            />

            {/* Game Info */}
            <div className="flex-1 flex flex-col items-center sm:items-start justify-center min-w-0">
              <h3
                className="text-[#e83535] text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-center sm:text-left truncate"
              >
                {game.name}
              </h3>
              
              {/* Bonus and Withdrawal Info */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="flex items-center">
                  <Gift className="w-4 h-4 text-[#AEFF00] mr-2" />
                  <p className="text-[#AEFF00] text-xs font-bold tracking-wider whitespace-nowrap">
                    Sign Up Bonus ₹{game.signUpBonus}
                  </p>
                </div>

                <div className="flex items-center">
                  <DollarSign className="w-4 h-4 text-[#AEFF00] mr-2" />
                  <p className="text-[#AEFF00] text-xs font-bold tracking-wider whitespace-nowrap">
                    Min. Withdraw {game.minWithdraw}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;

