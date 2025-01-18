import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState('');
  const [randomMovies, setRandomMovies] = useState([]);
  const [isSearchActive, setIsSearchActive] = useState(false);

  
  useEffect(() => {
    const fetchRandomMovies = async () => {
      try {
        const randomTitles = ['Inception', 'Avatar', 'Titanic', 'Interstellar', 'Joker'];
        const moviePromises = randomTitles.map((title) =>
          axios.get(`https://www.omdbapi.com/?t=${title}&apikey=5020cabe`)
        );
        const movieResponses = await Promise.all(moviePromises);
        setRandomMovies(movieResponses.map((res) => res.data));
      } catch (err) {
        console.error(err);
      }
    };
    fetchRandomMovies();
  }, []);

  const fetchMovies = async () => {
    if (!searchTerm) return;
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${searchTerm}&apikey=277026cd`
      );
      if (response.data.Response === 'True') {
        setMovies(response.data.Search);
        setError('');
        setIsSearchActive(true); 
      } else {
        setMovies([]);
        setError(response.data.Error);
        setIsSearchActive(false); 
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again later.');
      setIsSearchActive(false); 
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className='head'>Film Finder</h1>
        <p>Go for your choice...</p>
      </header>

      <main className="app-main">
        <div className="search-container">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search for a movie..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button onClick={fetchMovies} className="search-button">
              Search
            </button>
          </div>

        
          {error && <p className="error-message">{error}</p>}

      
          {!isSearchActive ? (
            <div className="random-movies">
              <h2>Suggested Movies</h2>
              <div className="movies-grid">
                {randomMovies.map((movie, index) => (
                  <div key={index} className="movie-card">
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                      alt={movie.Title}
                      className="movie-poster"
                    />
                    <h2 className="movie-title">{movie.Title}</h2>
                    <p className="movie-year">Year: {movie.Year}</p>
                    <p className="movie-plot">{movie.Plot?.slice(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="search-results">
              <h2>Search Results</h2>
              <div className="movies-grid">
                {movies.map((movie) => (
                  <div key={movie.imdbID} className="movie-card">
                    <img
                      src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/150'}
                      alt={movie.Title}
                      className="movie-poster"
                    />
                    <h2 className="movie-title">{movie.Title}</h2>
                    <p className="movie-year">Year: {movie.Year}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;