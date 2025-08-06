// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import { fetchAppointments } from './api/appointments';

function App() {
  const [appointments, setAppointments] = useState([]);

  const loadAppointments = async () => {
    const response = await fetchAppointments();
    setAppointments(response.data);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleAdd = (newApp) => {
    setAppointments(prev => [...prev, newApp]);
  };

  return (
    <div className="App">
      <h1>Medilink Appointment System</h1>
      <AppointmentForm onAdd={handleAdd} />
      <AppointmentList appointments={appointments} />
    </div>
  );
}

export default App;
