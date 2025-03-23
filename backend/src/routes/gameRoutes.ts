import express from 'express';
import path from 'path';

const router = express.Router();

// Serve the landing page for a specific game
router.get('/game/:id', (req, res) => {
  const { id } = req.params;

  // Example: Serve a static HTML file for the landing page
  const landingPagePath = path.join(__dirname, '..', 'public', 'landingPages', `${id}.html`);
  console.log('Serving landing page for game ID:', id); // Debugging log
  res.sendFile(landingPagePath, (err) => {
    if (err) {
      console.error(`Error serving landing page for game ${id}:`, err);
      res.status(404).send('Landing page not found');
    }
  });
});

export default router;
