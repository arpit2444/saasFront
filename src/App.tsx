import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import Navbar from './pages/Navbar';
import AddMovie from './pages/AddMovie';
import AddReview from './pages/AddReview';
import ReviewSearchPage from './pages/Review';

import './styles/App.css';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePage />} />
        <Route path="/add-movie" element={<AddMovie />} />
        <Route path="/add-review" element={<AddReview />} />
        <Route path="/search-reviews" element={<ReviewSearchPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
