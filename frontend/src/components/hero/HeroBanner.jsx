import { useState } from 'react';
import { Link } from 'react-router-dom';
import TrailerModal from '../modal/TrailerModal';

export default function HeroBanner({ movie }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVideoFailed, setIsVideoFailed] = useState(false);

  const defaultHero = {
    title: 'Welcome to CineVerse',
    genre: 'Action • Sci-Fi',
    year: new Date().getFullYear().toString(),
    rating: '9.0',
    plot: 'Discover the latest movies and TV shows. Explore your next favorite story.',
    imdbId: 'tt0816692', // Default fallback imdbId
    poster: ''
  };

  const bannerData = movie || defaultHero;

  return (
    <div className="relative w-full h-[88vh] min-h-[600px] max-h-[920px] overflow-hidden group bg-black">
      {/* Background Section */}
      <div className="absolute inset-0 w-full h-full bg-black">
        <video
          className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 ${isVideoFailed ? 'hidden' : 'block'}`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/dark-galaxy.mp4"
          onError={() => setIsVideoFailed(true)}
        />
        
        {/* Fallback Static Background if Video Fails */}
        {isVideoFailed && bannerData.poster && bannerData.poster !== 'N/A' && (
          <img 
            src={bannerData.poster} 
            alt="Hero Background" 
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        )}
        
        {/* Dark Cinematic Overlay (60-70% Opacity) */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/80 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative h-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col justify-end pb-20 sm:pb-28 z-10">
        <div className="max-w-3xl space-y-6 animate-fade-in p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 hover:bg-white/10">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
            <span className="bg-[#E50914] text-white text-xs px-3 py-1 rounded font-bold uppercase tracking-wider">
              Featured
            </span>
            <span className="text-gray-200 font-semibold">{bannerData.genre}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-200">{bannerData.year}</span>
            <span className="text-gray-400">•</span>
            <div className="flex items-center gap-1.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/35 px-2.5 py-0.5 rounded-md text-xs font-black shadow-md">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
              <span>{bannerData.rating || 'N/A'} IMDb</span>
            </div>
          </div>

          {/* Movie Title */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white drop-shadow-xl leading-tight">
            {bannerData.title}
          </h1>

          {/* Movie Description */}
          <p className="text-gray-300 text-base sm:text-lg lg:text-xl line-clamp-3 leading-relaxed max-w-2xl drop-shadow-md">
            {bannerData.plot}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {/* Watch Trailer Button */}
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="bg-[#E50914] hover:bg-[#b80710] text-white font-bold px-8 py-3.5 rounded-xl shadow-xl hover:shadow-red-900/40 flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Watch Trailer</span>
            </button>

            {/* More Details Button */}
            <Link
              to={`/movie/${bannerData.imdbId}`}
              className="bg-[#1F1F1F]/60 backdrop-blur-md hover:bg-white/20 text-white font-bold px-8 py-3.5 rounded-xl border border-white/10 shadow-xl flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <span>More Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Reusable Trailer Modal Component Integration */}
      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        movieTitle={bannerData.title}
        moviePoster={bannerData.poster}
      />
    </div>
  );
}
