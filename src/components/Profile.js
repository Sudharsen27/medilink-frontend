// // Profile.js
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Profile({ user }) {
//   const [form, setForm] = useState({ name: '', email: '', phone: '' });
//   const [msg, setMsg] = useState('');

//   // Backend base URL
//   const API_URL = "http://localhost:5000"; // 🔑 adjust if your backend runs on another port

//   // Fetch user profile when component loads
//   useEffect(() => {
//     if (!user) return;
//     axios
//       .get(`${API_URL}/api/users/${user.id}`)
//       .then((res) => setForm(res.data))
//       .catch((err) => console.error('Error fetching profile:', err));
//   }, [user]);

//   // Handle form input changess
//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   // Save updated profile
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API_URL}/api/users/${user.id}`, {
//         name: form.name,
//         phone: form.phone,
//       });
//       setMsg('✅ Profile saved successfully');

//       // Update localStorage with new name
//       const updated = { ...user, name: form.name };
//       localStorage.setItem('user', JSON.stringify(updated));
//     } catch (err) {
//       console.error('Error saving profile:', err);
//       setMsg('❌ Error updating profile');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <input
//           type="email"
//           name="email"
//           value={form.email}
//           disabled
//           className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
//         />

//         <input
//           type="text"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Save
//         </button>

//         {msg && (
//           <div className="text-center text-sm text-gray-700 mt-2">{msg}</div>
//         )}
//       </form>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Profile({ user, setUser }) {
//   const [form, setForm] = useState({ name: '', email: '', phone: '' });
//   const [msg, setMsg] = useState('');

//   const API_URL = "http://localhost:5000";

//   useEffect(() => {
//     if (!user) return;
//     axios
//       .get(`${API_URL}/api/users/${user.id}`)
//       .then((res) => setForm(res.data))
//       .catch((err) => console.error('Error fetching profile:', err));
//   }, [user]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.put(`${API_URL}/api/users/${user.id}`, {
//         name: form.name,
//         phone: form.phone,
//       });
//       setMsg('✅ Profile saved successfully');

//       const updated = { ...user, name: form.name };
//       localStorage.setItem('user', JSON.stringify(updated));
//       setUser(updated); // ✅ instantly update Navbar
//     } catch (err) {
//       console.error('Error saving profile:', err);
//       setMsg('❌ Error updating profile');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <input
//           type="email"
//           name="email"
//           value={form.email}
//           disabled
//           className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
//         />

//         <input
//           type="text"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Save
//         </button>

//         {msg && (
//           <div className="text-center text-sm text-gray-700 mt-2">{msg}</div>
//         )}
//       </form>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Profile({ user, setUser }) {
//   const [form, setForm] = useState({ name: '', email: '', phone: '' });
//   const [photo, setPhoto] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [msg, setMsg] = useState('');

//   const API_URL = "http://localhost:5000";

//   useEffect(() => {
//     if (!user) return;
//     axios
//       .get(`${API_URL}/api/users/${user.id}`)
//       .then((res) => {
//         setForm(res.data);
//         if (res.data.photo) setPreview(`${API_URL}/uploads/${res.data.photo}`);
//       })
//       .catch((err) => console.error('Error fetching profile:', err));
//   }, [user]);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setPhoto(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('phone', form.phone);
//     if (photo) formData.append('photo', photo);

//     try {
//       const res = await axios.put(`${API_URL}/api/users/${user.id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       setMsg('✅ Profile updated successfully');

//       const updated = { ...user, name: res.data.name, photo: res.data.photo };
//       localStorage.setItem('user', JSON.stringify(updated));
//       setUser(updated);
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setMsg('❌ Error updating profile');
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
//       <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile</h2>
//       <form onSubmit={handleSubmit} className="space-y-3">
//         <div className="flex flex-col items-center">
//           {preview ? (
//             <img
//               src={preview}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover mb-3"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
//               <span className="text-gray-500 text-sm">No Photo</span>
//             </div>
//           )}
//           <input type="file" accept="image/*" onChange={handlePhotoChange} />
//         </div>

//         <input
//           type="text"
//           name="name"
//           value={form.name}
//           onChange={handleChange}
//           placeholder="Name"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <input
//           type="email"
//           name="email"
//           value={form.email}
//           disabled
//           className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
//         />

//         <input
//           type="text"
//           name="phone"
//           value={form.phone}
//           onChange={handleChange}
//           placeholder="Phone"
//           className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
//         />

//         <button
//           type="submit"
//           className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//         >
//           Save
//         </button>

//         {msg && (
//           <div className="text-center text-sm text-gray-700 mt-2">{msg}</div>
//         )}
//       </form>
//     </div>
//   );
// }

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// export default function Profile({ user, setUser }) {
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     phone: ''
//   });
//   const [photo, setPhoto] = useState(null);
//   const [preview, setPreview] = useState('');
//   const [msg, setMsg] = useState('');
//   const [loading, setLoading] = useState(false);

//   const API_URL = 'http://localhost:5000';

//   // ✅ Fetch user profile on load
//   useEffect(() => {
//     if (!user) return;
//     setLoading(true);

//     axios
//       .get(`${API_URL}/api/users/${user.id}`)
//       .then((res) => {
//         const data = res.data || {};

//         // Ensure null fields are converted to empty strings
//         setForm({
//           name: data.name ?? '',
//           email: data.email ?? '',
//           phone: data.phone ?? ''
//         });

//         if (data.photo) {
//           setPreview(`${API_URL}/uploads/${data.photo}`);
//         }
//       })
//       .catch((err) => {
//         console.error('Error fetching profile:', err);
//         setMsg('❌ Error fetching profile details');
//       })
//       .finally(() => setLoading(false));
//   }, [user]);

//   // ✅ Handle input changes safely
//   const handleChange = (e) =>
//     setForm((prev) => ({ ...prev, [e.target.name]: e.target.value ?? '' }));

//   // ✅ Handle photo selection
//   const handlePhotoChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setPhoto(file);
//       setPreview(URL.createObjectURL(file));
//     }
//   };

//   // ✅ Submit form data
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user?.id) {
//       setMsg('❌ User not logged in.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('phone', form.phone);
//     if (photo) formData.append('photo', photo);

//     setLoading(true);
//     setMsg('');

//     try {
//       const res = await axios.put(`${API_URL}/api/users/${user.id}`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' }
//       });

//       const updatedUser = {
//         ...user,
//         name: res.data.name,
//         photo: res.data.photo
//       };

//       localStorage.setItem('user', JSON.stringify(updatedUser));
//       setUser(updatedUser);

//       setMsg('✅ Profile updated successfully!');
//     } catch (err) {
//       console.error('Error updating profile:', err);
//       setMsg('❌ Error updating profile. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-300">
//       <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
//         My Profile
//       </h2>

//       {loading && (
//         <div className="text-center text-blue-500 mb-3 animate-pulse">
//           Loading...
//         </div>
//       )}

//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Profile Photo */}
//         <div className="flex flex-col items-center">
//           {preview ? (
//             <img
//               src={preview}
//               alt="Profile"
//               className="w-24 h-24 rounded-full object-cover mb-3 shadow"
//             />
//           ) : (
//             <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
//               <span className="text-gray-500 text-sm">No Photo</span>
//             </div>
//           )}

//           <input
//             type="file"
//             accept="image/*"
//             onChange={handlePhotoChange}
//             className="text-sm text-gray-600 dark:text-gray-300"
//           />
//         </div>

//         {/* Name Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Full Name
//           </label>
//           <input
//             type="text"
//             name="name"
//             value={form.name ?? ''}
//             onChange={handleChange}
//             placeholder="Enter your name"
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
//           />
//         </div>

//         {/* Email Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Email
//           </label>
//           <input
//             type="email"
//             name="email"
//             value={form.email ?? ''}
//             disabled
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-400"
//           />
//         </div>

//         {/* Phone Field */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//             Phone Number
//           </label>
//           <input
//             type="text"
//             name="phone"
//             value={form.phone ?? ''}
//             onChange={handleChange}
//             placeholder="Enter your phone number"
//             className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
//           />
//         </div>

//         {/* Submit Button */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full px-4 py-2 rounded text-white font-medium transition ${
//             loading
//               ? 'bg-blue-400 cursor-not-allowed'
//               : 'bg-blue-600 hover:bg-blue-700'
//           }`}
//         >
//           {loading ? 'Saving...' : 'Save'}
//         </button>

//         {/* Message */}
//         {msg && (
//           <div
//             className={`text-center text-sm mt-3 ${
//               msg.includes('✅')
//                 ? 'text-green-600 dark:text-green-400'
//                 : 'text-red-600 dark:text-red-400'
//             }`}
//           >
//             {msg}
//           </div>
//         )}
//       </form>
//     </div>
//   );
// }

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExportButton from './ExportButton'; // ✅ Added

export default function Profile({ user, setUser }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const API_URL = 'http://localhost:5000';

  // ✅ Fetch user profile
  useEffect(() => {
    if (!user) return;
    setLoading(true);

    axios
      .get(`${API_URL}/api/users/${user.id}`)
      .then((res) => {
        const data = res.data || {};
        setForm({
          name: data.name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? ''
        });
        if (data.photo) {
          setPreview(`${API_URL}/uploads/${data.photo}`);
        }
      })
      .catch((err) => {
        console.error('Error fetching profile:', err);
        setMsg('❌ Error fetching profile details');
      })
      .finally(() => setLoading(false));
  }, [user]);

  // ✅ Handle input change
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value ?? '' }));

  // ✅ Handle photo change
  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✅ Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user?.id) {
      setMsg('❌ User not logged in.');
      return;
    }

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('phone', form.phone);
    if (photo) formData.append('photo', photo);

    setLoading(true);
    setMsg('');

    try {
      const res = await axios.put(`${API_URL}/api/users/${user.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const updatedUser = {
        ...user,
        name: res.data.name,
        photo: res.data.photo
      };

      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      setMsg('✅ Profile updated successfully!');
    } catch (err) {
      console.error('Error updating profile:', err);
      setMsg('❌ Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white dark:bg-gray-900 rounded-xl shadow-md transition-all duration-300">
      {/* ✅ Header with Export Button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Personal Information
        </h2>
        <ExportButton
          data={user}
          dataType="profile"
          variant="outline"
          size="small"
          showLabel={true}
        />
      </div>

      {loading && (
        <div className="text-center text-blue-500 mb-3 animate-pulse">
          Loading...
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3 shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-gray-500 text-sm">No Photo</span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="text-sm text-gray-600 dark:text-gray-300"
          />
        </div>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={form.name ?? ''}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email ?? ''}
            disabled
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-gray-100 dark:bg-gray-700 cursor-not-allowed dark:text-gray-400"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            type="text"
            name="phone"
            value={form.phone ?? ''}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-4 py-2 rounded text-white font-medium transition ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Saving...' : 'Save'}
        </button>

        {/* Message */}
        {msg && (
          <div
            className={`text-center text-sm mt-3 ${
              msg.includes('✅')
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
