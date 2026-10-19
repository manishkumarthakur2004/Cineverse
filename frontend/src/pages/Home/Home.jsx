import { useState, useEffect } from 'react';
import HeroBanner from '../../components/hero/HeroBanner';
import MovieRow from '../../components/common/MovieRow';
import api from '../../services/api';

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [trendingRes, popularRes, topRatedRes, tvRes, upcomingRes] = await Promise.all([
          api.get('/movies/search?query=Marvel'),
          api.get('/movies/search?query=Star Wars'),
          api.get('/movies/search?query=Batman'),
          api.get('/movies/search?query=Game of Thrones'),
          api.get('/movies/search?query=Spider-Man')
        ]);

        if (trendingRes.data.success) setTrending(trendingRes.data.data);
        if (popularRes.data.success) setPopular(popularRes.data.data);
        if (topRatedRes.data.success) setTopRated(topRatedRes.data.data);
        if (tvRes.data.success) setTvShows(tvRes.data.data);
        if (upcomingRes.data.success) setUpcoming(upcomingRes.data.data);
      } catch (err) {
        // Silently fail, rows will be empty or handle error states
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="w-full pb-16 space-y-4 sm:space-y-6">
      {/* Hero Banner Component */}
      <HeroBanner movie={trending.length > 0 ? trending[0] : null} />

      {/* Movie Rows Sections */}
      <div className="space-y-6 sm:space-y-10 -mt-12 sm:-mt-20 relative z-20">
        <MovieRow title="Trending Movies" movies={trending} />
        <MovieRow title="Popular Movies" movies={popular} />
        <MovieRow title="Top Rated Movies" movies={topRated} />
        <MovieRow title="TV Shows" movies={tvShows} />
        <MovieRow title="Upcoming Movies" movies={upcoming} />
      </div>
    </div>
  );
}
