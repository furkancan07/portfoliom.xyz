import React, { useState } from 'react';
import ProjectModal from './ProjectModal';
import './ProjectCard.css';
import { useNavigate } from 'react-router-dom';


const ProjectCard = ({ project, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

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
    <>
      <div className="project-card">
        {project.imagesUrl && project.imagesUrl.length > 0 ? (
          <div className="project-images-container">
            <div 
              className="project-images"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {project.imagesUrl.map((imageUrl, index) => (
                <img
                  key={index}
                  src={imageUrl}
                  alt={`${project.name} - ${index + 1}`}
                  className="project-image"
                />
              ))}
            </div>
            {project.imagesUrl.length > 1 && (
              <div className="image-nav">
                <button onClick={prevImage}>&lt;</button>
                <span>{currentImageIndex + 1}/{project.imagesUrl.length}</span>
                <button onClick={nextImage}>&gt;</button>
              </div>
            )}
          </div>
        ) : (
          <div className="project-no-image">
            <span>Resim Yok</span>
          </div>
        )}

        <div className="project-content">
          <h3>{project.name}</h3>
          <p className="project-desc">{project.description}</p>
          <div className="project-tech">
            {project.skills.map((skill, index) => (
              <span key={index}>{skill}</span>
            ))}
          </div>
          <div className="project-actions">
            <button
              className="project-link"
              onClick={() => navigate(`/project/${project.id}`)}
            >
              Detaylar
            </button>
            <a 
              href={project.projectLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="project-link"
            >
              Git
            </a>
           
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ProjectModal 
          project={project} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </>
  );
};

export default ProjectCard; 