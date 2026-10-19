import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Footer from '../components/footer/Footer';

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[#141414] text-white selection:bg-[#E50914] selection:text-white">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
