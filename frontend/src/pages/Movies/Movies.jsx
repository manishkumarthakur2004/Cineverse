import { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import MovieCard from '../../components/cards/MovieCard';
import api from '../../services/api';

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies/search?query=Action');
        if (response.data.success) {
          setMovies(response.data.data);
        }
      } catch (err) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  return (
    <div className="page-container space-y-8">
      <SectionHeader
        title="Explore Movies"
        subtitle="Browse top rated and popular movies on CineVerse"
        count={movies.length}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID || movie.id}
              id={movie.imdbID || movie.id}
              title={movie.Title || movie.title}
              poster={movie.Poster || movie.poster}
              year={movie.Year || movie.year}
              genre={movie.Type || movie.type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
