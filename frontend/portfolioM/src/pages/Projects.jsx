import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProjects, deleteProject } from '../server/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getUserProjects(userId);
      setProjects(response.data);
    } catch (error) {
      setError('Projeler yüklenirken bir hata oluştu');
      console.error('Proje yükleme hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (projectId) => {
    navigate(`/edit-project/${projectId}`);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Bu projeyi silmek istediğinizden emin misiniz?')) {
      try {
        await deleteProject(projectId);
        // Projeyi listeden kaldır
        setProjects(projects.filter(project => project.id !== projectId));
        // Başarı mesajı göster
        alert('Proje başarıyla silindi');
      } catch (error) {
        console.error('Proje silme hatası:', error);
        alert('Proje silinirken bir hata oluştu');
      }
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projelerim</h1>
        <button 
          className="add-project-btn"
          onClick={() => navigate('/add-project')}
        >
          Yeni Proje Ekle
        </button>
      </div>

      <div className="projects-list">
        {projects.map(project => (
          <div key={project.id} className="project-item">
            <div className="project-item-image">
              <img 
                src={project.imagesUrl?.[0] || '/default-project.png'} 
                alt={project.name} 
              />
            </div>
            
            <div className="project-item-content">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
              
              <div className="project-item-tags">
                {project.skills.map((skill, index) => (
                  <span key={index} className="tag">{skill}</span>
                ))}
              </div>
            </div>

            <div className="project-item-actions">
              <button 
                className="edit-btn"
                onClick={() => handleEdit(project.id)}
              >
                Düzenle
              </button>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(project.id)}
              >
                Sil
              </button>
            </div>
          </div>
        ))}

        {projects.length === 0 && (
          <div className="no-projects">
            <p>Henüz proje eklenmemiş</p>
            <button 
              className="add-project-btn"
              onClick={() => navigate('/add-project')}
            >
              İlk Projeni Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects; 