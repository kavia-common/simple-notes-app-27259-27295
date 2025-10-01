import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './App.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
    {/* Hidden live region for any global announcements if needed */}
    <div id="aria-live" className="visually-hidden" aria-live="polite" aria-atomic="true" />
  </React.StrictMode>
);
