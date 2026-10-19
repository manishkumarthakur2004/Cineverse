import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Search', path: '/search' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Watchlist', path: '/watchlist' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex items-center h-[72px] sm:h-20 ${
        isScrolled
          ? 'bg-[#141414]/90 backdrop-blur-md border-b border-white/5 shadow-2xl'
          : 'bg-gradient-to-b from-black/90 via-black/30 to-transparent'
      }`}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl sm:text-3xl font-black tracking-wider text-[#E50914] uppercase hover:scale-105 transition-transform"
          >
            Cine<span className="text-white">Verse</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `transition-all duration-300 py-1.5 relative hover:text-white ${
                    isActive
                      ? 'text-white font-bold after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-[#E50914] after:rounded-full'
                      : 'text-[#B3B3B3]'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
                >
                  <img src={user?.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=E50914&color=fff&rounded=true`} alt="Profile" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                  <span className="text-sm font-semibold text-white">{user?.fullName?.split(' ')[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-[#B3B3B3] hover:text-white text-sm font-semibold transition-all px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#B3B3B3] hover:text-white text-sm font-semibold transition-all px-4 py-2 border border-white/10 hover:border-white/30 rounded-xl cursor-pointer"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-[#E50914] hover:bg-[#b80710] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-red-900/30 hover:scale-105 active:scale-95 cursor-pointer"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger Menu Toggle */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="text-[#B3B3B3] hover:text-white focus:outline-none p-2 rounded-lg"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 pb-6 border-t border-white/10 flex flex-col space-y-3 bg-[#1F1F1F]/95 backdrop-blur-lg rounded-xl px-5 py-4 shadow-xl">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `block text-base font-medium py-2 px-3 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white bg-[#E50914]/20 border-l-4 border-[#E50914]'
                      : 'text-[#B3B3B3] hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 border-t border-white/10 flex flex-col space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 rounded-lg transition-all"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-red-900/50 hover:bg-red-900/80 rounded-lg transition-all"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2 text-sm font-medium text-[#B3B3B3] hover:text-white bg-white/5 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-2 text-sm font-semibold text-white bg-[#E50914] hover:bg-[#b80710] rounded-lg transition-all shadow-md"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
