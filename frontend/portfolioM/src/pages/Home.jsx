import React, { useState, useEffect } from 'react';
import SearchBar from '../components/SearchBar';
import './Home.css';
import { motion } from 'framer-motion';
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../server/api';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import CelebrationIcon from '@mui/icons-material/Celebration';

const Home = () => {
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfile = async () => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');

      if (!token || !username) {
        setShowLoginAlert(true);
        return;
      }

      try {
        const response = await fetchUserData(username);
        const userData = response.data;

        const isNewProfile = !(
          userData.name &&
          userData.surname &&
          userData.university &&
          userData.job &&
          userData.area &&
          userData.aboutMe &&
          Object.keys(userData.skills || {}).length > 0
        );

        setShowWelcomeAlert(isNewProfile);
        setUserData(userData);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    };

    checkUserProfile();
  }, []);

  const handlePortfolioClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/' + localStorage.getItem('username'));
  };

  return (
    <div className="home-container">
      {showLoginAlert && (
        <div className="welcome-alert-overlay">
          <div className="welcome-alert">
            <div className="alert-content">
              <h3><WavingHandIcon /> Portfoliom.dev'e Hoş Geldiniz!</h3>
              <p>
                Projelerinizi sergilemek ve profesyonel CV'nizi oluşturmak için
                hemen giriş yapın.
              </p>
              <div className="alert-buttons">
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate('/login')}
                >
                  Giriş Yap
                </button>
                <button
                  className="add-project-btn"
                  onClick={() => navigate('/register')}
                >
                  Kayıt Ol
                </button>
                <button
                  className="dismiss-btn"
                  onClick={() => setShowLoginAlert(false)}
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWelcomeAlert && (
        <div className="welcome-alert-overlay">
          <div className="welcome-alert">
            <div className="alert-content">
              <h3><CelebrationIcon /> Portfoliom.dev'ye Hoş Geldiniz!</h3>
              <p>
                Profesyonel profilinizi oluşturmak ve projelerinizi sergilemek için
                hemen başlayın.
              </p>
              <div className="alert-buttons">
                <button
                  className="edit-profile-btn"
                  onClick={() => navigate('/profile-update')}
                >
                  Profili Düzenle
                </button>
                <button
                  className="add-project-btn"
                  onClick={() => navigate('/add-project')}
                >
                  Proje Ekle
                </button>
                <button
                  className="dismiss-btn"
                  onClick={() => setShowWelcomeAlert(false)}
                >
                  Daha Sonra
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <motion.div
        className="hero-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="logo-container">
          <div className="logo">
            <CodeIcon className="logo-icon" />
            <span>PortfolioM</span>
          </div>
        </div>

        <h1 className="main-title">
          Yazılımcılar İçin <span className="highlight">Profesyonel Portföy Platformu</span>
        </h1>

        <p className="subtitle">
          Projelerinizi sergileyin, profesyonel CV'nizi oluşturun ve yazılım dünyasında fark yaratın
        </p>

        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
          <SearchBar />
        </div>

        <div className="features">
          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <CodeIcon className="feature-icon" />
            <h3>Projeleri Keşfet</h3>
            <p>Binlerce geliştirici ve projeyi keşfedin</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <DescriptionIcon className="feature-icon" />
            <h3>CV Oluştur</h3>
            <p>Yeteneklerinizi öne çıkaran profesyonel CV'nizi hazırlayın</p>
          </motion.div>

          <motion.div
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <WorkIcon className="feature-icon" />
            <h3>Portfolyo Oluştur</h3>
            <p>Projelerinizi sergileyip kendinizi tanıtın</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="bottom-actions">
        <div className="action-card" onClick={() => navigate('/profile-update')}>
          <h3>Tarzını Göster</h3>
          <p>Profilini özelleştir ve kendini ifade et</p>
        </div>

        <div className="action-card" onClick={() => navigate('/projects')}>
          <h3>Henüz Proje Eklemedin mi?</h3>
          <p>Hemen projeni ekle ve yeteneklerini sergile</p>
        </div>

        <div className="action-card" onClick={handlePortfolioClick}>
          <h3>Portfolyonu Keşfet</h3>
          <p>Profilini görüntüle ve etkini artır</p>
        </div>
      </div>

      <div className="home-footer">
        <div className="footer-content">
          <div className="footer-left">
            © {new Date().getFullYear()} PortfolioM. Developed by Furkan Can
          </div>
          <div className="footer-right">
            <a
              href="https://github.com/furkancan07"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <GitHubIcon /> GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/furkan-can-45182b236/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
            >
              <LinkedInIcon /> LinkedIn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home; 