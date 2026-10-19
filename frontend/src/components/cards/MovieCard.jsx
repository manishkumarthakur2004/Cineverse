import { Link } from 'react-router-dom';

export default function MovieCard({
  id = 1,
  title = 'Inception',
  poster = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop',
  rating = '8.8',
  year = '2010',
  genre = 'Sci-Fi',
}) {
  return (
    <div className="group relative w-[150px] sm:w-[180px] lg:w-[220px] rounded-2xl overflow-hidden bg-[#1F1F1F] border border-white/5 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 hover:shadow-2xl hover:shadow-[#E50914]/15 flex flex-col cursor-pointer">
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#141414]">
        <img
          src={poster && poster !== 'N/A' ? poster : 'https://via.placeholder.com/300x450?text=No+Poster'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* IMDb Rating Badge (Remains visible always) */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-[#141414]/90 backdrop-blur-md border border-white/10 px-2.5 py-0.5 rounded-lg text-xs font-extrabold text-yellow-400 shadow-lg">
          <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          <span>{rating || 'N/A'}</span>
        </div>

        {/* Hover Overlay with Action Buttons */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] via-[#141414]/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3.5 z-10">
          <div className="flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {/* Trailer Action Button (UI Only) */}
            <button
              type="button"
              className="bg-[#E50914] hover:bg-[#b80710] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 shadow-md transition-colors cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span>Trailer</span>
            </button>

            {/* Details Action Button */}
            <Link
              to={`/movie/${id}`}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1 border border-white/20 transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
              <span>Details</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="p-3.5 flex flex-col justify-between flex-1 bg-[#1F1F1F]">
        <h3 className="text-white text-sm sm:text-base font-bold truncate group-hover:text-[#E50914] transition-colors leading-tight">
          {title}
        </h3>
        <div className="flex items-center justify-between text-xs text-[#B3B3B3] mt-2">
          <span>{year}</span>
          <span className="bg-white/10 px-2.5 py-0.5 rounded-md text-[10px] uppercase font-extrabold text-gray-300">
            {genre}
          </span>
        </div>
      </div>
    </div>
  );
}
