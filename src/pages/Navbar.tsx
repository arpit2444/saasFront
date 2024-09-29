import React from 'react';
import '../styles/nav.css'; 

const Navbar: React.FC = () => {
  const handleAddMovie = () => {
    window.location.href = '/add-movie'; 
  };

  const handleAddReview = () => {
    window.location.href = '/add-review'; 
  };

  const handleBonus= ()=>{
    window.location.href = '/search-reviews'
  }

  return (
    <nav className="navbar">
      <a href="/" className="logo">MOVIECRITIC</a>

      <button className='nav-button' onClick={handleBonus}>Bonus Page</button>

      <div className="nav-links">
        <button className='nav-button' onClick={handleAddMovie}>Add New Movie</button>
        <button className='nav-button' onClick={handleAddReview}>Add New Review</button>
      </div>
    </nav>
  );
};

export default Navbar;
