import { useState, useEffect } from 'react';
import MovieCard from '../../components/cards/MovieCard';
import api from '../../services/api';

const recentSearches = ['Interstellar', 'Sci-Fi', '2024', 'Action'];
const popularSearches = ['Inception', 'Avengers', 'Oppenheimer', 'The Dark Knight'];

export default function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch movies from backend API
  useEffect(() => {
    const fetchMovies = async () => {
      const query = searchTerm.trim();
      if (!query) {
        setMovies([]);
        return;
      }

      setLoading(true);
      setError('');
      try {
        const response = await api.get(`/movies/search?query=${encodeURIComponent(query)}`);
        if (response.data.success) {
          setMovies(response.data.data);
        } else {
          setMovies([]);
        }
      } catch (err) {
        // Handled via setError
        setError("Failed to fetch search results. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchMovies();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handleClear = () => {
    setSearchTerm('');
    setMovies([]);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  return (
    <div className="page-container text-white space-y-8">
      {/* Top Search Input & Controls */}
      <div className="space-y-8 max-w-3xl mx-auto text-center my-6 sm:my-10">
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
          Search <span className="text-[#E50914]">CineVerse</span>
        </h1>

        {/* Large Search Input Bar */}
        <div className="relative w-full shadow-2xl flex items-center">
          {/* Search Icon (Absolute Left) */}
          <div className="absolute left-5 flex items-center justify-center pointer-events-none text-gray-400 z-10">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by movie title..."
            className="w-full py-4 bg-[#1F1F1F] text-white border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#E50914] focus:border-transparent text-lg shadow-xl transition-all placeholder-gray-500"
            style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}
          />

          {/* Clear Search Button (Absolute Right) */}
          {searchTerm && (
            <button
              onClick={handleClear}
              type="button"
              className="absolute right-5 flex items-center justify-center text-gray-400 hover:text-white transition-colors z-10 cursor-pointer"
              aria-label="Clear search input"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Recent & Popular Search Suggestions */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-xs sm:text-sm pt-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[#B3B3B3] font-bold">Recent:</span>
            {recentSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                type="button"
                className="bg-white/5 hover:bg-white/15 text-gray-300 px-3.5 py-1.5 rounded-full border border-white/10 transition-colors cursor-pointer font-medium"
              >
                {tag}
              </button>
            ))}
          </div>
          <span className="hidden md:inline text-white/25">•</span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-[#B3B3B3] font-bold">Popular:</span>
            {popularSearches.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                type="button"
                className="bg-[#E50914]/10 hover:bg-[#E50914]/25 text-[#E50914] px-3.5 py-1.5 rounded-full border border-[#E50914]/25 transition-colors font-bold cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header & Counter */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mt-16 mb-8">
        <h2 className="text-xl sm:text-2xl font-black text-white border-l-4 border-[#E50914] pl-3">
          {searchTerm ? `Search Results` : `Search Movies`}
        </h2>
        {searchTerm && !loading && (
          <span className="text-xs sm:text-sm font-semibold text-[#B3B3B3] bg-[#1F1F1F] px-4 py-1.5 rounded-full border border-white/5">
            Showing {movies?.length || 0} {(movies?.length === 1) ? 'Result' : 'Results'}
          </span>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="text-center text-red-500 font-bold py-8">{error}</div>
      )}

      {/* Results Section Grid or No Movies Found State */}
      {!loading && !error && searchTerm && movies?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 justify-items-center">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbId || movie.id}
              id={movie.imdbId || movie.id}
              title={movie.title || movie.Title}
              poster={movie.poster || movie.Poster}
              year={movie.year || movie.Year}
              genre={movie.genre || movie.Type}
              rating={movie.rating || movie.imdbRating}
            />
          ))}
        </div>
      )}
      
      {!loading && !error && searchTerm && (!movies || movies.length === 0) && (
        /* No Movies Found UI */
        <div className="py-16 text-center space-y-4 max-w-md mx-auto bg-[#1F1F1F]/40 border border-white/5 rounded-2xl p-8">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white">No Movies Found</h3>
          <p className="text-sm text-[#B3B3B3]">
            We couldn't find any movies matching "{searchTerm}". Try checking for typos or searching by another title.
          </p>
          <button
            onClick={handleClear}
            type="button"
            className="bg-[#E50914] hover:bg-[#b80710] text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all shadow-md cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
