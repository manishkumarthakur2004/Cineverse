import { useState, useEffect } from 'react';
import SectionHeader from '../../components/common/SectionHeader';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Reviews() {
  const { isAuthenticated } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.get('/users/reviews');
        if (response.data.success) {
          setReviews(response.data.data);
        }
      } catch (err) {
        // Handled via setError
        setError("Failed to load reviews.");
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [isAuthenticated]);

  if (loading) return (
    <div className="flex justify-center items-center h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E50914]"></div>
    </div>
  );

  if (!isAuthenticated) return (
    <div className="text-center text-white py-32 text-2xl font-bold">Please login to view your reviews.</div>
  );

  if (error) return (
    <div className="text-center text-white py-32 text-xl font-bold">{error}</div>
  );

  return (
    <div className="page-container space-y-8">
      <SectionHeader
        title="My Reviews"
        subtitle="Recent reviews and ratings you submitted"
        count={reviews.length}
      />
      {reviews && reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-[#1F1F1F] p-6 rounded-2xl border border-white/10 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between text-sm text-[#B3B3B3]">
                <span className="font-bold text-white text-base">IMDb ID: {review.imdbId}</span>
              </div>
              <div className="flex items-center text-yellow-400 text-sm">
                {'★'.repeat(Math.round(review.rating / 2))}
                <span className="text-gray-400 ml-2">{review.rating}/10</span>
              </div>
              <p className="text-gray-300 text-sm italic leading-relaxed">"{review.comment}"</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto bg-[#1F1F1F]/40 border border-white/5 rounded-2xl p-8 shadow-xl">
          <div className="text-5xl">✍️</div>
          <h3 className="text-xl font-bold text-white">No reviews yet.</h3>
          <p className="text-sm text-[#B3B3B3]">
            Start reviewing movies to see them appear here.
          </p>
        </div>
      )}
    </div>
  );
}
