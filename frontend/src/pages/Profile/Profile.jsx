import { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
    </div>
  );

  return (
    <div className="page-container text-white space-y-10">
      {/* 1. Profile Header & Action Buttons */}
      <div className="bg-[#1F1F1F]/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Avatar & User Details */}
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          <div className="relative">
            <img
              src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user?.fullName || 'U'}&background=E50914&color=fff&rounded=true&size=150`}
              alt={user.fullName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-[#E50914] shadow-xl"
            />
            <span className="absolute bottom-1 right-1 bg-emerald-500 w-5 h-5 rounded-full border-2 border-[#141414]" title="Active Member" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                {user.fullName}
              </h1>
            </div>
            <p className="text-sm font-semibold text-[#B3B3B3]">{user.email}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
          <button
            onClick={handleLogout}
            type="button"
            className="bg-[#E50914] hover:bg-[#b80710] text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
