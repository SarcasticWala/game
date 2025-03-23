import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { GameList } from './pages/GameList';
import { AddGame } from './pages/AddGame';
import { GenerateLanding } from './pages/GenerateLanding';
import Login from './pages/Login';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="games" element={<GameList />} />
          <Route path="add-game" element={<AddGame />} />
          <Route path="generate-landing" element={<GenerateLanding />} />
          {/* <Route path="generate-landing/:id" element={<GenerateLanding />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;