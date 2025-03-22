import React, { useEffect, useState } from 'react';
import { Gift, DollarSign } from 'lucide-react';

interface Game {
  _id: string;
  name: string;
  imageUrl: string;
  gameUrl: string;
  landingPageUrl: string;
  signUpBonus: number;
  minWithdraw: number;
}

const BACKEND_URL = 'http://localhost:5000';

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
      console.log('Fetched games:', data);
      setGames(data);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Fetch games when component mounts and set up periodic refresh
  useEffect(() => {
    fetchGames();

    // Refresh games list every 30 seconds
    const intervalId = setInterval(fetchGames, 30000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDownload = (gameUrl: string) => {
    if (gameUrl) {
      window.open(gameUrl, '_blank');
    } else {
      alert('Download link not available yet');
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
            className="flex flex-col sm:flex-row items-center p-4 sm:p-6 rounded-[24px] sm:rounded-[32px] w-full" 
            style={{ 
              background: 'linear-gradient(180deg, #000C34 0%, #000000 100%)',
              boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Game Image */}
            <img 
              src={`${BACKEND_URL}${game.imageUrl}`} 
              alt={game.name} 
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain mr-0 sm:mr-6 mb-4 sm:mb-0"
              onError={(e) => {
                console.error('Error loading image:', game.imageUrl);
                e.currentTarget.src = 'https://via.placeholder.com/128x128?text=No+Image';
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

            {/* Download Button */}
            <button
              className="mt-4 sm:mt-0 ml-0 sm:ml-6 w-[100px] sm:w-[141px] h-[36px] sm:h-[42px] flex-shrink-0 flex items-center justify-center"
              style={{
                background: '#AEFF00',
                borderRadius: '10px',
                backdropFilter: 'blur(74px)'
              }}
              onClick={() => handleDownload(game.gameUrl)}
            >
              <span className="text-black text-sm sm:text-base font-extrabold tracking-wider">
                DOWNLOAD
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;

