import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { LandingPage } from './components/LandingPage';
import { ExplorePage } from './components/ExplorePage';
import { GeneratorPage } from './components/GeneratorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/explore" element={<ExplorePage />} />
      <Route path="/generator" element={<GeneratorPage />} />
    </Routes>
  );
}

export default App;