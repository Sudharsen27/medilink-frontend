// // index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css'; // Tailwind or global styles
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import { BrowserRouter } from 'react-router-dom';

// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <App />
//     </BrowserRouter>
//   </React.StrictMode>
// );

// // Optional: Measure performance
// reportWebVitals();

// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Tailwind or global styles
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

// ✅ Patch for QuillBot or injected script errors (if any)
if (!window.updateCopyPasteInfo) {
  window.updateCopyPasteInfo = function () {
    // Prevent extension script errors (e.g., QuillBot)
    return;
  };
}

// ✅ Create root element (React 18+)
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// ✅ Optional: Measure app performance
reportWebVitals();
