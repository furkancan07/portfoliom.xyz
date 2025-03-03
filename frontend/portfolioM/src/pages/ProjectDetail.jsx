import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProjectById } from '../server/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await getProjectById(projectId);
        setProject(response.data);
      } catch (err) {
        setError('Proje yüklenirken bir hata oluştu');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === project.imagesUrl.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? project.imagesUrl.length - 1 : prev - 1
    );
  };

  if (loading) return <div className="loading">Yükleniyor...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!project) return <div className="error">Proje bulunamadı</div>;

  return (
    <div className="project-detail-page">
      <div className="project-detail-container">
        <div className="project-content">
          <h1>{project.name}</h1>
          
          <div className="image-section">
            {project.imagesUrl && project.imagesUrl.length > 0 ? (
              <>
                <div className="main-image-container">
                  <img
                    src={project.imagesUrl[currentImageIndex]}
                    alt={project.name}
                    className="main-image"
                  />
                  {project.imagesUrl.length > 1 && (
                    <div className="image-navigation">
                      <button onClick={prevImage} className="nav-btn">‹</button>
                      <button onClick={nextImage} className="nav-btn">›</button>
                    </div>
                  )}
                </div>

                {project.imagesUrl.length > 1 && (
                  <div className="image-thumbnails">
                    {project.imagesUrl.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`${project.name} ${index + 1}`}
                        className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                        onClick={() => setCurrentImageIndex(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">Görsel Yok</div>
            )}
          </div>

          <div className="description-section">
            <h4>Açıklama</h4>
            <p>{project.description}</p>
          </div>

          <div className="technologies-section">
            <h4>Teknolojiler</h4>
            <div className="tech-stack">
              {project.skills.map((skill, index) => (
                <span key={index} className="tech-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="button-group">
            <Link to={project.projectLink} target="_blank" className="project-link">
              <span>Projeyi Görüntüle</span>
              <span className="arrow">→</span>
            </Link>
            <button onClick={() => navigate(-1)} className="back-button">
              <span>Geri Git</span>
              <span className="arrow">←</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 