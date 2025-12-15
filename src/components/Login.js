


// // src/components/Login.js
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Heart } from 'lucide-react';
// import LoadingSpinner from './LoadingSpinner';

// const Login = ({ onLogin }) => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     setError('');
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('/api/auth/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       // ✅ FIX: Support both backend token formats
//       const token =
//         data.token ||
//         (data.data && data.data.token);

//       if (!token) {
//         throw new Error("Authentication failed: No token received");
//       }

//       // ✅ Store token correctly
//       localStorage.setItem('token', token);

//       // ✅ Store user
//       const userData = data.user || (data.data && data.data.user);
//       localStorage.setItem('user', JSON.stringify(userData));

//       // ✅ Notify App
//       onLogin(userData);

//       // ✅ Redirect properly
//       navigate('/dashboard');

//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
//       <div className="container mx-auto px-4 py-6 lg:py-0">
//         <div className="flex flex-col lg:flex-row min-h-screen lg:items-center">

//           {/* Left Side - Form Section */}
//           <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-12">
//             <div className="w-full max-w-md">

//               {/* Logo/Brand Section - Mobile */}
//               <div className="text-center mb-8 lg:hidden">
//                 <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mb-4 shadow-lg">
//                   <Heart className="w-8 h-8 text-white" fill="white" />
//                 </div>
//                 <h1 className="text-3xl font-bold text-gray-800">MediLink</h1>
//                 <p className="text-gray-600 mt-2">Your Healthcare Partner</p>
//               </div>

//               {/* Form Card */}
//               <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

//                 {/* Desktop Logo/Title */}
//                 <div className="hidden lg:block text-center mb-6">
//                   <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl mb-3 shadow-lg">
//                     <Heart className="w-7 h-7 text-white" fill="white" />
//                   </div>
//                   <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
//                   <p className="text-gray-600 mt-2">Sign in to continue to MediLink</p>
//                 </div>

//                 {/* Mobile Title */}
//                 <div className="lg:hidden text-center">
//                   <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
//                   <p className="text-gray-600 mt-1 text-sm">Sign in to your account</p>
//                 </div>

//                 {/* Form */}
//                 <form onSubmit={handleSubmit} className="space-y-5">

//                   {/* Email Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Email Address
//                     </label>
//                     <div className="relative">
//                       <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         name="email"
//                         type="email"
//                         placeholder="doctor@medilink.com"
//                         value={formData.email}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                         className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//                       />
//                     </div>
//                   </div>

//                   {/* Password Input */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Password
//                     </label>
//                     <div className="relative">
//                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//                       <input
//                         name="password"
//                         type={showPassword ? 'text' : 'password'}
//                         placeholder="••••••••"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                         className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="w-5 h-5" />
//                         ) : (
//                           <Eye className="w-5 h-5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   {/* Error Message */}
//                   {error && (
//                     <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//                       {error}
//                     </div>
//                   )}

//                   {/* Submit Button */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
//                   >
//                     {loading ? (
//                       <LoadingSpinner size="sm" text="Signing in..." />
//                     ) : (
//                       <>
//                         <LogIn className="w-5 h-5" />
//                         Sign In
//                       </>
//                     )}
//                   </button>
//                 </form>

//                 {/* Divider */}
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300"></div>
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-4 bg-white text-gray-500">or</span>
//                   </div>
//                 </div>

//                 {/* Register Link */}
//                 <div className="text-center">
//                   <p className="text-gray-600 text-sm">
//                     Don't have an account?{' '}
//                     <Link
//                       to="/register"
//                       className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center gap-1 transition-colors"
//                     >
//                       Create Account
//                       <ArrowRight className="w-4 h-4" />
//                     </Link>
//                   </p>
//                 </div>
//               </div>

//               {/* Footer Links - Mobile */}
//               <div className="mt-6 text-center text-sm text-gray-600 lg:hidden">
//                 <Link to="/privacy" className="hover:text-green-600 transition-colors">
//                   Privacy Policy
//                 </Link>
//                 <span className="mx-2">•</span>
//                 <Link to="/terms" className="hover:text-green-600 transition-colors">
//                   Terms of Service
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* Right Side - Image Section */}
//           <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
//             <div className="relative w-full max-w-xl">
//               <div className="absolute top-0 left-0 w-32 h-32 bg-green-200 rounded-full opacity-20 blur-3xl"></div>
//               <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>

//               <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-3xl p-8 shadow-2xl">
//                 <img
//                   src="/Images/doctorlogin.png"
//                   alt="Healthcare Professional"
//                   className="w-full h-auto rounded-2xl shadow-lg"
//                 />

//                 <div className="mt-8 space-y-4">
//                   {[
//                     {
//                       title: '24/7 Healthcare Access',
//                       desc: 'Connect with doctors anytime, anywhere',
//                     },
//                     {
//                       title: 'Secure & Private',
//                       desc: 'Your health data is encrypted and protected',
//                     },
//                     {
//                       title: 'Easy Appointment Booking',
//                       desc: 'Book and manage appointments with ease',
//                     },
//                   ].map((item, idx) => (
//                     <div key={idx} className="flex items-start gap-3">
//                       <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <svg
//                           className="w-5 h-5 text-white"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth="2"
//                             d="M5 13l4 4L19 7"
//                           />
//                         </svg>
//                       </div>
//                       <div>
//                         <h4 className="font-semibold text-gray-800">{item.title}</h4>
//                         <p className="text-sm text-gray-600">{item.desc}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;


// src/components/Login.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight, Heart } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import { loginUser } from '../api/auth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ------------------------------------------
  // Handle form input
  // ------------------------------------------
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // ------------------------------------------
  // Handle login submit
  // ------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 🔥 Use loginUser() API (Axios)
      const data = await loginUser(formData);

      // Backend returns: { success, message, token, user }
      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Save token
      localStorage.setItem('token', data.token);

      // Save user
      localStorage.setItem('user', JSON.stringify(data.user));

      // Notify parent / app state
      onLogin(data.user);

      // Redirect
      navigate('/dashboard');

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Login failed. Please try again.';

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-6 lg:py-0">
        <div className="flex flex-col lg:flex-row min-h-screen lg:items-center">

          {/* LEFT SIDE - Form */}
          <div className="w-full lg:w-1/2 flex items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-md">

              {/* Mobile Logo */}
              <div className="text-center mb-8 lg:hidden">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-600 to-green-700 rounded-2xl mb-4 shadow-lg">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">MediLink</h1>
                <p className="text-gray-600 mt-2">Your Healthcare Partner</p>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">

                {/* Desktop Title */}
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

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="email"
                        type="email"
                        placeholder="doctor@medilink.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-lg"
                  >
                    {loading ? (
                      <LoadingSpinner size="sm" text="Signing in..." />
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        Sign In
                      </>
                    )}
                  </button>
                </form>

                {/* Divider */}
                <div className="relative my-4">
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
                    Don't have an account?{" "}
                    <Link
                      to="/register"
                      className="text-green-600 hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
            <img
              src="/Images/doctorlogin.png"
              alt="Doctor Login"
              className="rounded-3xl shadow-2xl"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
