import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProjectById, updateProject } from '../server/api';
import './AddProject.css'; // Aynı stili kullanacağız

const PROJECT_AREAS = ['WEB', 'MOBILE', 'DESKTOP', 'GAME', 'AI', 'OTHER'];

function ProjectEdit() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectArea: 'WEB',
    skills: [],
    projectLink: ''
  });
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))?.id;

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const response = await getProjectById(projectId);
        const project = response.data;
        setFormData({
          name: project.name,
          description: project.description,
          projectArea: project.projectArea,
          skills: project.skills,
          projectLink: project.projectLink
        });
      } catch (err) {
        setError('Proje yüklenirken bir hata oluştu');
        console.error(err);
      }
    };

    fetchProjectData();
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillAdd = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await updateProject(projectId, formData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/${localStorage.getItem('username')}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-container">
      <h1>Proje Düzenle</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Proje başarıyla güncellendi! Yönlendiriliyorsunuz...</div>}
      
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="name">Proje Adı</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Proje Açıklaması</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="projectArea">Proje Alanı</label>
          <select
            id="projectArea"
            name="projectArea"
            value={formData.projectArea}
            onChange={handleChange}
            required
          >
            {PROJECT_AREAS.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Teknolojiler</label>
          <div className="skills-input">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              placeholder="Teknoloji ekle"
            />
            <button type="button" onClick={handleSkillAdd}>Ekle</button>
          </div>
          <div className="skills-list">
            {formData.skills.map(skill => (
              <span key={skill} className="skill-tag">
                {skill}
                <button type="button" onClick={() => removeSkill(skill)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="projectLink">Proje Linki</label>
          <input
            type="url"
            id="projectLink"
            name="projectLink"
            value={formData.projectLink}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Güncelleniyor...' : 'Projeyi Güncelle'}
        </button>
      </form>
    </div>
  );
}

export default ProjectEdit; 