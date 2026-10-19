import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../../components/cards/MovieCard';
import TrailerModal from '../../components/modal/TrailerModal';
import StremioModal from '../../components/modal/StremioModal';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';


export default function MovieDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  
  const [movieData, setMovieData] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [isStremioModalOpen, setIsStremioModalOpen] = useState(false);
  const [addingFav, setAddingFav] = useState(false);
  const [addingWatchlist, setAddingWatchlist] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Fetch Movie Details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      setError('');
      try {
        const [movieRes, reviewsRes, similarRes] = await Promise.all([
          api.get(`/movies/details/${id}`),
          api.get(`/users/reviews/movie/${id}`).catch(() => ({ data: { data: [] } })),
          api.get(`/movies/search?query=action`).catch(() => ({ data: { data: [] } }))
        ]);
        
        if (movieRes.data.success) {
          setMovieData(movieRes.data.data);
        } else {
          setError('Movie not found');
        }
        
        if (reviewsRes.data && reviewsRes.data.success) {
          setReviews(reviewsRes.data.data || []);
        }
        
        if (similarRes.data && similarRes.data.success) {
          setSimilarMovies(similarRes.data.data.slice(0, 8) || []);
        }
      } catch (err) {
        console.error("Error fetching movie details:", err);
        setError("Failed to load movie details.");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchDetails();
    }
  }, [id]);

  const handleStremioPlay = () => {
    if (!movieData) return;
    
    // Using official Stremio deep link search scheme (three slashes)
    // Priority A: Search by IMDb ID. Priority B: Search by Title
    const searchQuery = movieData.imdbId || encodeURIComponent(movieData.title);
    const stremioLink = `stremio:///search?search=${searchQuery}`;
    
    window.location.href = stremioLink;
    
    setTimeout(() => {
      if (!document.hidden) {
        setIsStremioModalOpen(true);
      }
    }, 1500);
  };

  const handleAddFavorite = async () => {
    if (!isAuthenticated) return setActionMsg("Please login to add favorites.");
    setAddingFav(true);
    try {
      await api.post('/users/favorites', { imdbId: id, title: movieData.title, poster: movieData.poster });
      setActionMsg("Added to Favorites");
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Error adding favorite");
    } finally {
      setAddingFav(false);
      setTimeout(() => setActionMsg(''), 3000);
    }
  };

  const handleAddWatchlist = async () => {
    if (!isAuthenticated) return setActionMsg("Please login to add to watchlist");
    setAddingWatchlist(true);
    try {
      await api.post('/users/watchlist', { imdbId: id, title: movieData.title, poster: movieData.poster });
      setActionMsg("Added to Watchlist");
    } catch (err) {
      setActionMsg(err.response?.data?.message || "Error adding to watchlist");
    } finally {
      setAddingWatchlist(false);
      setTimeout(() => setActionMsg(''), 3000);
    }
  };



  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#E50914]"></div>
    </div>
  );

  if (error || !movieData) return (
    <div className="text-center text-white py-32 text-2xl font-bold">{error || "Movie not found"}</div>
  );

  return (
    <div className="w-full pb-20 text-white">
      {/* 1. Large Cinematic Backdrop Banner & Gradient Overlay */}
      <div className="relative w-full h-[55vh] sm:h-[65vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm scale-110"
          style={{ backgroundImage: `url('${movieData.poster}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/80 to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/90 to-transparent sm:w-2/3" />
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 -mt-40 sm:-mt-56 relative z-20 space-y-12">
        {/* Header Section: Poster + Movie Details */}
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 items-start">
          {/* Movie Poster */}
          <div className="w-44 sm:w-64 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 mx-auto md:mx-0">
            <img
              src={movieData.poster !== 'N/A' ? movieData.poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
              alt={movieData.title}
              className="w-full h-auto object-cover aspect-[2/3]"
            />
          </div>

          {/* Movie Information Header */}
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs sm:text-sm text-[#B3B3B3]">
              <span className="bg-[#E50914] text-white px-2 py-0.5 rounded font-bold uppercase">
                {movieData.type || 'Movie'}
              </span>
              <span>{movieData.year}</span>
              <span>•</span>
              <span>{movieData.runtime}</span>
              <span>•</span>
              <span>{movieData.language}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight drop-shadow-md">
              {movieData.title}
            </h1>
            <p className="text-gray-400 italic text-sm sm:text-base">Country: {movieData.country}</p>

            {/* Genres Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {movieData.genre?.split(',').map((g) => (
                <span
                  key={g.trim()}
                  className="bg-[#1F1F1F] border border-white/10 text-gray-300 text-xs font-semibold px-3 py-1 rounded-full"
                >
                  {g.trim()}
                </span>
              ))}
            </div>

            {/* IMDb Rating Badge */}
            <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-lg text-sm font-bold">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span>{movieData.imdbRating} IMDb</span>
              </div>
              <span className="text-xs text-[#B3B3B3]">{movieData.imdbVotes} votes</span>
            </div>

            {/* Action Messages */}
            {actionMsg && <div className="text-yellow-400 text-sm font-bold animate-pulse">{actionMsg}</div>}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-3">
              {/* Official Trailer Button (Opens TrailerModal) */}
              <button
                type="button"
                onClick={() => setIsTrailerOpen(true)}
                className="bg-[#E50914] hover:bg-[#b80710] text-white font-semibold px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Watch Trailer</span>
              </button>

              {/* Stremio Button */}
              <button
                type="button"
                onClick={handleStremioPlay}
                className="bg-[#8a5aeb] hover:bg-[#7b4ada] text-white font-semibold px-4 py-2 rounded-lg shadow-lg flex flex-col items-center justify-center transition-all transform hover:scale-105 cursor-pointer leading-tight"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                  <span>Play in Stremio</span>
                </div>
                <span className="text-[10px] text-white/75 font-bold tracking-wider uppercase mt-0.5">🎬 Personal Playback</span>
              </button>

              {/* Add to Watchlist Button */}
              <button
                type="button"
                onClick={handleAddWatchlist}
                disabled={addingWatchlist}
                className="bg-[#1F1F1F] hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-lg border border-white/15 shadow-md flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                <span>{addingWatchlist ? 'Adding...' : 'Watchlist'}</span>
              </button>

              {/* Add to Favorites Button */}
              <button
                type="button"
                onClick={handleAddFavorite}
                disabled={addingFav}
                className="bg-[#1F1F1F] hover:bg-white/20 text-white font-semibold px-4 py-2.5 rounded-lg border border-white/15 shadow-md flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer disabled:opacity-50"
              >
                <svg className="w-5 h-5 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span>{addingFav ? 'Adding...' : 'Favorite'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/5 space-y-3">
          <h2 className="text-xl font-bold text-white border-l-4 border-[#E50914] pl-3">
            Overview
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {movieData.plot !== 'N/A' ? movieData.plot : 'No overview available.'}
          </p>
        </div>

        {/* Movie Production & Metadata Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 space-y-1">
            <span className="text-xs text-[#B3B3B3] uppercase font-bold tracking-wider">
              Director
            </span>
            <p className="text-white font-semibold text-base">{movieData.director}</p>
          </div>
          <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 space-y-1">
            <span className="text-xs text-[#B3B3B3] uppercase font-bold tracking-wider">
              Writer
            </span>
            <p className="text-white font-semibold text-base">{movieData.writer}</p>
          </div>
          <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-xl p-5 border border-white/5 space-y-1">
            <span className="text-xs text-[#B3B3B3] uppercase font-bold tracking-wider">
              Box Office
            </span>
            <p className="text-emerald-400 font-bold text-base">{movieData.boxOffice}</p>
          </div>
        </div>

        {/* Cast Section */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#E50914] pl-3">
            Top Cast
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {movieData.actors?.split(',').map((actorName) => (
              <div
                key={actorName.trim()}
                className="bg-[#1F1F1F] rounded-xl p-3 border border-white/5 text-center hover:border-white/20 transition-all flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-gray-700 mb-2 border-2 border-white/10 flex items-center justify-center text-xs font-bold uppercase text-white/50">
                  {actorName.trim().substring(0, 2)}
                </div>
                <h4 className="text-white text-xs font-bold truncate w-full">{actorName.trim()}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
          <div className="flex items-center justify-between border-l-4 border-[#E50914] pl-3">
             <h3 className="text-lg font-bold text-white">Audience Reviews</h3>
          </div>
          
          {reviews.length === 0 ? (
            <div className="text-center text-gray-400 py-4">No reviews yet. Be the first to review!</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-[#1F1F1F] p-4 rounded-xl border border-white/5 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs text-[#B3B3B3]">
                    <span className="font-bold text-white text-sm">User ID: {review.userId}</span>
                  </div>
                  <div className="flex items-center text-yellow-400 text-xs">
                    {'★'.repeat(Math.round(review.rating / 2))}
                    <span className="text-gray-400 ml-2">{review.rating}/10</span>
                  </div>
                  <p className="text-gray-300 text-sm italic">"{review.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Similar Movies Section */}
        <div className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white border-l-4 border-[#E50914] pl-3">
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {similarMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                id={movie.id}
                title={movie.title}
                poster={movie.poster}
                rating={movie.rating}
                year={movie.year}
                genre={movie.genre}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Integrated Trailer Modal Component */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        movieTitle={movieData.title}
        moviePoster={movieData.poster}
      />
      <StremioModal
        isOpen={isStremioModalOpen}
        onClose={() => setIsStremioModalOpen(false)}
        movie={movieData}
      />
    </div>
  );
}
