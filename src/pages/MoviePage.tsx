import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../styles/movie.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface Review {
  _id: string;
  reviewerName: string;
  rating: number;
  comments: string;
}

const MoviePage: React.FC = () => {
  const { id } = useParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [movie, setMovie] = useState<{ name: string; averageRating: number | null }>({ name: '', averageRating: null });
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [editedReview, setEditedReview] = useState<{ rating: number; comments: string }>({ rating: 0, comments: '' });

  useEffect(() => {
    const fetchMovieAndReviews = async () => {
      try {
        const movieResponse = await axios.get(`${process.env.REACT_APP_API_URL}/movies/${id}`);
        setMovie(movieResponse.data);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }

      try {
        const reviewsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/reviews/${id}`);
        setReviews(reviewsResponse.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchMovieAndReviews();
  }, [id,editingReviewId]);

  const handleEditClick = (review: Review) => {
    setEditingReviewId(review._id);
    setEditedReview({ rating: review.rating, comments: review.comments });
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setEditedReview(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (reviewId: string) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}`, editedReview);
      setReviews(reviews.map(review => (review._id === reviewId ? response.data : review)));
      setEditingReviewId(null);
      alert('Review updated successfully!');
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update the review. Please try again.');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/reviews/${reviewId}`);
        setReviews(reviews.filter(review => review._id !== reviewId));
        alert('Review deleted successfully!');
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('Failed to delete the review. Please try again.');
      }
    }
  };

  return (
    <div className="movie-page">
      <div style={{ display: "flex", justifyContent: 'space-between' }}>
        <h1>{movie.name}</h1>
        <h2 style={{ color: 'rgb(101, 28, 245)' }}>{movie.averageRating ? movie.averageRating : 'No rating yet'}</h2>
      </div>
      <div className="reviews-container">
        {reviews.map(review => (
          <div className="review-card" key={review._id}>
            <div className="review-header">
              <strong>{review.reviewerName}</strong>
              <span className="review-rating">{review.rating}/10</span>
            </div>
            <p>{review.comments}</p>
            <div className="review-actions">
              <button onClick={() => handleEditClick(review)}>
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button onClick={() => handleDelete(review._id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            {editingReviewId === review._id && (
              <div>
                <input
                  type="number"
                  name="rating"
                  value={editedReview.rating}
                  onChange={handleEditChange}
                  min="0"
                  max="10"
                  required
                />
                <textarea
                  name="comments"
                  value={editedReview.comments}
                  onChange={handleEditChange}
                  required
                />
                <button className="save-button" onClick={() => handleEditSubmit(review._id)}>Save</button>
                <button className="cancel-button" onClick={() => setEditingReviewId(null)}>Cancel</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MoviePage;
