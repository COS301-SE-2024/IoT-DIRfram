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
import Layout from './pages/Help/Layout';
import EditProfile from './pages/Edit-Profile/EditProfile';
import PostsList from './components/Posts/PostsList';
import PostDetails from './components/Posts/PostDetails';
import ForgotPassword from './components/ForgotPassword/ForgotPassword';
import ResetPassword from './components/ForgotPassword/ResetPassword';
import './App.css';

const App = () => {
  const RouterComponent = process.env.NODE_ENV === 'test' ? MemoryRouter : Router;

  return (
    <RouterComponent>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<Layout><About /></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/dashboard" element={<Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/device-list" element={<Layout><ProtectedRoute><Devices /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/raspberrypi" element={<Layout><ProtectedRoute><RaspberryPi /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/profile" element={<Layout><ProtectedRoute><Profile /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/edit-profile" element={<Layout><ProtectedRoute><EditProfile /></ProtectedRoute></Layout>} />
        <Route path="/settings" element={<Layout><ProtectedRoute><Settings /></ProtectedRoute></Layout>} /> {/* Wrapped with Layout */}
        <Route path="/postslist" element={<Layout><ProtectedRoute><PostsList /></ProtectedRoute></Layout>} />
        <Route path="/posts/:postId" element={<Layout><ProtectedRoute><PostDetails /></ProtectedRoute></Layout>} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} /> {/* New route for reset password */}
      </Routes>
    </RouterComponent>
  );
};

export default App;