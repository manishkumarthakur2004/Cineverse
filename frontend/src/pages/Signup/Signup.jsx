import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContainer from '../../components/common/AuthContainer';
import { useAuth } from '../../context/AuthContext';

export default function Signup() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [apiError, setApiError] = useState('');

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions';
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
      await register(formData.email, formData.password, formData.name, formData.username);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        navigate('/login');
      }, 1500);
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <AuthContainer
      title="Create Account"
      subtitle="Join CineVerse to stream thousands of movies and TV shows"
    >
      {isSubmitted && (
        <div className="mb-6 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 p-3 rounded-lg text-sm text-center font-medium animate-fade-in">
          ✓ Account created successfully! Redirecting to login...
        </div>
      )}
      
      {apiError && (
        <div className="mb-6 bg-red-500/20 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm text-center font-medium animate-fade-in">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Full Name Input */}
        <div className="space-y-1">
          <label htmlFor="name" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Manish"
            className={`w-full px-4 py-2.5 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
              errors.name
                ? 'border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
            }`}
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Username Input */}
        <div className="space-y-1">
          <label htmlFor="username" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Username
          </label>
          <input
            id="username"
            name="username"
            type="text"
            value={formData.username}
            onChange={handleChange}
            placeholder="manish123"
            className={`w-full px-4 py-2.5 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
              errors.username
                ? 'border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
            }`}
          />
          {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
        </div>

        {/* Email Input */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="manish@gmail.com"
            className={`w-full px-4 py-2.5 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
              errors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
            }`}
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Password Inputs in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Password Input */}
          <div className="space-y-1">
            <label htmlFor="password" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
              }`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password Input */}
          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-[#141414] text-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-white/10 focus:ring-[#E50914] focus:border-transparent'
              }`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        </div>

        {/* Terms & Conditions Checkbox */}
        <div className="pt-1">
          <label className="flex items-start gap-2 cursor-pointer text-xs text-[#B3B3B3] hover:text-white transition-colors">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-0.5 w-4 h-4 rounded border-white/20 text-[#E50914] focus:ring-[#E50914] bg-[#141414] accent-[#E50914]"
            />
            <span>
              I agree to the{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-white underline hover:text-[#E50914]">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" onClick={(e) => e.preventDefault()} className="text-white underline hover:text-[#E50914]">
                Privacy Policy
              </a>
            </span>
          </label>
          {errors.agreeTerms && <p className="text-red-500 text-xs mt-1">{errors.agreeTerms}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-[#E50914] hover:bg-[#b80710] text-white font-semibold py-3 rounded-xl shadow-lg transition-all transform active:scale-98 cursor-pointer"
          >
            Create Account
          </button>
        </div>

        {/* Footer Link to Login */}
        <div className="pt-3 text-center border-t border-white/10 text-sm text-[#B3B3B3]">
          Already have an account?{' '}
          <Link to="/login" className="text-white font-semibold hover:text-[#E50914] underline transition-colors">
            Login
          </Link>
        </div>
      </form>
    </AuthContainer>
  );
}
