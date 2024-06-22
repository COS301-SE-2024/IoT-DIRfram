import React from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash/Splash';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import About from './pages/About/About';
import Dashboard from './pages/Dashboard/Dashboard';
import Devices from './pages/Device-list/Device-list';
import RaspberryPi from './pages/RaspberryPi/RaspberryPi';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

const App = () => {
  const RouterComponent = process.env.NODE_ENV === 'test' ? MemoryRouter : Router;

  return (
    <RouterComponent>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/device-list" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
        <Route path="/raspberrypi" element={<ProtectedRoute><RaspberryPi /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </RouterComponent>
  );
};

export default App;
