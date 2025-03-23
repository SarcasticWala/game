import React from 'react';

interface Game {
  _id: string;
  name: string;
  landingPageUrl: string;
}

interface GameListProps {
  games: Game[];
}

const GameList: React.FC<GameListProps> = ({ games }) => {
  return (
    <div>
      {games.map((game) => (
        <div key={game._id} className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold">{game.name}</h3>
            <p className="text-sm text-gray-500">Landing Page: {game.landingPageUrl || 'Not available'}</p>
          </div>
          <div>
            {/* Commenting out the Preview button for admin */}
            {/* <button
              onClick={() => {
                if (game.landingPageUrl) {
                  // Ensure the URL is absolute
                  const url = game.landingPageUrl.startsWith('/game/')
                    ? `${window.location.origin}${game.landingPageUrl}`
                    : `${window.location.origin}/game/${game.landingPageUrl}`; // Handle relative URLs

                  console.log('Opening landing page URL:', url); // Debugging log
                  window.open(url, '_blank'); // Open the landing page in a new tab
                } else {
                  alert('Landing page not available yet');
                }
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Preview
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;