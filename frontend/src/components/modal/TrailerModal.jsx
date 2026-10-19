import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function TrailerModal({
  isOpen = false,
  onClose,
  movieTitle = 'Official Trailer',
  moviePoster = '',
}) {
  const youtubeUrl = movieTitle
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(movieTitle + " Official Trailer")}`
    : '#';
  const backdropRef = useRef(null);

  // Close modal on ESC key press & disable body scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Close modal on clicking outside (backdrop click)
  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current && onClose) {
      onClose();
    }
  };

  const modalContent = (
    <div
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
    >
      <div className="relative w-full max-w-4xl bg-[#1F1F1F]/95 border border-white/10 rounded-2xl shadow-2xl overflow-hidden transform transition-all duration-300 scale-100 flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E50914] animate-pulse" />
            <h2 id="trailer-modal-title" className="text-lg sm:text-xl font-bold text-white truncate">
              {movieTitle} — Trailer
            </h2>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-[#B3B3B3] hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors focus:outline-none cursor-pointer"
            aria-label="Close trailer modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Trailer Content Area */}
        <div className="p-4 sm:p-6 bg-[#141414]">
          <div className="relative w-full bg-[#1F1F1F] rounded-xl overflow-hidden border border-white/10 flex flex-col sm:flex-row items-center p-6 text-center sm:text-left gap-6 group">
            
            {/* Poster Thumbnail */}
            {moviePoster && moviePoster !== 'N/A' ? (
              <img 
                src={moviePoster} 
                alt={`${movieTitle} Poster`} 
                className="w-32 h-48 object-cover rounded-lg shadow-lg flex-shrink-0 border border-white/5"
              />
            ) : (
              <div className="w-32 h-48 bg-[#141414] rounded-lg shadow-lg flex-shrink-0 border border-white/5 flex items-center justify-center text-gray-500">
                <svg className="w-10 h-10 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}

            {/* Description & Action */}
            <div className="relative z-10 space-y-5 flex flex-col items-center sm:items-start flex-1">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight mb-2">
                  {movieTitle}
                </h3>
                <p className="text-sm sm:text-base text-[#B3B3B3]">
                  Watch the official trailer on YouTube.
                </p>
              </div>
              
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={!movieTitle ? (e) => e.preventDefault() : undefined}
                className={`w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all shadow-xl ${
                  movieTitle
                    ? 'bg-[#E50914] hover:bg-[#b80710] text-white hover:scale-105 active:scale-95 cursor-pointer'
                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                }`}
              >
                {/* YouTube Icon */}
                <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
                <span>{movieTitle ? 'Watch Official Trailer on YouTube' : 'Trailer unavailable'}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 bg-[#1F1F1F]">
          <button
            onClick={onClose}
            type="button"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-md cursor-pointer border border-white/5"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : modalContent;
}
