import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game';
import gameRoutes from './routes/gameRoutes'; // Correctly import the gameRoutes

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// filepath: d:\yono\backend\src\index.ts
app.use(cors({
  origin: '*', // Replace '*' with your frontend's URL in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public'))); // Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files from the uploads directory

// Set Content Security Policy headers
// app.use((req, res, next) => {
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
//   );
//   next();
// });

// MongoDB connection
console.log('Connecting to MongoDB with URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || '')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
});

// Multer configuration for Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: process.env.CLOUDINARY_FOLDER || 'uploads', // Explicitly define the folder parameter
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed file formats
  } as {
    folder: string; // Explicitly define the folder type
    allowed_formats: string[];
  },
});

const upload = multer({ storage });

// Routes
// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 });
    res.json(games);
  } catch (error: any) {
    console.error('Error fetching games:', error);
    res.status(500).json({ message: 'Error fetching games', error: error.message });
  }
});

// Add new game
app.post('/api/games', upload.single('image'), async (req, res) => {
  try {
    console.log('Uploaded file:', req.file); // Debugging log

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { name, signUpBonus, minWithdraw, gameUrl } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!signUpBonus || !minWithdraw) {
      return res.status(400).json({ message: 'Sign up bonus and minimum withdrawal are required' });
    }

    const imageUrl = req.file.path; // Full Cloudinary URL
    const landingPageUrl = `/game/${req.file.filename.split('/').pop()}`; // Extract filename for landing page

    console.log('Creating game with data:', {
      name,
      imageUrl,
      landingPageUrl,
      gameUrl,
      signUpBonus,
      minWithdraw,
    });

    const game = new Game({
      name,
      imageUrl,
      gameUrl,
      landingPageUrl,
      signUpBonus: parseInt(signUpBonus),
      minWithdraw: parseInt(minWithdraw),
    });

    await game.save();
    console.log('Game saved successfully:', game);
    res.status(201).json(game);
  } catch (error: any) {
    console.error('Error creating game:', error);
    res.status(500).json({
      message: 'Error creating game',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
});

// Get game by landing page URL
app.get('/api/games/:landingPageUrl', async (req, res) => {
  try {
    const landingPageUrl = `/game/${req.params.landingPageUrl}`; // Prepend '/game/' prefix
    console.log('Querying game with landingPageUrl:', landingPageUrl); // Debugging log
    const game = await Game.findOne({ landingPageUrl });
    if (!game) {
      console.log('Game not found for landingPageUrl:', landingPageUrl); // Debugging log
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json(game);
  } catch (error: any) {
    console.error('Error fetching game:', error);
    res.status(500).json({ message: 'Error fetching game', error: error.message });
  }
});

// Update game URL
app.put('/api/games/:id', async (req, res) => {
  try {
    const { gameUrl } = req.body;
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { gameUrl },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error: any) {
    console.error('Error updating game:', error);
    res.status(500).json({ message: 'Error updating game', error: error.message });
  }
});

// Delete game
app.delete('/api/games/:id', async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }
    res.json({ message: 'Game deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Error deleting game', error: error.message });
  }
});

// Update game name
app.put('/api/games/:id/name', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    res.json(game);
  } catch (error: any) {
    console.error('Error updating game name:', error);
    res.status(500).json({ message: 'Error updating game name', error: error.message });
  }
});

// Use the game routes
app.use('/', gameRoutes);

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exit the process to avoid undefined behavior
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exit the process to avoid undefined behavior
});

// Ensure the server starts successfully
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}).on('error', (err) => {
  console.error('Server failed to start:', err);
  process.exit(1); // Exit the process if the server fails to start
});