import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Game from './models/Game';
import fs from 'fs';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/game-management')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
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
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);

    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const { name, signUpBonus, minWithdraw } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!signUpBonus || !minWithdraw) {
      return res.status(400).json({ message: 'Sign up bonus and minimum withdrawal are required' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const landingPageUrl = `/game/${uuidv4()}`;

    console.log('Creating game with data:', {
      name,
      imageUrl,
      landingPageUrl,
      signUpBonus,
      minWithdraw
    });

    const game = new Game({
      name,
      imageUrl,
      gameUrl: '',
      landingPageUrl,
      signUpBonus: parseInt(signUpBonus),
      minWithdraw: parseInt(minWithdraw)
    });

    console.log('Game object before save:', game);

    await game.save();
    console.log('Game saved successfully:', game);
    res.status(201).json(game);
  } catch (error: any) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      message: 'Error creating game', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get game by landing page URL
app.get('/api/games/:landingPageUrl', async (req, res) => {
  try {
    const game = await Game.findOne({ landingPageUrl: req.params.landingPageUrl });
    if (!game) {
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
    // Delete the image file
    const imagePath = path.join(__dirname, '..', game.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
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

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Created uploads directory');
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 