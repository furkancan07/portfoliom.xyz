import React, { useState } from 'react';

const SkillModal = ({ isOpen, onClose, onAddSkill, existingSkills }) => {
  const [newSkill, setNewSkill] = useState({ name: '', level: 'BEGINNER' });

  const handleSkillChange = (e) => {
    const { name, value } = e.target;
    setNewSkill({ ...newSkill, [name]: value });
  };

  const handleAddSkill = () => {
    if (newSkill.name && newSkill.level) {
      onAddSkill(newSkill);
      setNewSkill({ name: '', level: 'BEGINNER' }); // Formu sıfırla
      onClose(); // Modalı kapat
    }
  };

  return (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>Yeni Yetenek Ekle</h3>
          <label htmlFor="skillName">Yetenek Adı</label>
          <input
            type="text"
            id="skillName"
            name="name"
            placeholder="Yetenek adını girin"
            value={newSkill.name}
            onChange={handleSkillChange}
          />
          <label htmlFor="skillLevel">Yetenek Seviyesi</label>
          <select
            id="skillLevel"
            name="level"
            value={newSkill.level}
            onChange={handleSkillChange}
          >
            <option value="BEGINNER">Başlangıç</option>
            <option value="INTERMEDIATE">Orta</option>
            <option value="ADVANCED">İleri</option>
            <option value="FUNCTIONAL">Fonksiyonel</option>
          </select>
          <button type="button" onClick={handleAddSkill}>Ekle</button>
          <button type="button" onClick={onClose}>Kapat</button>
        </div>
      </div>
    )
  );
};

export default SkillModal; 