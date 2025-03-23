import React, { useState } from 'react';

interface Game {
  _id: string;
  name: string;
  landingPageUrl: string;
}

interface GameListProps {
  games: Game[];
  onGameAdded: () => void; // Callback to refresh the game list
}

const GameList: React.FC<GameListProps> = ({ games, onGameAdded }) => {
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleAddGame = async (gameData: FormData) => {
    try {
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        body: gameData,
      });

      if (!response.ok) {
        throw new Error('Failed to add game');
      }

      setSuccessMessage('Game added successfully!');
      onGameAdded(); // Refresh the game list
    } catch (error) {
      console.error('Error adding game:', error);
      setSuccessMessage('Failed to add game. Please try again.');
    } finally {
      setTimeout(() => setSuccessMessage(null), 3000); // Clear the message after 3 seconds
    }
  };

  return (
    <div>
      {successMessage && (
        <div className="bg-green-500 text-white p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      {games.map((game) => (
        <div key={game._id} className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-bold">{game.name}</h3>
            <p className="text-sm text-gray-500">Landing Page: {game.landingPageUrl || 'Not available'}</p>
          </div>
          {/* Removed the Preview button */}
        </div>
      ))}
    </div>
  );
};

export default GameList;