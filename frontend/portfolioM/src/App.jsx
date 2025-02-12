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
import ProjectDetail from './pages/ProjectDetail';

import './App.css';
import Projects from './pages/Projects';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user')); // Kullanıcı bilgilerini al

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (token && username) {
        setIsLoggedIn(true);
        try {
          const response = await fetchUserData(username);
          const userData = response.data;
          
          // Profil bilgilerinin boş olup olmadığını kontrol et
          const isProfileEmpty = !userData.university && 
                               !userData.job && 
                               !userData.area && 
                               !userData.aboutMe && 
                               (!userData.skills || Object.keys(userData.skills).length === 0);

          if (isProfileEmpty) {
            navigate('/profile-update');
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
          if (error.message === 'Kullanıcı bilgileri alınamadı') {
            handleLogout(); // Token geçersizse çıkış yap
          }
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkUserProfile();
  }, [navigate]);

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
    window.location.reload(); // Sayfayı yenile
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
          <Route path="/project/:projectId" element={<ProjectDetail />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
