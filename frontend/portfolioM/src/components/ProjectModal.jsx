import React, { useState } from 'react';
import './ProjectModal.css';

const ProjectModal = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="project-modal">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="modal-header">
          <h2>{project.name}</h2>
        </div>

        <div className="modal-body">
          <div className="modal-image-section">
            {project.imagesUrl && project.imagesUrl.length > 0 ? (
              <>
                <img
                  src={project.imagesUrl[currentImageIndex]}
                  alt={project.name}
                  className="modal-image"
                />
                {project.imagesUrl.length > 1 && (
                  <div className="image-controls">
                    <button onClick={prevImage} className="nav-btn prev">‹</button>
                    <button onClick={nextImage} className="nav-btn next">›</button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-image">Resim Yok</div>
            )}
          </div>

          <div className="modal-content-section">
            <p className="project-description">{project.description}</p>
            
            <div className="project-tech-stack">
              {project.skills.map((skill, index) => (
                <span key={index} className="tech-tag">{skill}</span>
              ))}
            </div>

            <a 
              href={project.projectLink}
              target="_blank"
              rel="noopener noreferrer"
              className="project-link"
            >
              Projeyi Görüntüle
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal; 