import React from 'react';
import SearchBar from '../components/SearchBar';
import './Home.css';
import { motion } from 'framer-motion'; 
import CodeIcon from '@mui/icons-material/Code';
import DescriptionIcon from '@mui/icons-material/Description';
import WorkIcon from '@mui/icons-material/Work';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  
  const handlePortfolioClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    navigate('/'+localStorage.getItem('username'));
  };

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
    </div>
  );
}

export default Home; 