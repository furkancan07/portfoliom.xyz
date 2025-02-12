import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserData, getUserProjects, getUserProjectsByTag } from '../server/api.jsx';
import '../Profile.css';
import ProjectCard from '../components/ProjectCard';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;
import userLogo from '../assets/user.png'
import { TypeAnimation } from 'react-type-animation';


function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (!username) {
          setErrorMessage("Kullanıcı adı bulunamadı!");
          setTimeout(() => navigate('/'), 2000);
          return;
        }

        const response = await fetchUserData(username);
        setUserData(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          setErrorMessage("Kullanıcı bulunamadı!");
          setTimeout(() => navigate('/'), 2000);
        } else {
          setErrorMessage("Bir hata oluştu. Lütfen tekrar deneyin.");
          setTimeout(() => navigate('/'), 2000);
        }
        setError(error);
      }
    };
    
    if (username) {
      getUserData();
    }
  }, [username, navigate]);

  useEffect(() => {
    const getProjects = async () => {
      try {
        const response = await getUserProjects(userData.id);
        setProjects(response.data);
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error);
      }
    };

    if (userData?.id) {
      getProjects();
    }
  }, [userData]);

  const handleTagChange = async (tag) => {
    setSelectedTag(tag);
    try {
      const response = tag === 'ALL' 
        ? await getUserProjects(userData.id)
        : await getUserProjectsByTag(userData.id, tag);
      setProjects(response.data);
    } catch (error) {
      console.error('Projeler filtrelenirken hata:', error);
    }
  };

  

  const generateCV = async () => {
    try {
      if (!userData.cvUrl) {
        alert("CV URL bulunamadı!");
        return;
      }

      // Raw CV dosyasını al
      const response = await fetch(userData.cvUrl);
      if (!response.ok) {
        throw new Error("CV dosyası alınamadı");
      }
      const blob = await response.blob();

      // Dosyayı indir
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${userData.name}_${userData.surname}_CV.pdf`; // PDF uzantısı ile kaydet
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('CV indirme hatası:', error);
      alert('CV indirilirken bir hata oluştu');
    }
  };

  const handleProjectDelete = (deletedProjectId) => {
    // Projeler listesinden silinen projeyi çıkar
    setProjects(prevProjects => 
      prevProjects.filter(project => project.id !== deletedProjectId)
    );
  };

  // Loading ve error durumlarını göster
  if (errorMessage) {
    return (
      <div className="error-container">
        <div className="error-message">
          {errorMessage}
        </div>
      </div>
    );
  }

  if (!userData) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="profile-container">
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsDrawerOpen(true)}
      >
        <span>☰</span>
      </button>

      <div className={`profile-left ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button 
            className="close-drawer"
            onClick={() => setIsDrawerOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="profile-card">
          <div className="profile-image-wrapper">
            <img 
              src={userData.profilePhotoUrl || userLogo} 
              alt={`${userData.name}'s profile`}
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultAvatar;
              }}
            />
          </div>
          <span className="username">@{userData.username}</span>
          <h1>{userData.name} {userData.surname}</h1>
          
          <span className="job-title">{userData.job || 'Yazılım Geliştirici'}</span>
          <div className="role-badge">{userData.area || 'Alanınızı yazın'}</div>
        </div>

        <div className="personal-info">
          <h2>Kişisel Bilgiler</h2>
          <div className="info-item">
            <span className="info-icon">🎓</span>
            <div className="info-content">
              <span className="info-label">Üniversite</span>
              <span className="info-value">{userData.university}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">💼</span>
            <div className="info-content">
              <span className="info-label">Bölüm</span>
              <span className="info-value">{userData.job}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon">🎯</span>
            <div className="info-content">
              <span className="info-label">İlgi Alanı</span>
              <span className="info-value">{userData.area}</span>
            </div>
          </div>
        </div>

        <div className="skills-section">
          <h2>Yetenekler</h2>
          <div className="skills-list">
            {Object.entries(userData.skills || {}).map(([skill, level]) => {
              // İngilizce seviyeleri Türkçeye çevir
              const turkceLevel = {
                'ADVANCED': 'İleri',
                'INTERMEDIATE': 'Orta',
                'BEGINNER': 'Başlangıç'
              }[level] || level;

              return (
                <div key={skill} className="skill-item">
                  <div className="skill-name">
                    {skill.includes('Spring') ? (
                      <>
                        Spring
                        <br />
                        <small style={{opacity: 0.7}}>{skill.split(' ')[1]}</small>
                      </>
                    ) : (
                      skill
                    )}
                  </div>
                  <span className="skill-level">{turkceLevel}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="contact-section">
          <h2>İletişim</h2>
          <div className="contact-list">
            {Object.entries(userData.contactAddresses || {}).map(([platform, url]) => (
              url && (
                <a 
                  key={platform} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="contact-link"
                >
                  <span className="platform-icon">🔗</span>
                  <span>{platform}</span>
                </a>
              )
            ))}
          </div>
        </div>
      </div>

      <div className="profile-right">
        <div className="about-section">
          <div className="about-content">
            <h2 className="about-title">HAKKIMDA</h2>
            <div className="about-text-container">
              <TypeAnimation
                sequence={[userData.aboutMe || '']}
                wrapper="p"
                speed={50}
                repeat={1}
                className="about-text"
              />
            </div>
          </div>
          <div className="stats-banner">
            <div className="stat-item">
              <span className="stat-value">{Object.keys(userData.skills || {}).length}+</span>
              <span className="stat-label">Teknoloji Stack</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{projects.length}+</span>
              <span className="stat-label">Tamamlanan Proje</span>
            </div>
          </div>
        </div>

        <div className="projects-section">
          <h2>PROJELER</h2>
          <div className="project-filters">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${selectedTag === 'ALL' ? 'active' : ''}`}
                onClick={() => handleTagChange('ALL')}
              >
                Hepsi
              </button>
              <button 
                className={`filter-btn ${selectedTag === 'WEB' ? 'active' : ''}`}
                onClick={() => handleTagChange('WEB')}
              >
                Web
              </button>
              <button 
                className={`filter-btn ${selectedTag === 'MOBILE' ? 'active' : ''}`}
                onClick={() => handleTagChange('MOBILE')}
              >
                Mobil
              </button>
              <button 
                className={`filter-btn ${selectedTag === 'GAME' ? 'active' : ''}`}
                onClick={() => handleTagChange('GAME')}
              >
                Oyun
              </button>
              <button 
                className={`filter-btn ${selectedTag === 'AI' ? 'active' : ''}`}
                onClick={() => handleTagChange('AI')}
              >
                AI
              </button>
              <button 
                className={`filter-btn ${selectedTag === 'OTHER' ? 'active' : ''}`}
                onClick={() => handleTagChange('OTHER')}
              >
                Diğer
              </button>
              {userData.cvUrl && (
                <button 
                  className="filter-btn cv-download"
                  onClick={generateCV}
                >
                  📄 CV İndir
                </button>
              )}
            </div>
          </div>
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project}
                onDelete={handleProjectDelete}
              />
            ))}
            {projects.length === 0 && (
              <div className="no-projects">
                Bu kategoride henüz proje bulunmuyor.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 