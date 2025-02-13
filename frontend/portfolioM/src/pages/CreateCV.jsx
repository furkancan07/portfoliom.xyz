import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, getUserProjects } from '../server/api';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.vfs;
import './CreateCV.css';
import userLogo from '../assets/user.png';

const CreateCV = () => {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [language, setLanguage] = useState('tr');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = localStorage.getItem('username');
        const response = await fetchUserData(username);
        const userData = response.data;
        setUserData(userData);

        // Projeleri getir
        const projectsResponse = await getUserProjects(userData.id);
        setProjects(projectsResponse.data);
      } catch (error) {
        console.error('Veri yükleme hatası:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const translations = {
    tr: {
      about: 'Hakkımda',
      education: 'Eğitim',
      skills: 'Yetenekler',
      projects: 'Projeler',
      contact: 'İletişim',
      viewProject: 'Projeyi Görüntüle',
      technologies: 'Teknolojiler',
      generateCV: 'PDF Olarak İndir',
      back: 'Geri Dön',
      createCV: 'CV Oluştur',
      preview: 'Profilinizden profesyonel bir CV oluşturabilirsiniz.'
    },
    en: {
      about: 'About',
      education: 'Education',
      skills: 'Skills',
      projects: 'Projects',
      contact: 'Contact',
      viewProject: 'View Project',
      technologies: 'Technologies',
      generateCV: 'Download as PDF',
      back: 'Go Back',
      createCV: 'Create CV',
      preview: 'Create a professional CV from your profile.'
    }
  };

  const t = translations[language];

  const generatePDF = async () => {
    let profileImageBase64 = null;
    try {
      const response = await fetch(userData.profilePhotoUrl || userLogo);
      const blob = await response.blob();
      profileImageBase64 = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Profil fotoğrafı yüklenemedi:', error);
      try {
        const blob = await fetch(userLogo).then(r => r.blob());
        profileImageBase64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error('Varsayılan fotoğraf yüklenemedi:', err);
      }
    }

    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [72, 40, 72, 40],
      content: [
        profileImageBase64 ? {
          image: profileImageBase64,
          width: 100,
          height: 100,
          alignment: 'center',
          margin: [0, 20, 0, 20],
          borderRadius: 50
        } : {},
        {
          text: `${userData.name} ${userData.surname}`,
          style: 'header',
          alignment: 'center'
        },
        {
          text: userData.job,
          style: 'jobTitle',
          alignment: 'center',
          margin: [0, 5, 0, 0]
        },
        {
          text: userData.area,
          style: 'jobTitle',
          alignment: 'center',
          margin: [0, 5, 0, 20]
        },
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 450,
              y2: 0,
              lineWidth: 1,
              lineColor: '#ff4d4d'
            }
          ],
          margin: [0, 0, 0, 20]
        },
        {
          text: t.about,
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          text: userData.aboutMe || '',
          style: 'normalText',
          margin: [0, 0, 0, 20]
        },
        {
          text: t.education,
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          text: userData.university || '',
          style: 'normalText',
          margin: [0, 0, 0, 20]
        },
        {
          text: t.skills,
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        {
          columns: [
            {
              ul: Object.entries(userData.skills || {}).map(([skill, level]) => ({
                text: `${skill} (${level})`,
                style: 'skillItem'
              }))
            }
          ],
          margin: [0, 0, 0, 20]
        },
        {
          text: t.projects,
          style: 'sectionHeader',
          margin: [0, 0, 0, 10]
        },
        ...projects.map(project => ({
          stack: [
            {
              text: project.name,
              style: 'projectTitle',
              margin: [0, 5, 0, 5]
            },
            {
              text: `${t.technologies}: ${project.skills?.join(', ')}`,
              style: 'normalText',
              margin: [0, 0, 0, 5]
            },
            {
              text: t.viewProject,
              link: project.projectLink,
              style: 'link',
              margin: [0, 0, 0, 15]
            }
          ]
        }))
      ],
      styles: {
        header: {
          fontSize: 24,
          bold: true,
          color: '#000000',
          margin: [0, 0, 0, 5]
        },
        jobTitle: {
          fontSize: 14,
          color: '#666666',
          italics: true
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#000000',
          decoration: 'underline',
          decorationStyle: 'solid',
          decorationColor: '#ff4d4d'
        },
        normalText: {
          fontSize: 12,
          color: '#444444',
          lineHeight: 1.4
        },
        projectTitle: {
          fontSize: 12,
          bold: true,
          color: '#000000'
        },
        link: {
          fontSize: 12,
          color: '#0066cc',
          decoration: 'underline'
        },
        skillItem: {
          fontSize: 12,
          color: '#444444',
          margin: [0, 2]
        }
      },
      defaultStyle: {
        font: 'Roboto'
      }
    };

    try {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      const fileName = language === 'tr' 
        ? `${userData.name}_${userData.surname}_CV_TR.pdf`
        : `${userData.name}_${userData.surname}_CV_EN.pdf`;
      pdfDoc.download(fileName);
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('CV oluşturulurken bir hata oluştu');
    }
  };

  if (loading) {
    return (
      <div className="create-cv-container">
        <div className="loading">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="create-cv-container">
      <div className="cv-header-actions">
        <h1>{t.createCV}</h1>
        <div className="language-selector">
          <button 
            className={`lang-btn ${language === 'tr' ? 'active' : ''}`}
            onClick={() => setLanguage('tr')}
          >
            🇹🇷 Türkçe
          </button>
          <button 
            className={`lang-btn ${language === 'en' ? 'active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            🇬🇧 English
          </button>
        </div>
      </div>
      <p>{t.preview}</p>
      <div className="cv-preview">
        <div className="cv-header">
          <div className="cv-photo">
            <img 
              src={userData.profilePhotoUrl || userLogo} 
              alt="Profile" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = userLogo;
              }}
            />
          </div>
          <div className="cv-title">
            <h2>{userData.name} {userData.surname}</h2>
            <p>{userData.job}</p>
            <p>{userData.area}</p>
          </div>
        </div>
        <div className="cv-section">
          <h3>{t.about}</h3>
          <p>{userData.aboutMe}</p>
        </div>
        <div className="cv-section">
          <h3>{t.education}</h3>
          <p>{userData.university}</p>
        </div>
        <div className="cv-section">
          <h3>{t.skills}</h3>
          <div className="cv-skills">
            {Object.entries(userData.skills || {}).map(([skill, level]) => (
              <div key={skill} className="cv-skill-item">
                {skill} ({level})
              </div>
            ))}
          </div>
        </div>
        <div className="cv-section">
          <h3>{t.projects}</h3>
          <div className="cv-projects">
            {projects.map(project => (
              <div key={project.id} className="cv-project-item">
                <h4>{project.name}</h4>
                <p>{t.technologies}: {project.skills?.join(', ')}</p>
                <a href={project.projectLink} target="_blank" rel="noopener noreferrer">
                  {t.viewProject}
                </a>
              </div>
            ))}
          </div>
        </div>
        <div className="cv-section">
          <h3>{t.contact}</h3>
          <div className="cv-contacts">
            {Object.entries(userData.contactAddresses || {})
              .filter(([_, url]) => url)
              .map(([platform, url]) => (
                <div key={platform} className="cv-contact-item">
                  {platform}: {url}
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="cv-actions">
        <button onClick={generatePDF} className="generate-cv-btn">
          {t.generateCV}
        </button>
        <button onClick={() => navigate(-1)} className="back-btn">
          {t.back}
        </button>
      </div>
    </div>
  );
};

export default CreateCV; 