import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4 from '@mui/icons-material/Brightness4';
import Brightness7 from '@mui/icons-material/Brightness7';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import GitHubCallback from './pages/GitHubCallback';
import DrawerMenu from './components/DrawerMenu';
import ProfileEdit from './pages/ProfileEdit';
import Profile from './pages/Profile';
import AddProject from './pages/AddProject';
import ProjectEdit from './pages/ProjectEdit';

import './App.css';
import Projects from './pages/Projects';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    // localStorage'dan tema tercihini al
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : false;
  });
  const [drawerOpen, setDrawerOpen] = useState(false); // Menü durumu
  const user = JSON.parse(localStorage.getItem('user')); // Kullanıcı bilgilerini al

  useEffect(() => {
    // Local storage'dan token'ı kontrol et
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    // Tema değiştiğinde localStorage'a kaydet ve body class'ını güncelle
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Menü açma/kapatma fonksiyonu
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('username');
    setIsLoggedIn(false);
    navigate('/login');
  };

  return (
    <div>
      <div className="header">
        <IconButton onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <IconButton onClick={toggleTheme}>
          {darkMode ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
      </div>
      <div className="app-container">
        <DrawerMenu open={drawerOpen} onClose={toggleDrawer} isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          <Route path="/callback" element={<GitHubCallback onLogin={handleLogin} />} />
          <Route path="/profile-update" element={<ProfileEdit />} />
          <Route path="/:username" element={<Profile />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/edit-project/:projectId" element={<ProjectEdit />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
