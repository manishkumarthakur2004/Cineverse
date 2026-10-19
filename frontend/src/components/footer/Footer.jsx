import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv-shows' },
    { name: 'Search', path: '/search' },
    { name: 'Favorites', path: '/favorites' },
    { name: 'Watchlist', path: '/watchlist' },
  ];

  const resources = [
    { name: 'About', path: '#' },
    { name: 'Privacy Policy', path: '#' },
    { name: 'Terms of Service', path: '#' },
    { name: 'Contact', path: '#' },
  ];

  return (
    <footer className="bg-[#141414] border-t border-white/10 text-[#B3B3B3] pt-8 pb-4 mt-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 space-y-4">
        {/* Main Footer Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Brand Logo & Description */}
          <div className="space-y-4">
            <Link
              to="/"
              className="inline-block text-2xl sm:text-3xl font-black tracking-wider text-[#E50914] uppercase hover:scale-105 transition-transform"
            >
              Cine<span className="text-white">Verse</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm text-gray-400">
              CineVerse is a Movie Discovery Platform where users can explore movies, TV shows, ratings, reviews and official trailers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="hover:text-white hover:underline transition-all duration-300 py-0.5 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2 text-sm">
              {resources.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    onClick={(e) => e.preventDefault()}
                    className="hover:text-white hover:underline transition-all duration-300 py-0.5 inline-block"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Icons */}
          <div className="space-y-4">
            <h4 className="text-white text-sm font-bold uppercase tracking-wider">
              Connect With Us
            </h4>
            <div className="flex items-center space-x-3 pt-1">
              {/* GitHub */}
              <a
                href="https://github.com/manishkumarthakur2004"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1F1F1F] hover:bg-[#E50914] text-white flex items-center justify-center border border-white/10 transition-all hover:scale-110"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/manish-thakur2004/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1F1F1F] hover:bg-[#E50914] text-white flex items-center justify-center border border-white/10 transition-all hover:scale-110"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>

              {/* Twitter (X) */}
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 rounded-full bg-[#1F1F1F] hover:bg-[#E50914] text-white flex items-center justify-center border border-white/10 transition-all hover:scale-110"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/alrightmanish/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#1F1F1F] hover:bg-[#E50914] text-white flex items-center justify-center border border-white/10 transition-all hover:scale-110"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-gray-500">
          <p>© {currentYear} CineVerse. All rights reserved.</p>
          <p className="flex items-center gap-1 font-medium text-gray-400">
            Made with <span className="text-[#E50914] text-base">❤️</span> using React + Spring Boot
          </p>
        </div>
      </div>
    </footer>
  );
}
