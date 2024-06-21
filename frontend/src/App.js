// App.js

import React from 'react';
import { BrowserRouter as Router, MemoryRouter, Routes, Route } from 'react-router-dom';
import Splash from './pages/Splash/Splash';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import About from './pages/About/About';
import Dashboard from './pages/Dashboard/Dashboard';
import DeviceList from './pages/Device-list/Device-list';
import RaspberryPi from './pages/RaspberryPi/RaspberryPi';
import Profile from './pages/Profile/Profile';
import Settings from './pages/Settings/Settings';

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/device-list" element={<DeviceList />} />
        <Route path="/raspberrypi" element={<RaspberryPi />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </RouterComponent>
  );
};

export default App;
