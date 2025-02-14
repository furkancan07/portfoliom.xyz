import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserData, updateUser, updateProfilePhoto, uploadCV, getUserExperiences, deleteExperience } from '../server/api'; // API fonksiyonlarını içe aktar
import '../Login.css'; // Mevcut stil dosyasını kullan

function ProfileEdit() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    university: '',
    job: '',
    area: '',
    aboutMe: '',
    skills: {},
    contactAddresses: {
      GITHUB: '',
      LINKEDIN: '',
      GMAIL: '',
      WEBSITE: '',
      TWITTER: '',
      INSTAGRAM: '',
      FACEBOOK: '',
      SLACK: '',
      DEVTO: '',
      STACKOVERFLOW: '',
      DISCORD: '',
      MEDIUM: '',
      LEETCODE: '',
      HACKERRANK: '',
      OTHER: '',
    },
    experiences: [],
  });
  const [error, setError] = useState(null);
  const [isEditingSkill, setIsEditingSkill] = useState(false); // Düzenleme durumu
  const [isAddingSkill, setIsAddingSkill] = useState(false); // Yetenek ekleme durumu
  const [currentSkill, setCurrentSkill] = useState({ name: '', level: '' }); // Düzenlenecek yetenek durumu
  const [successMessage, setSuccessMessage] = useState(null); // Başarı mesajı için state ekle
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [currentContact, setCurrentContact] = useState({ platform: '', url: '' });
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null); // Seçilen dosyayı saklamak için
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [currentExperience, setCurrentExperience] = useState({
    companyName: '',
    startTime: '',
    endDate: '',
    position: 'INTERN'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      localStorage.clear();
      navigate('/login');
      return;
    }
  }, [navigate]);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const user = JSON.parse(localStorage.getItem('user'));

    const getUserData = async () => {
      try {
        const response = await fetchUserData(username);
        const userData = response.data;
        // Deneyimleri ayrıca getir
        const experiencesResponse = await getUserExperiences(username);
        
        setFormData({
          name: userData.name || user?.name || '',
          surname: userData.surname || user?.surname || '',
          university: userData.university || '',
          job: userData.job || '',
          area: userData.area || '',
          aboutMe: userData.aboutMe || '',
          skills: userData.skills || {},
          contactAddresses: userData.contactAddresses || {},
          experiences: experiencesResponse.data || [], // Eğer data yoksa boş dizi olacak
        });
      } catch (error) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.clear();
          navigate('/login');
        }
        setFormData(prevData => ({
          ...prevData,
          name: user?.name || '',
          surname: user?.surname || '',
          experiences: [], // Hata durumunda da boş dizi olsun
        }));
        setError(error);
      }
    };
    getUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSkillEdit = (skillName) => {
    setCurrentSkill({ name: skillName, level: formData.skills[skillName] });
    setIsEditingSkill(true);
  };

  const handleSkillDelete = (skillName) => {
    const updatedSkills = { ...formData.skills };
    delete updatedSkills[skillName];
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleSkillUpdate = () => {
    if (currentSkill.name && currentSkill.level) {
      setFormData((prevData) => ({
        ...prevData,
        skills: {
          ...prevData.skills,
          [currentSkill.name]: currentSkill.level,
        },
      }));
      setIsEditingSkill(false);
      setCurrentSkill({ name: '', level: '' }); // Formu sıfırla
    }
  };

  const handleAddSkill = () => {
    setCurrentSkill({ name: '', level: 'BEGINNER' }); // Yeni yetenek formunu sıfırla
    setIsAddingSkill(true);
  };

  const handleSkillAdd = () => {
    if (currentSkill.name && currentSkill.level) {
      setFormData((prevData) => ({
        ...prevData,
        skills: {
          ...prevData.skills,
          [currentSkill.name]: currentSkill.level,
        },
      }));
      setIsAddingSkill(false);
      setCurrentSkill({ name: '', level: '' }); // Formu sıfırla
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Her denemede mesajları sıfırla
    
    try {
      // Profil bilgilerini güncelle
      await updateUser(formData);
      console.log(formData);

      // Profil fotoğrafı seçildiyse güncelle
      const photoInput = document.getElementById('profilePhoto');
      if (photoInput.files[0]) {
        await updateProfilePhoto(photoInput.files[0]);
      }

      // CV seçildiyse güncelle
      const cvInput = document.getElementById('cvUpload');
      if (cvInput.files[0]) {
        await uploadCV(cvInput.files[0]);
      }

      setSuccessMessage('Profil başarıyla güncellendi!'); // Başarı mesajını ayarla
      setTimeout(() => {
        setSuccessMessage(null); // 3 saniye sonra mesajı kaldır
        navigate('/'+localStorage.getItem('username')); // Ana sayfaya yönlendir
      }, 3000);
    } catch (error) {
      setError(error);
    }
  };

  const handleAddContact = () => {
    setCurrentContact({ platform: 'GITHUB', url: '' }); // Varsayılan olarak GitHub seçili
    setIsAddingContact(true);
  };

  const handleContactAdd = () => {
    if (currentContact.platform && currentContact.url) {
      setFormData((prevData) => ({
        ...prevData,
        contactAddresses: {
          ...prevData.contactAddresses,
          [currentContact.platform]: currentContact.url,
        },
      }));
      setIsAddingContact(false);
      setCurrentContact({ platform: '', url: '' });
    }
  };

  const handleContactEdit = (platform) => {
    setCurrentContact({ 
      platform: platform, 
      url: formData.contactAddresses[platform] 
    });
    setIsEditingContact(true);
  };

  const handleContactDelete = (platform) => {
    const updatedContacts = { ...formData.contactAddresses };
    delete updatedContacts[platform];
    setFormData({ ...formData, contactAddresses: updatedContacts });
  };

  const handleContactUpdate = () => {
    if (currentContact.platform && currentContact.url) {
      setFormData((prevData) => ({
        ...prevData,
        contactAddresses: {
          ...prevData.contactAddresses,
          [currentContact.platform]: currentContact.url,
        },
      }));
      setIsEditingContact(false);
      setCurrentContact({ platform: '', url: '' });
    }
  };

  // Profil fotoğrafı seçme fonksiyonu
  const handleProfilePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImageFile(file); // Dosyayı sakla
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl); // Önizleme için URL'i sakla
    }
  };

  // Profil fotoğrafı güncelleme fonksiyonu
  const handleProfilePhotoUpdate = async () => {
    if (selectedImageFile) {
      try {
        await updateProfilePhoto(selectedImageFile);
        setSuccessMessage('Profil fotoğrafı başarıyla güncellendi!');
        setTimeout(() => setSuccessMessage(null), 3000);
        // Seçimleri temizle
        setSelectedImageFile(null);
        setSelectedImage(null);
      } catch (error) {
        setError(error);
      }
    }
  };

  // CV yükleme fonksiyonu - direkt çalışacak
  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        await uploadCV(file);
        setSuccessMessage(`CV başarıyla yüklendi! (${file.name})`);
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        setError(error);
      }
    }
  };

  const handleAddExperience = () => {
    setCurrentExperience({
      companyName: '',
      startTime: '',
      endDate: '',
      position: 'INTERN'
    });
    setIsAddingExperience(true);
  };

  const handleExperienceAdd = () => {
    if (currentExperience.companyName && currentExperience.startTime) {
      setFormData(prevData => ({
        ...prevData,
        experiences: prevData.experiences == null ? [currentExperience] : [...prevData.experiences, currentExperience]
      }));
      setIsAddingExperience(false);
      setCurrentExperience({
        companyName: '',
        startTime: '',
        endDate: '',
        position: 'INTERN'
      });
    }
  };

  const handleExperienceEdit = (experience) => {
    setCurrentExperience({
      ...experience,
      index: formData.experiences.findIndex(exp => exp.id === experience.id)
    });
    setIsEditingExperience(true);
  };

  const handleExperienceDelete = async (index) => {
    try {
      const experienceToDelete = formData.experiences[index];
      
      if (formData.experiences.length === 1) {
        // Son deneyimi siliyoruz
        const response = await deleteExperience(experienceToDelete.id);
        if (response) {
          setFormData(prevFormData => ({
            ...prevFormData,
            experiences: []
          }));
          setSuccessMessage('Deneyim başarıyla silindi!');
          setTimeout(() => setSuccessMessage(null), 3000);
        }
      } else {
        // Birden fazla deneyim var, normal silme işlemi
        await deleteExperience(experienceToDelete.id);
        const updatedExperiences = formData.experiences.filter((_, i) => i !== index);
        setFormData(prevFormData => ({
          ...prevFormData,
          experiences: updatedExperiences
        }));
        setSuccessMessage('Deneyim başarıyla silindi!');
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (error) {
      console.error('Deneyim silinirken hata:', error);
      setError('Deneyim silinirken bir hata oluştu. Lütfen tekrar deneyin.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleExperienceUpdate = () => {
    if (currentExperience.companyName && currentExperience.startTime) {
      const updatedExperiences = formData.experiences.map((exp, index) =>
        index === currentExperience.index ? currentExperience : exp
      );
      setFormData(prevFormData => ({
        ...prevFormData,
        experiences: updatedExperiences == null ? [] : [...updatedExperiences]
      }));
      setIsEditingExperience(false);
      setCurrentExperience({
        companyName: '',
        startTime: '',
        endDate: '',
        position: 'INTERN'
      });
    }
  };

  // Position enum değerlerini eşleştiren bir obje oluşturalım
  const POSITION_TRANSLATIONS = {
    'Stajyer': 'INTERN',
    'Junior Geliştirici': 'JUNIOR',
    'Orta Seviye Geliştirici': 'MID_LEVEL',
    'Kıdemli Geliştirici': 'SENIOR'
  };

  // Türkçeden İngilizceye çeviri için yardımcı fonksiyon
  const getPositionEnum = (turkishPosition) => {
    return Object.entries(POSITION_TRANSLATIONS).find(([key]) => key === turkishPosition)?.[1] || 'INTERN';
  };

  // İngilizceden Türkçeye çeviri için yardımcı fonksiyon
  const getPositionTranslation = (enumValue) => {
    return Object.entries(POSITION_TRANSLATIONS).find(([_, value]) => value === enumValue)?.[0] || 'Stajyer';
  };

  return (
    <div className="login-container">
      <h2>Profil Düzenle</h2>
      {error && <div className="error-message">{error.message}</div>}
      {successMessage && <div className="success-message">{successMessage}</div>}
      
      {/* Profil Fotoğrafı ve CV Yükleme Butonları */}
      <div className="profile-actions">
        <div className="upload-button-container">
          <input
            type="file"
            id="profilePhoto"
            accept="image/*"
            onChange={handleProfilePhotoSelect}
            style={{ display: 'none' }}
          />
          <label htmlFor="profilePhoto" className="upload-button">
            📷 Profil Fotoğrafı Seç
          </label>
          {selectedImage && (
            <div className="selected-image-container">
              <div className="selected-image">
                <img src={selectedImage} alt="Seçilen profil fotoğrafı" />
              </div>
              <button 
                type="button" 
                className="confirm-button"
                onClick={handleProfilePhotoUpdate}
              >
                ✓ Onayla
              </button>
            </div>
          )}
        </div>

        <div className="upload-button-container">
          <input
            type="file"
            id="cvUpload"
            accept=".pdf,.doc,.docx"
            onChange={handleCVUpload}
            style={{ display: 'none' }}
          />
          <label htmlFor="cvUpload" className="upload-button">
            📄 CV Yükle
          </label>
        </div>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Ad</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Adınız"
          />
        </div>

        <div className="form-group">
          <label htmlFor="surname">Soyad</label>
          <input
            type="text"
            id="surname"
            name="surname"
            value={formData.surname}
            onChange={handleChange}
            placeholder="Soyadınız"
          />
        </div>

        <div className="form-group">
          <label htmlFor="university">Üniversite</label>
          <input
            type="text"
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="Üniversite"
          />
        </div>
        <div className="form-group">
          <label htmlFor="job">İş</label>
          <input
            type="text"
            id="job"
            name="job"
            placeholder="İşinizi girin"
            value={formData.job}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="area">Alan</label>
          <input
            type="text"
            id="area"
            name="area"
            placeholder="Alanınızı girin"
            value={formData.area}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="aboutMe">Hakkımda</label>
          <textarea
            id="aboutMe"
            name="aboutMe"
            placeholder="Hakkınızda bilgi girin"
            value={formData.aboutMe}
            onChange={handleChange}
            required
            cols="52"
            rows="10"
          />
        </div>

        {/* Yetenek Bölümü */}
        <div className="form-group">
          <div className="section-header">
            <h3>Yetenekler</h3>
            <button type="button" className="add-button" onClick={handleAddSkill}>
              ➕ Yetenek Ekle
            </button>
          </div>
          <ul className="skills-list">
            {Object.entries(formData.skills).map(([key, value]) => (
              <li key={key}>
                <span>{key}: {value}</span>
                <div>
                  <button type="button" onClick={() => handleSkillEdit(key)}>✏️</button>
                  <button type="button" onClick={() => handleSkillDelete(key)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* İletişim Adresleri Bölümü */}
        <div className="form-group">
          <div className="section-header">
            <h3>İletişim Adresleri</h3>
            <button type="button" className="add-button" onClick={handleAddContact}>
              ➕ İletişim Adresi Ekle
            </button>
          </div>
          <ul className="skills-list">
            {Object.entries(formData.contactAddresses).map(([platform, url]) => (
              url && (
                <li key={platform}>
                  <span>{platform}: {url}</span>
                  <div>
                    <button type="button" onClick={() => handleContactEdit(platform)}>✏️</button>
                    <button type="button" onClick={() => handleContactDelete(platform)}>🗑️</button>
                  </div>
                </li>
              )
            ))}
          </ul>
        </div>

        {/* Deneyimler Bölümü */}
        <div className="form-group">
          <div className="section-header">
            <h3>Deneyimler</h3>
            <button type="button" className="add-button" onClick={handleAddExperience}>
              ➕ Deneyim Ekle
            </button>
          </div>
          <ul className="skills-list">
            {formData.experiences.map((experience, index) => (
              <li key={index}>
                <span>
                  {experience.companyName} - {getPositionTranslation(experience.position)}<br />
                  {new Date(experience.startTime).toLocaleDateString()} - 
                  {experience.endDate ? new Date(experience.endDate).toLocaleDateString() : 'Devam Ediyor'}
                </span>
                <div>
                  <button type="button" onClick={() => handleExperienceEdit(experience)}>✏️</button>
                  <button type="button" onClick={() => handleExperienceDelete(index)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Güncelle butonu en altta */}
        <button type="submit" className="login-button">Güncelle</button>
      </form>

      {/* Yetenek Düzenleme Penceresi */}
      {isEditingSkill && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yetenek Düzenle</h3>
            <label htmlFor="editSkillName">Yetenek Adı</label>
            <input
              type="text"
              id="editSkillName"
              value={currentSkill.name}
              readOnly
            />
            <label htmlFor="editSkillLevel">Yetenek Seviyesi</label>
            <select
              id="editSkillLevel"
              value={currentSkill.level}
              onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value })}
            >
              <option value="BEGINNER">Başlangıç</option>
              <option value="INTERMEDIATE">Orta</option>
              <option value="ADVANCED">İleri</option>
              <option value="FUNCTIONAL">Fonksiyonel</option>
            </select>
            <button type="button" onClick={handleSkillUpdate}>Düzenle</button>
            <button type="button" onClick={() => setIsEditingSkill(false)}>Kapat</button>
          </div>
        </div>
      )}

      {/* Yetenek Ekleme Penceresi */}
      {isAddingSkill && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yeni Yetenek Ekle</h3>
            <label htmlFor="addSkillName">Yetenek Adı</label>
            <input
              type="text"
              id="addSkillName"
              value={currentSkill.name}
              onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
            />
            <label htmlFor="addSkillLevel">Yetenek Seviyesi</label>
            <select
              id="addSkillLevel"
              value={currentSkill.level}
              onChange={(e) => setCurrentSkill({ ...currentSkill, level: e.target.value })}
            >
              <option value="BEGINNER">Başlangıç</option>
              <option value="INTERMEDIATE">Orta</option>
              <option value="ADVANCED">İleri</option>
              <option value="FUNCTIONAL">Fonksiyonel</option>
            </select>
            <button type="button" onClick={handleSkillAdd}>Ekle</button>
            <button type="button" onClick={() => setIsAddingSkill(false)}>Kapat</button>
          </div>
        </div>
      )}

      {/* İletişim Adresi Ekleme Modalı */}
      {isAddingContact && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yeni İletişim Adresi Ekle</h3>
            <label htmlFor="contactPlatform">Platform</label>
            <select
              id="contactPlatform"
              value={currentContact.platform}
              onChange={(e) => setCurrentContact({ ...currentContact, platform: e.target.value })}
            >
              <option value="GITHUB">GitHub</option>
              <option value="LINKEDIN">LinkedIn</option>
              <option value="GMAIL">Gmail</option>
              <option value="WEBSITE">Website</option>
              <option value="TWITTER">Twitter</option>
              <option value="INSTAGRAM">Instagram</option>
              <option value="FACEBOOK">Facebook</option>
              <option value="SLACK">Slack</option>
              <option value="DEVTO">Dev.to</option>
              <option value="STACKOVERFLOW">Stack Overflow</option>
              <option value="DISCORD">Discord</option>
              <option value="MEDIUM">Medium</option>
              <option value="LEETCODE">LeetCode</option>
              <option value="HACKERRANK">HackerRank</option>
              <option value="OTHER">Diğer</option>
            </select>
            <label htmlFor="contactUrl">Link</label>
            <input
              type="url"
              id="contactUrl"
              value={currentContact.url}
              onChange={(e) => setCurrentContact({ ...currentContact, url: e.target.value })}
              placeholder="https://"
            />
            <button type="button" onClick={handleContactAdd}>Ekle</button>
            <button type="button" onClick={() => setIsAddingContact(false)}>Kapat</button>
          </div>
        </div>
      )}

      {/* İletişim Adresi Düzenleme Modalı */}
      {isEditingContact && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>İletişim Adresi Düzenle</h3>
            <label htmlFor="editContactPlatform">Platform</label>
            <input
              type="text"
              id="editContactPlatform"
              value={currentContact.platform}
              readOnly
            />
            <label htmlFor="editContactUrl">Link</label>
            <input
              type="url"
              id="editContactUrl"
              value={currentContact.url}
              onChange={(e) => setCurrentContact({ ...currentContact, url: e.target.value })}
              placeholder="https://"
            />
            <button type="button" onClick={handleContactUpdate}>Düzenle</button>
            <button type="button" onClick={() => setIsEditingContact(false)}>Kapat</button>
          </div>
        </div>
      )}

      {/* Deneyim Ekleme Modalı */}
      {isAddingExperience && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Yeni Deneyim Ekle</h3>
            <label htmlFor="companyName">Şirket Adı</label>
            <input
              type="text"
              id="companyName"
              value={currentExperience.companyName}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                companyName: e.target.value
              })}
              required
            />
            <label htmlFor="position">Pozisyon</label>
            <select
              id="position"
              value={getPositionTranslation(currentExperience.position)}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                position: getPositionEnum(e.target.value)
              })}
            >
              {Object.keys(POSITION_TRANSLATIONS).map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <label htmlFor="startTime">Başlangıç Tarihi</label>
            <input
              type="date"
              id="startTime"
              value={currentExperience.startTime}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                startTime: e.target.value
              })}
              required
            />
            <label htmlFor="endTime">Bitiş Tarihi</label>
            <input
              type="date"
              id="endTime"
              value={currentExperience.endDate}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                endDate: e.target.value
              })}
            />
            <button type="button" onClick={handleExperienceAdd}>Ekle</button>
            <button type="button" onClick={() => setIsAddingExperience(false)}>Kapat</button>
          </div>
        </div>
      )}

      {/* Deneyim Düzenleme Modalı */}
      {isEditingExperience && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Deneyim Düzenle</h3>
            <label htmlFor="editCompanyName">Şirket Adı</label>
            <input
              type="text"
              id="editCompanyName"
              value={currentExperience.companyName}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                companyName: e.target.value
              })}
              required
            />
            <label htmlFor="editPosition">Pozisyon</label>
            <select
              id="editPosition"
              value={getPositionTranslation(currentExperience.position)}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                position: getPositionEnum(e.target.value)
              })}
            >
              {Object.keys(POSITION_TRANSLATIONS).map(position => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
            <label htmlFor="editStartTime">Başlangıç Tarihi</label>
            <input
              type="date"
              id="editStartTime"
              value={currentExperience.startTime}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                startTime: e.target.value
              })}
              required
            />
            <label htmlFor="editEndTime">Bitiş Tarihi</label>
            <input
              type="date"
              id="editEndTime"
              value={currentExperience.endDate}
              onChange={(e) => setCurrentExperience({
                ...currentExperience,
                endDate: e.target.value
              })}
            />
            <button type="button" onClick={handleExperienceUpdate}>Düzenle</button>
            <button type="button" onClick={() => setIsEditingExperience(false)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfileEdit;