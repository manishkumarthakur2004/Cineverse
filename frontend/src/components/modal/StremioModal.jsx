import React, { useRef, useEffect, useState } from 'react';

export default function StremioModal({ isOpen, onClose, movie }) {
  const backdropRef = useRef(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !movie) return null;

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const searchQuery = movie.imdbId || encodeURIComponent(movie.title);
  const stremioLink = `stremio:///search?search=${searchQuery}`;
  
  const youtubeUrl = movie.title
    ? `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title + " Official Trailer")}`
    : '#';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(movie.imdbId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={backdropRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in"
    >
      <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 transition-transform">
        <div className="p-8 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-[#E50914]/20 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-[#E50914]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">Couldn't launch Stremio automatically</h2>
          <p className="text-gray-400 mb-6">
            Open Stremio and search for this movie, or try launching again.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full mb-8">
            <h3 className="text-white font-bold text-lg mb-1">{movie.title}</h3>
            <p className="text-gray-400 text-sm">IMDb ID: <span className="text-white font-mono">{movie.imdbId}</span></p>
          </div>

          <div className="flex flex-col w-full gap-3">
            <button 
              onClick={copyToClipboard}
              className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              {copied ? 'Copied!' : 'Copy IMDb ID'}
            </button>
            
            <a 
              href={stremioLink}
              className="w-full py-3 px-4 bg-[#8a5aeb] hover:bg-[#7b4ada] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              ▶ Open Stremio
            </a>

            <a 
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 bg-[#E50914] hover:bg-[#b80710] text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              🔴 Open YouTube Trailer
            </a>
            
            <button 
              onClick={onClose}
              className="w-full py-3 px-4 mt-2 text-gray-400 hover:text-white font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
