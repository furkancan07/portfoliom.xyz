import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, getUserProjects, getUserExperiences } from '../server/api';
import { ReactSortable } from "react-sortablejs";
import { useReactToPrint } from 'react-to-print';
import './CreateCV.css';
import userLogo from '../assets/user.png';

const CreateCV = () => {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('tr');

  // State for CV Customization
  const [selectedTheme, setSelectedTheme] = useState('modern');
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [sections, setSections] = useState([
    { id: 'about', name: 'Hakkımda', enabled: true },
    { id: 'education', name: 'Eğitim', enabled: true },
    { id: 'skills', name: 'Yetenekler', enabled: true },
    { id: 'experience', name: 'Deneyim', enabled: true },
    { id: 'projects', name: 'Projeler', enabled: true },
    { id: 'contact', name: 'İletişim', enabled: true }
  ]);

  const navigate = useNavigate();
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: userData ? `${userData.name}_${userData.surname}_CV` : 'CV',
  });

  const POSITION_TRANSLATIONS = {
    'INTERN': 'Stajyer',
    'JUNIOR': 'Junior Geliştirici',
    'MID_LEVEL': 'Orta Seviye Geliştirici',
    'SENIOR': 'Kıdemli Geliştirici'
  };

  useEffect(() => {
    // Artık username kontrolü yapıyoruz, token cookie'de
    const username = localStorage.getItem('username');
    if (!username) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchUserData(username);
        setUserData(response.data);

        const projectsResponse = await getUserProjects(response.data.id);
        setProjects(projectsResponse.data);
        setSelectedProjectIds(projectsResponse.data.slice(0, 3).map(p => p.id));

        const experiencesResponse = await getUserExperiences(username);
        setExperiences(experiencesResponse.data || []);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
        if (error.response?.status === 401) {
          // API interceptor zaten logout yapacak
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const toggleProject = (projectId) => {
    setSelectedProjectIds(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  };

  const translations = {
    tr: {
      about: 'Hakkımda',
      education: 'Eğitim',
      skills: 'Yetenekler',
      projects: 'Projeler',
      contact: 'İletişim',
      viewProject: 'Projeyi Görüntüle',
      technologies: 'Teknolojiler',
      generateCV: 'PDF İndir',
      back: 'Geri',
      createCV: 'CV Oluşturucu',
      experience: 'Deneyim',
      current: 'Devam Ediyor',
      settings: 'CV Ayarları',
      selectTheme: 'Tema Seçimi',
      selectProjects: 'Projeleri Seç',
      orderSections: 'Bölüm Sıralaması',
      modern: 'Modern',
      classic: 'Klasik'
    },
    en: {
      about: 'About',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      viewProject: 'View Project',
      technologies: 'Technologies',
      generateCV: 'Download PDF',
      back: 'Back',
      createCV: 'CV Builder',
      experience: 'Experience',
      current: 'Present',
      settings: 'CV Settings',
      selectTheme: 'Select Theme',
      selectProjects: 'Select Projects',
      orderSections: 'Order Sections',
      modern: 'Modern',
      classic: 'Classic'
    }
  };

  const [activeMobileTab, setActiveMobileTab] = useState('settings');

  const t = translations[language];



  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'about':
        return userData.aboutMe && (
          <div className="cv-section-content">
            <p>{userData.aboutMe}</p>
          </div>
        );
      case 'education':
        return userData.university && (
          <div className="cv-section-content">
            <p className="education-school">{userData.university}</p>
          </div>
        );
      case 'skills':
        return Object.keys(userData.skills || {}).length > 0 && (
          <div className="cv-skills-grid">
            {Object.entries(userData.skills || {}).map(([skill, level]) => (
              <span key={skill} className="cv-skill-tag">{skill}</span>
            ))}
          </div>
        );
      case 'projects':
        const selectedProjects = projects.filter(p => selectedProjectIds.includes(p.id));
        return selectedProjects.length > 0 && (
          <div className="cv-projects-list">
            {selectedProjects.map(project => (
              <div key={project.id} className="cv-project-entry">
                <div className="project-header">
                  <h4>{project.name}</h4>
                  {project.projectLink && (
                    <a href={project.projectLink} target="_blank" rel="noreferrer">Link ↗</a>
                  )}
                </div>
                <p className="project-tech">{project.skills?.join(', ')}</p>
              </div>
            ))}
          </div>
        );
      case 'experience':
        return experiences.length > 0 && (
          <div className="cv-experience-list">
            {experiences.map((exp, index) => (
              <div key={index} className="cv-experience-entry">
                <div className="exp-header">
                  <h4>{exp.companyName}</h4>
                  <span className="exp-date">
                    {new Date(exp.startTime).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' })} -
                    {exp.endDate ? new Date(exp.endDate).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US', { month: 'short', year: 'numeric' }) : t.current}
                  </span>
                </div>
                <p className="exp-role">{POSITION_TRANSLATIONS[exp.position]}</p>
              </div>
            ))}
          </div>
        );
      case 'contact':
        return (
          <div className="cv-contact-list">
            {Object.entries(userData.contactAddresses || {})
              .filter(([_, url]) => url)
              .map(([platform, url]) => (
                <div key={platform} className="contact-item">
                  <a href={url} target="_blank" rel="noreferrer" className="contact-link">
                    {platform.charAt(0).toUpperCase() + platform.slice(1)} ↗
                  </a>
                </div>
              ))}
          </div>
        );
      default: return null;
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;

  return (
    <div className="cv-builder-layout">
      {/* MOBILE TABS */}
      <div className="mobile-tabs no-print">
        {activeMobileTab === 'preview' ? (
          <>
            <button
              className="mobile-tab-btn"
              onClick={() => setActiveMobileTab('settings')}
            >
              {t.settings}
            </button>
            <button
              className="mobile-tab-btn primary-action"
              onClick={handlePrint}
            >
              {t.generateCV}
            </button>
          </>
        ) : (
          <>
            <button
              className={`mobile-tab-btn ${activeMobileTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveMobileTab('settings')}
            >
              {t.settings}
            </button>
            <button
              className={`mobile-tab-btn ${activeMobileTab === 'preview' ? 'active' : ''}`}
              onClick={() => setActiveMobileTab('preview')}
            >
              PDF / İndir
            </button>
          </>
        )}
      </div>

      <div className={`cv-sidebar no-print ${activeMobileTab === 'settings' ? 'mobile-visible' : 'mobile-hidden'}`}>
        <div className="sidebar-header">
          <h2>{t.settings}</h2>
          <button onClick={() => navigate(-1)} className="btn-back">{t.back}</button>
        </div>

        <div className="control-group">
          <h3>{t.selectTheme}</h3>
          <div className="theme-selector">
            <button
              className={`theme-btn ${selectedTheme === 'modern' ? 'active' : ''}`}
              onClick={() => setSelectedTheme('modern')}
            >
              {t.modern}
            </button>
            <button
              className={`theme-btn ${selectedTheme === 'classic' ? 'active' : ''}`}
              onClick={() => setSelectedTheme('classic')}
            >
              {t.classic}
            </button>
          </div>
        </div>

        <div className="control-group">
          <h3>{t.selectProjects}</h3>
          <div className="project-selector">
            {projects.map(project => (
              <label key={project.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedProjectIds.includes(project.id)}
                  onChange={() => toggleProject(project.id)}
                />
                {project.name}
              </label>
            ))}
          </div>
        </div>

        <div className="control-group">
          <h3>{t.orderSections}</h3>
          <ReactSortable list={sections} setList={setSections} handle=".handle" className="section-sorter">
            {sections.map(item => (
              <div key={item.id} className="sortable-item">
                <span className="handle">☰</span>
                <span>{t[item.id] || item.name}</span>
              </div>
            ))}
          </ReactSortable>
        </div>

        <button onClick={handlePrint} className="btn-download-pdf">
          {t.generateCV}
        </button>
      </div>

      <div className={`cv-preview-container ${activeMobileTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>

        <div className="mobile-preview-message">
          <div className="message-content">
            <div className="icon">📱</div>
            <h3>Önizleme Kullanılamıyor</h3>
            <p>En iyi deneyim için lütfen CV'nizi bilgisayarda veya geniş ekranda düzenleyin.</p>
            <p className="sub-text">Yine de PDF olarak indirip kontrol edebilirsiniz.</p>
            <button onClick={handlePrint} className="btn-download-mobile-center">
              PDF İndir
            </button>
          </div>
        </div>

        <div className={`cv-document theme-${selectedTheme}`} ref={componentRef}>

          {selectedTheme === 'modern' && (
            <div className="modern-layout">
              <div className="modern-sidebar">
                <div className="profile-photo">
                  <img src={userData.profilePhotoUrl || userLogo} alt="Profile" />
                </div>
                <h1 className="name">{userData.name} {userData.surname}</h1>
                <p className="job-title">{userData.job}</p>

                <div className="sidebar-section">
                  <h3>{t.contact}</h3>
                  {renderSectionContent('contact')}
                </div>
                <div className="sidebar-section">
                  <h3>{t.skills}</h3>
                  {renderSectionContent('skills')}
                </div>
              </div>

              <div className="modern-content">
                {sections
                  .filter(s => s.id !== 'contact' && s.id !== 'skills')
                  .map(section => (
                    <div key={section.id} className="modern-section">
                      <h3 className="section-title">{t[section.id]}</h3>
                      {renderSectionContent(section.id)}
                    </div>
                  ))}
              </div>
            </div>
          )}

          {selectedTheme === 'classic' && (
            <div className="classic-layout">
              <div className="classic-header">
                <div className="header-left">
                  <h1 className="name">{userData.name} {userData.surname}</h1>
                  <p className="job-title">{userData.job} | {userData.area}</p>
                </div>
                <div className="header-right">
                  <div className="mini-contact">
                    {userData.contactAddresses?.email && <div>{userData.contactAddresses.email}</div>}
                    {userData.contactAddresses?.linkedin && <div>{userData.contactAddresses.linkedin}</div>}
                  </div>
                </div>
              </div>

              <div className="classic-body">
                {sections.map(section => (
                  <div key={section.id} className="classic-section">
                    <h3 className="section-title">{t[section.id]}</h3>
                    <div className="section-line"></div>
                    {renderSectionContent(section.id)}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CreateCV; 