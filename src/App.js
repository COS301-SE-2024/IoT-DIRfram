// App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash/Splash';
import Dashboard from './pages/Dashboard/Dashboard';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />

        <Route path="/splash" element={<Splash />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

const NotFound = () => (
  <div>
    <h2>404 Not Found</h2>
    <p>Oops! Page not found.</p>
  </div>
);

export default App;
