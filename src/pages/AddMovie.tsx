import React, { useState } from 'react';
import axios from 'axios';
import '../styles/addMovie.css'; 


const AddMovie: React.FC = () => {
  const [name, setName] = useState('');
  const [releaseDate, setReleaseDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    axios.post(`${process.env.REACT_APP_API_URL}/movies`, { name, releaseDate }).then(() => {
      alert('Movie added');
      setName('')
      setReleaseDate('')
    });
  };

  return (
    <div className='card'>
      <h2>Add new movie</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
        <button type="submit">Create movie</button>
      </form>
    </div>
  );
};

export default AddMovie;
