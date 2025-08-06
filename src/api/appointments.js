import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/appointments'
});

export const fetchAppointments = () => API.get('/');
export const createAppointment = (appointment) => API.post('/', appointment);
