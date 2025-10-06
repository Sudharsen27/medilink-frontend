import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Heart } from 'lucide-react';
import { loginUser } from '../api/auth';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Both fields are required.');
      return;
    }
    
    try {
      setLoading(true);
      const response = await loginUser(form);
      
      // Save token + user (with role)
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Update React state (parent App)
      onLogin(response.data.user);
      
      // Redirect to appointments
      navigate('/appointments');
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 lg:py-0">
        <div className="flex flex-col lg:flex-row min-h-screen lg:items-center">
          
          {/* Left Side - Form Section */}
          <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md">
              
              {/* Logo/Brand Section - Mobile */}
              <div className="text-center mb-8 lg:hidden">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">MediLink</h1>
                <p className="text-gray-600 mt-2">Your Healthcare Partner</p>
              </div>

              {/* Form Card */}
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                
                {/* Desktop Logo/Title */}
                <div className="hidden lg:block text-center mb-6">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mb-3 shadow-lg">
                    <Heart className="w-7 h-7 text-white" fill="white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
                  <p className="text-gray-600 mt-2">Sign in to continue to MediLink</p>
                </div>

                {/* Mobile Title */}
                <div className="lg:hidden text-center">
                  <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
                  <p className="text-gray-600 mt-1 text-sm">Sign in to your account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  {/* Email Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        placeholder="doctor@medilink.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember & Forgot */}
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-2 text-gray-600">Remember me</span>
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-green-600 hover:text-green-700 font-medium transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <Link
                      to="/register"
                      className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </p>
                </div>
              </div>

              {/* Footer Links - Mobile */}
              <div className="mt-6 text-center text-sm text-gray-600 lg:hidden">
                <Link to="/privacy" className="hover:text-green-600 transition-colors">Privacy Policy</Link>
                <span className="mx-2">•</span>
                <Link to="/terms" className="hover:text-green-600 transition-colors">Terms of Service</Link>
              </div>
            </div>
          </div>

          {/* Right Side - Image/Branding Section - Desktop Only */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
            <div className="relative w-full max-w-xl">
              
              {/* Background Decorations */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
              
              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl">
                <img
                  src="/Images/doctorlogin.png"
                  alt="Healthcare Professional"
                  className="w-full h-auto rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    // Create fallback content
                    const fallback = document.createElement('div');
                    fallback.className = 'flex flex-col items-center justify-center h-96 text-center';
                    fallback.innerHTML = `
                      <div class="w-24 h-24 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mb-6">
                        <svg class="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                        </svg>
                      </div>
                      <h3 class="text-2xl font-bold text-gray-800 mb-3">Welcome to MediLink</h3>
                      <p class="text-gray-600 max-w-sm">Your trusted healthcare platform connecting patients with quality medical care</p>
                    `;
                    e.target.parentElement.appendChild(fallback);
                  }}
                />
                
                {/* Features List */}
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">24/7 Healthcare Access</h4>
                      <p className="text-sm text-gray-600">Connect with doctors anytime, anywhere</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Secure & Private</h4>
                      <p className="text-sm text-gray-600">Your health data is encrypted and protected</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">Easy Appointment Booking</h4>
                      <p className="text-sm text-gray-600">Book and manage appointments with ease</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;