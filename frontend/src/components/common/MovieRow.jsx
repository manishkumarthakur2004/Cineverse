import { useRef } from 'react';
import MovieCard from '../cards/MovieCard';


export default function MovieRow({ title = 'Trending Now', movies = [] }) {
  const rowRef = useRef(null);

  // Smooth scroll left / right handler
  const handleScroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Convert vertical mouse wheel into horizontal scroll
  const handleWheel = (e) => {
    if (rowRef.current && e.deltaY !== 0) {
      rowRef.current.scrollLeft += e.deltaY;
    }
  };

  const movieList = movies && movies.length > 0 ? movies : [];

  return (
    <section className="relative my-10 sm:my-14 lg:my-16 px-4 sm:px-8 lg:px-12 max-w-[1600px] mx-auto group">
      {/* Header: Title and View All */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide border-l-4 border-[#E50914] pl-3">
          {title}
        </h2>
        <button
          type="button"
          className="text-sm font-bold text-[#B3B3B3] hover:text-[#E50914] flex items-center gap-1 transition-colors duration-300 group/btn cursor-pointer"
        >
          <span>View All</span>
          <svg
            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Row Container with Scroll Navigation Controls */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => handleScroll('left')}
          type="button"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-[#E50914] text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center shadow-xl backdrop-blur-sm cursor-pointer"
          aria-label="Scroll left"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Horizontal Scroll Area */}
        <div
          ref={rowRef}
          onWheel={handleWheel}
          className="flex items-center gap-4 sm:gap-6 overflow-x-auto scroll-smooth py-3 px-1 no-scrollbar select-none"
        >
          {movieList.map((movie) => (
            <div key={movie.imdbId || movie.id} className="flex-shrink-0">
              <MovieCard
                id={movie.imdbId || movie.id}
                title={movie.title || movie.Title}
                poster={movie.poster || movie.Poster}
                rating={movie.rating || movie.imdbRating}
                year={movie.year || movie.Year}
                genre={movie.genre || movie.Type}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => handleScroll('right')}
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-black/70 hover:bg-[#E50914] text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hidden sm:flex items-center justify-center shadow-xl backdrop-blur-sm cursor-pointer"
          aria-label="Scroll right"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
