import { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import MovieCard from '../../components/cards/MovieCard';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Watchlist() {
  const { isAuthenticated } = useAuth();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWatchlist = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/watchlist');
        if (response.data.success) {
          setMovies(response.data.data);
        }
      } catch (err) {
        // Handled via setError
        setError("Failed to load watchlist.");
      } finally {
        setLoading(false);
      }
    };
    fetchWatchlist();
  }, [isAuthenticated]);

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="text-center text-white py-32 text-2xl font-bold">Please login to view your watchlist.</div>
  );

  if (error) return (
    <div className="text-center text-white py-32 text-xl font-bold">{error}</div>
  );

  return (
    <div className="page-container space-y-8">
      {/* Section Header */}
      <SectionHeader
        title="My Watchlist"
        subtitle="Movies to watch later"
        count={movies.length}
      />

      {/* Grid of Watchlist Movies or Empty State */}
      {movies && movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={movie.imdbId}
              title={movie.title}
              poster={movie.poster}
            />
          ))}
        </div>
      ) : (
        /* Empty Watchlist State */
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-[#1F1F1F]/40 border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="text-5xl">📌</div>
          <h3 className="text-xl font-bold text-white">Your watchlist is empty.</h3>
          <p className="text-sm text-[#B3B3B3]">
            Add movies and shows to your watchlist so you can easily track what to watch next.
          </p>
        </div>
      )}
    </div>
  );
}
