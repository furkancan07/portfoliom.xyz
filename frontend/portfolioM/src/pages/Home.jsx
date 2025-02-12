import React from 'react';
import SearchBar from '../components/SearchBar';
import './Home.css';
import { motion } from 'framer-motion'; 
import CodeIcon from '@mui/icons-material/Code';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  
  return (
    <div className="home-container">
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
          Yazılım Dünyasının <span className="highlight">Sosyal Ağı</span>
        </h1>
        
        <p className="subtitle">
          Projelerinizi sergileyin, diğer geliştiricilerle bağlantı kurun ve yazılım dünyasında yerinizi alın
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
            <GroupIcon className="feature-icon" />
            <h3>Bağlantı Kur</h3>
            <p>Diğer geliştiricilerle iletişime geçin</p>
          </motion.div>

          <motion.div 
            className="feature-card"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <WorkIcon  className="feature-icon" />
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
        
        <div className="action-card" onClick={() => navigate('/'+localStorage.getItem('username'))}>
          <h3>Portfolyonu Keşfet</h3>
          <p>Profilini görüntüle ve etkini artır</p>
        </div>
      </div>
    </div>
  );
}

export default Home; 