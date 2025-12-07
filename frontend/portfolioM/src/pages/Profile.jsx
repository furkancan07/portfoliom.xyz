import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserData, getUserProjects, getUserProjectsByTag, getUserExperiences } from '../server/api.jsx';
import '../Profile.css';
import ProjectCard from '../components/ProjectCard';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;
import userLogo from '../assets/user.png'
import { TypeAnimation } from 'react-type-animation';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LanguageIcon from '@mui/icons-material/Language';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import CodeIcon from '@mui/icons-material/Code';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import FacebookIcon from '@mui/icons-material/Facebook';
import ForumIcon from '@mui/icons-material/Forum';
import ArticleIcon from '@mui/icons-material/Article';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import PsychologyIcon from '@mui/icons-material/Psychology';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PublicIcon from '@mui/icons-material/Public';


function Profile() {
  const { username } = useParams();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedTag, setSelectedTag] = useState('ALL');
  const [errorMessage, setErrorMessage] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [isProjectsLoading, setIsProjectsLoading] = useState(true);

  const POSITION_TRANSLATIONS = {
    'INTERN': 'Stajyer',
    'JUNIOR': 'Junior Geliştirici',
    'MID_LEVEL': 'Orta Seviye Geliştirici',
    'SENIOR': 'Kıdemli Geliştirici'
  };

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
        // API hatası durumunda sadece hata mesajını göster, çıkış yapma
        if (error.response?.status === 404) {
          setErrorMessage("Kullanıcı bulunamadı!");
        } else {
          setErrorMessage(error.response?.data?.message || "Bir hata oluştu. Lütfen tekrar deneyin.");
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
      setIsProjectsLoading(true);
      try {
        const response = await getUserProjects(userData.id);
        setProjects(response.data);
      } catch (error) {
        console.error('Projeler yüklenirken hata:', error);
      } finally {
        setIsProjectsLoading(false);
      }
    };

    if (userData?.id) {
      getProjects();
    }
  }, [userData]);

  useEffect(() => {
    const getExperiences = async () => {
      try {
        const response = await getUserExperiences(username);
        // Doğrudan response.data.data array'ini kullan
        setExperiences(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Deneyimler yüklenirken hata:', error);
        setExperiences([]);
      }
    };

    if (username) {
      getExperiences();
    }
  }, [username]);

  const handleTagChange = async (tag) => {
    setSelectedTag(tag);
    setIsProjectsLoading(true);
    try {
      const response = tag === 'ALL'
        ? await getUserProjects(userData.id)
        : await getUserProjectsByTag(userData.id, tag);
      setProjects(response.data);
    } catch (error) {
      console.error('Projeler filtrelenirken hata:', error);
    } finally {
      setIsProjectsLoading(false);
    }
  };



  const generateCV = async () => {
    try {
      if (!userData.cvUrl) {
        // CV yüklenmemişse kullanıcıyı bilgilendir
        alert("Henüz CV yüklenmemiş!");
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
      a.download = `${userData.name}_${userData.surname}_CV.pdf`;
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

  const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
      case 'github':
        return <GitHubIcon />;
      case 'linkedin':
        return <LinkedInIcon />;
      case 'twitter':
        return <TwitterIcon />;
      case 'instagram':
        return <InstagramIcon />;
      case 'email':
      case 'gmail':
        return <EmailIcon />;
      case 'facebook':
        return <FacebookIcon />;
      case 'slack':
        return <ForumIcon />;
      case 'discord':
        return <ForumIcon />;
      case 'devto':
      case 'dev.to':
        return <CodeIcon />;
      case 'stackoverflow':
      case 'stack overflow':
        return <QuestionAnswerIcon />;
      case 'medium':
        return <ArticleIcon />;
      case 'leetcode':
        return <PsychologyIcon />;
      case 'hackerrank':
        return <EmojiEventsIcon />;
      case 'website':
        return <LanguageIcon />;
      case 'other':
        return <PublicIcon />;
      default:
        return <LanguageIcon />;
    }
  };

  return (
    <div className="profile-container">
      <button
        className="mobile-menu-btn"
        onClick={() => setIsDrawerOpen(true)}
      >
        <MenuIcon />
      </button>

      <div className={`profile-left ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <button
            className="close-drawer"
            onClick={() => setIsDrawerOpen(false)}
          >
            <CloseIcon />
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
            <span className="info-icon"><SchoolIcon /></span>
            <div className="info-content">
              <span className="info-label">Üniversite</span>
              <span className="info-value">{userData.university}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon"><WorkIcon /></span>
            <div className="info-content">
              <span className="info-label">Bölüm</span>
              <span className="info-value">{userData.job}</span>
            </div>
          </div>
          <div className="info-item">
            <span className="info-icon"><TrackChangesIcon /></span>
            <div className="info-content">
              <span className="info-label">İlgi Alanı</span>
              <span className="info-value">{userData.area}</span>
            </div>
          </div>
        </div>

        <div className="experience-section">
          <h2>Deneyim</h2>
          <div className="experience-list">
            {experiences?.map((experience) => (
              <div key={experience.id} className="experience-item">
                <div className="experience-icon"><WorkIcon /></div>
                <div className="experience-content">
                  <div className="company-name">{experience.companyName}</div>
                  <div className="position-badge">
                    {POSITION_TRANSLATIONS[experience.position]}
                  </div>
                  <div className="experience-date">
                    {new Date(experience.startTime).toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long'
                    })}
                    {' - '}
                    {experience.endDate ? (
                      new Date(experience.endDate).toLocaleDateString('tr-TR', {
                        year: 'numeric',
                        month: 'long'
                      })
                    ) : (
                      <span className="current-badge">Devam Ediyor</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {(!experiences || experiences.length === 0) && (
              <div className="no-experience">
                Henüz deneyim bilgisi eklenmemiş.
              </div>
            )}
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
                        <small style={{ opacity: 0.7 }}>{skill.split(' ')[1]}</small>
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
                  <span className="platform-icon">
                    {getPlatformIcon(platform)}
                  </span>
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
                  <DescriptionIcon style={{ fontSize: '18px', marginRight: '6px' }} />
                  <span>CV İndir</span>
                </button>
              )}
            </div>
          </div>
          <div className="projects-grid">
            {isProjectsLoading ? (
              <div className="loading-projects">Projeler yükleniyor...</div>
            ) : projects.length > 0 ? (
              projects.map(project => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onDelete={handleProjectDelete}
                />
              ))
            ) : (
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