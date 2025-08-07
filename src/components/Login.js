import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { Link } from 'react-router-dom';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.email || !form.password) {
      setError('Both fields are required.');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(form);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.user);
    } catch (err) {
      const message = err.response?.data?.error || 'Invalid credentials';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row ">
      {/* Left Side: Login Form */}
      <div className="flex items-center justify-center w-full md:w-1/2 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md space-y-6"
        >
          <h2 className="text-3xl font-bold text-center text-green-700">Medilink Login</h2>

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Password */}
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* Error Message */}
          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md transition-colors duration-300 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600">
            New user?{' '}
            <Link to="/register" className="text-green-600 hover:underline">
              Register here
            </Link>
          </p>
        </form>
      </div>

      {/* Right Side: Image */}
      <div className="hidden md:block w-full md:w-1/2">
        <img
          src="/Images/doctorlogin.png"
          alt="Doctor login"
          className="w-full h-full object-cover"
          onError={(e) => (e.target.style.display = 'none')} // Hide if not found
        />
      </div>
    </div>
  );
}

export default Login;
