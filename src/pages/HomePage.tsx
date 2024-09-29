import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'; 
import '../styles/home.css'; 

interface Movie {
  _id: string;
  name: string;
  releaseDate: string;
  averageRating: number;
}

const HomePage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>(''); 
  const [editingMovieId, setEditingMovieId] = useState<string | null>(null);
  const [editedMovieName, setEditedMovieName] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/movies?search=${searchTerm}`);
        setMovies(response.data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    
    const timeout = setTimeout(() => {
      fetchMovies();
    }, 300);

    setDebounceTimeout(timeout);

    return () => {
      clearTimeout(timeout);
    };
  }, [searchTerm]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); 
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/movies/${id}`);
      setMovies(movies.filter(movie => movie._id !== id));
      alert('Movie deleted successfully!');
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const handleEditClick = (movie: Movie) => {
    setEditingMovieId(movie._id);
    setEditedMovieName(movie.name);
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedMovieName(event.target.value);
  };

  const handleEditSubmit = async (id: string) => {
    try {
      const updatedMovie = { name: editedMovieName };
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/movies/${id}`, updatedMovie);
      setMovies(movies.map(movie => (movie._id === id ? response.data : movie)));
      setEditingMovieId(null); 
      alert('Movie updated successfully!');
    } catch (error) {
      console.error('Error updating movie:', error);
    }
  };

  return (
    <div className='container'>
      <h1>The best movie review site!</h1>
      <div className="search-container">
        <input 
          type="text" 
          placeholder="Search for your favourite movie" 
          value={searchTerm}
          onChange={handleSearch} 
          className="search-input"
        />
      </div>
      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie._id} className="movie-card">
            {editingMovieId === movie._id ? (
              <div>
                <input
                  type="text"
                  value={editedMovieName}
                  onChange={handleEditChange}
                />
                <button className="save-button" onClick={() => handleEditSubmit(movie._id)}>Save</button>
                <button className="cancel-button" onClick={() => setEditingMovieId(null)}>Cancel</button>
              </div>
            ) : (
              <div className="movie-details">
                <Link to={`/movie/${movie._id}`}>
                  <h3>{movie.name}</h3>
                  <p>Released: {new Date(movie.releaseDate).toDateString()}</p>
                  <p>Average Rating: {movie.averageRating ? movie.averageRating : 'No rating yet'}</p>
                </Link>
                <div className="icon-container">
                  <button onClick={() => handleEditClick(movie)} className="icon-button">
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(movie._id)} className="icon-button">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
