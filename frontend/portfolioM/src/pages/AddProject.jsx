import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../server/api.jsx';
import './AddProject.css';

const PROJECT_AREAS = ['WEB', 'MOBILE', 'DESKTOP', 'GAME', 'AI', 'OTHER'];

function AddProject() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    projectArea: 'WEB',
    skills: [],
    projectLink: ''
  });
  const [images, setImages] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      setError('En fazla 5 resim yükleyebilirsiniz');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
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

  const removeSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createProject(formData, images);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/${localStorage.getItem('username')}`);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Bir hata oluştu');
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-project-container">
      <h1>Yeni Proje Ekle</h1>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Proje başarıyla eklendi! Yönlendiriliyorsunuz...</div>}
      
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

        <div className="form-group">
          <label>Proje Görselleri (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="file-input"
          />
          <div className="image-preview">
            {images.map((image, index) => (
              <div key={index} className="image-item">
                <img src={URL.createObjectURL(image)} alt={`Preview ${index}`} />
                <button type="button" onClick={() => removeImage(index)}>×</button>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Ekleniyor...' : 'Proje Ekle'}
        </button>
      </form>
    </div>
  );
}

export default AddProject; 