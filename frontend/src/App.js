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
import Layout from './pages/Help/Layout'; // Import your Layout component

const App = () => {
  const RouterComponent = process.env.NODE_ENV === 'test' ? MemoryRouter : Router;

  return (
    <RouterComponent>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<Layout><About /></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/device-list" element={<Layout><ProtectedRoute><Devices /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/raspberrypi" element={<Layout><ProtectedRoute><RaspberryPi /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
      </Routes>
    </RouterComponent>
  );
};

export default App;
