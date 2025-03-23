import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Games from './pages/Games';
import GameLanding from './pages/GameLanding';
import Footer from './components/Footer';
import About from './components/About';
import T_C from './components/TermsAndConditionsPage';
import ContactPage from './components/ContactPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/games" element={<Games />} />
            <Route path="/game/:landingPageUrl" element={<GameLanding />} />
            <Route path="/download/:gameId" element={<GameLanding />} />
            <Route path="/game/:id" element={<GameLanding />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/T&C" element={<T_C />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;