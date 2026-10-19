import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page-container min-h-[65vh] flex flex-col items-center justify-center text-center space-y-4">
      <h1 className="text-8xl font-black text-[#E50914] tracking-widest">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-white">Page Not Found</h2>
      <p className="text-[#B3B3B3] max-w-md text-sm sm:text-base">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-[#E50914] hover:bg-[#b80710] text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all transform hover:scale-105 cursor-pointer"
      >
        Back to Home
      </Link>
    </div>
  );
}
