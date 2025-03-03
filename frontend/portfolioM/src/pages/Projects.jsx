import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactSortable } from "react-sortablejs";
import { toast, ToastContainer } from 'react-toastify';
import { getUserProjects, deleteProject, reorderProjects } from '../server/api';
import 'react-toastify/dist/ReactToastify.css';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await getUserProjects(userId);
      setProjects(response.data);
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.clear();
        navigate('/login');
      }
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
    const confirmDelete = window.confirm("Bu projeyi silmek istediğinize emin misiniz?");
    if (confirmDelete) {
      try {
        await deleteProject(projectId);
        setProjects(projects.filter(project => project.id !== projectId));
      } catch (error) {
        setError('Projeyi silerken bir hata oluştu');
        console.error('Proje silme hatası:', error);
      }
    }
  };

  const handleSortEnd = () => {
    setHasChanges(true);
  };

  const saveNewOrder = async () => {
    try {
      await reorderProjects(projects.map(project => project.id));
      setHasChanges(false);
      toast.success('Proje sıralaması başarıyla güncellendi!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error('Proje sıralama hatası:', error);
      toast.error('Sıralama güncellenirken bir hata oluştu', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      fetchProjects();
    }
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="projects-page">
      <ToastContainer />
      <div className="projects-header">
        <h1>Projelerim</h1>
        <button 
          className="add-project-btn"
          onClick={() => navigate('/add-project')}
        >
          Yeni Proje Ekle
        </button>
      </div>

      <div className="projects-info">
        <p>
          <i className="info-icon">ℹ️</i>
          Projeleri sürükleyip bırakarak sıralayabilirsiniz. Sıralamayı kaydetmek için aşağıdaki butonu kullanın. Daha iyi bir deneyim için bilgisayarda deneyin.
        </p>
      </div>

      <ReactSortable 
        list={projects}
        setList={setProjects}
        onEnd={handleSortEnd}
        animation={200}
        className="projects-list"
      >
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
      </ReactSortable>

      {hasChanges && (
        <div className="order-actions">
          <button 
            className="save-order-btn"
            onClick={saveNewOrder}
          >
            Sıralamayı Güncelle
          </button>
        </div>
      )}

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
  );
};

export default Projects; 