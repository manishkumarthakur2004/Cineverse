import { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import MovieCard from '../../components/cards/MovieCard';
import api from '../../services/api';

export default function TVShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await api.get('/movies/search?query=Breaking Bad');
        if (response.data.success) {
          setShows(response.data.data);
        }
      } catch (err) {
        // Handle error silently
      } finally {
        setLoading(false);
      }
    };
    fetchShows();
  }, []);

  return (
    <div className="page-container space-y-8">
      <SectionHeader
        title="TV Shows"
        subtitle="Binge-watch the best television series"
        count={shows.length}
      />
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
          {shows.map((show) => (
            <MovieCard
              key={show.imdbID || show.id}
              id={show.imdbID || show.id}
              title={show.Title || show.title}
              poster={show.Poster || show.poster}
              year={show.Year || show.year}
              genre={show.Type || show.type}
            />
          ))}
        </div>
      )}
    </div>
  );
}
