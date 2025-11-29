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
import CreateCV from './pages/CreateCV';
import ErrorBoundary from './components/ErrorBoundary';


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
      // Artık username kontrolü yapıyoruz, token cookie'de
      const username = localStorage.getItem('username');

      if (username) {
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
          // Hata durumunda logout yapma, sadece logla
          // fetchUserData public endpoint, 401 dönmeyecektir
          // Eğer gerçekten bir sorun varsa, kullanıcı manuel olarak logout yapabilir
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

  const handleLogout = async () => {
    try {
      // Logout API çağrısı yap (cookie'leri temizlemek için)
      const { logoutUser } = await import('./server/api');
      await logoutUser();
    } catch (error) {
      console.error('Logout hatası:', error);
      // Hata durumunda da temizlik yap
      localStorage.removeItem('user');
      localStorage.removeItem('username');
      setIsLoggedIn(false);
      window.location.href = '/login';
    }
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
          <Route path="/profile-update" element={
            <ErrorBoundary>
              <ProfileEdit />
            </ErrorBoundary>
          } />
          <Route path="/:username" element={<Profile />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/edit-project/:projectId" element={<ProjectEdit />} />
          <Route path="/project/:projectId" element={<ProjectDetail />} />
          <Route path="/create-cv" element={<CreateCV />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
