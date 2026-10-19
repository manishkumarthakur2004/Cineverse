import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/common/AuthContainer';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        navigate('/');
      }, 1000);
    } catch (err) {
      setApiError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleGuestLogin = () => {
    navigate('/');
  };

  return (
    <AuthContainer
      title="Welcome Back"
      subtitle="Sign in to your CineVerse account to continue watching"
    >
      {isSubmitted && (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm text-center font-medium animate-fade-in">
          ✓ Signed in successfully! Redirecting...
        </div>
      )}
      
      {apiError && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-fade-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {/* Email Input */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            className={`w-full px-4 py-3 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Password
            </label>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            className={`w-full px-4 py-3 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
              errors.password
                ? 'border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
            }`}
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#b80710] text-white font-semibold py-3.5 rounded-xl shadow-lg transition-all transform active:scale-98 cursor-pointer"
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full bg-white/5 hover:bg-white/10 text-gray-300 font-medium py-3 rounded-xl border border-white/10 transition-colors cursor-pointer"
          >
            Continue as Guest
          </button>
        </div>

        {/* Footer Link to Signup */}
        <div className="pt-4 text-center border-t border-white/10 text-sm text-[#B3B3B3]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white font-semibold hover:text-[#E50914] underline transition-colors">
            Sign Up
          </Link>
        </div>
      </form>
    </AuthContainer>
  );
}
