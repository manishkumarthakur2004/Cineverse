import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home/Home';
import Movies from '../pages/Movies/Movies';
import TVShows from '../pages/TVShows/TVShows';
import MovieDetails from '../pages/MovieDetails/MovieDetails';
import Search from '../pages/Search/Search';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import Profile from '../pages/Profile/Profile';
import Favorites from '../pages/Favorites/Favorites';
import Watchlist from '../pages/Watchlist/Watchlist';
import Reviews from '../pages/Reviews/Reviews';
import NotFound from '../pages/NotFound/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
