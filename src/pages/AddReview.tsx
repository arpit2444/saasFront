import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/addReview.css'

interface Movie {
  _id: string;
  name: string;
}

const AddReview: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieId, setMovieId] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/movies`).then(response => {
      setMovies(response.data);
    });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/reviews`, { movieId, reviewerName, rating: Number(rating), comments }).then(() => {
      alert('Review added');
      setMovieId('');
      setReviewerName('');
      setRating('');
      setComments('');

    });
  };

  return (
    <div className='card'>
      <h2>Add new review</h2>
      <form onSubmit={handleSubmit}>
        <select value={movieId} onChange={e => setMovieId(e.target.value)}>
          <option>Select a movie</option>
          {movies.map(movie => (
            <option key={movie._id} value={movie._id}>
              {movie.name}
            </option>
          ))}
        </select>
        <input type="text" placeholder="Your name" value={reviewerName} onChange={e => setReviewerName(e.target.value)} />
        <input type="number" placeholder="Rating out of 10" value={rating} onChange={e => setRating(e.target.value)} />
        <textarea placeholder="Review comments" value={comments} onChange={e => setComments(e.target.value)} />
        <button type="submit">Add review</button>
      </form>
    </div>
  );
};

export default AddReview;
