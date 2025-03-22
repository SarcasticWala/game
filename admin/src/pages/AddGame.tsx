import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, ArrowLeft } from 'lucide-react';

// Function to generate random amounts
const generateRandomAmounts = () => {
  // Random bonus between 100 and 1000, rounded to nearest 50
  const bonus = Math.round(Math.floor(Math.random() * (1000 - 100 + 1) + 100) / 50) * 50;
  // Random withdrawal between 50 and 200, rounded to nearest 10
  const withdraw = Math.round(Math.floor(Math.random() * (200 - 50 + 1) + 50) / 10) * 10;
  return { bonus, withdraw };
};

export const AddGame: React.FC = () => {
  const navigate = useNavigate();
  const [gameName, setGameName] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!gameName.trim() || !selectedFile) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('name', gameName);

      // Generate and append random amounts
      const { bonus, withdraw } = generateRandomAmounts();
      console.log('Generated random amounts:', { bonus, withdraw }); // Debug log

      formData.append('signUpBonus', bonus.toString());
      formData.append('minWithdraw', withdraw.toString());

      // Log the complete FormData contents
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create game');
      }

      console.log('Game created successfully:', data);
      localStorage.setItem('currentGame', JSON.stringify(data));
      navigate('/generate-landing');
    } catch (err) {
      console.error('Error creating game:', err);
      setError(err instanceof Error ? err.message : 'Failed to create game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            Add New Game
          </h1>
          <div className="w-[60px] sm:w-[88px]"></div>
        </div>

        <div className="flex flex-col items-center gap-6 sm:gap-8">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            className="hidden"
          />
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors border-2 border-dashed border-gray-400 hover:border-gray-300"
          >
            {imagePreview ? (
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-center">
                <ImagePlus className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-400">Add Image</span>
              </div>
            )}
          </div>

          <input
            type="text"
            value={gameName}
            onChange={(e) => setGameName(e.target.value)}
            placeholder="Add Name"
            className="w-full px-4 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          />

          {error && (
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 sm:py-4 px-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white rounded-xl text-base sm:text-lg font-semibold transition-all transform hover:scale-105 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-purple-900"
          >
            {isLoading ? 'Creating...' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};