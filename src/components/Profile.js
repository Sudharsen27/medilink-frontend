// Profile.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile({ user }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [msg, setMsg] = useState('');

  // Backend base URL
  const API_URL = "http://localhost:5000"; // 🔑 adjust if your backend runs on another port

  // Fetch user profile when component loads
  useEffect(() => {
    if (!user) return;
    axios
      .get(`${API_URL}/api/users/${user.id}`)
      .then((res) => setForm(res.data))
      .catch((err) => console.error('Error fetching profile:', err));
  }, [user]);

  // Handle form input changes
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Save updated profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/users/${user.id}`, {
        name: form.name,
        phone: form.phone,
      });
      setMsg('✅ Profile saved successfully');

      // Update localStorage with new name
      const updated = { ...user, name: form.name };
      localStorage.setItem('user', JSON.stringify(updated));
    } catch (err) {
      console.error('Error saving profile:', err);
      setMsg('❌ Error updating profile');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="email"
          name="email"
          value={form.email}
          disabled
          className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
        />

        <input
          type="text"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save
        </button>

        {msg && (
          <div className="text-center text-sm text-gray-700 mt-2">{msg}</div>
        )}
      </form>
    </div>
  );
}
