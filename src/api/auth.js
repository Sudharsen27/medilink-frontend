// import axios from 'axios';

// const API = 'http://localhost:5000/api/auth';

// export const registerUser = (userData) => axios.post(`${API}/register`, userData);
// export const loginUser = (userData) => axios.post(`${API}/login`, userData);


// api/auth.js
import axios from 'axios';

const API = 'http://localhost:5000/api/auth';

// --------------------------------------------
// REGISTER USER (returns backend JSON only)
// --------------------------------------------
export const registerUser = async (userData) => {
  const res = await axios.post(`${API}/register`, userData);
  return res.data; // IMPORTANT: return only backend JSON
};

// --------------------------------------------
// LOGIN USER
// --------------------------------------------
export const loginUser = async (userData) => {
  const res = await axios.post(`${API}/login`, userData);
  return res.data; // { success, message, token, user }
};
