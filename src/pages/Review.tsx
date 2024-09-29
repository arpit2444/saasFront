import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/review.css'
interface Review {
  _id: string;
  reviewerName: string;
  rating: number;
  comments: string;
}

const ReviewSearchPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      if (searchTerm) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_URL}/reviews?term=${searchTerm}`);
          setReviews(response.data);
        } catch (error) {
          console.error('Error fetching reviews:', error);
        }
      } else {
        setReviews([]); 
      }
    };

    const debounceFetch = setTimeout(() => {
      fetchReviews();
    }, 300); 

    return () => clearTimeout(debounceFetch); 
  }, [searchTerm]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="review-search-page">
      <h1>Search Reviews</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search by reviewer name or comments"
      />
      <div className="reviews-container">
        {reviews.map(review => (
          <div className="review-card" key={review._id}>
            <h3>{review.reviewerName}</h3>
            <p>{review.comments}</p>
            <span>Rating: {review.rating}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewSearchPage;
