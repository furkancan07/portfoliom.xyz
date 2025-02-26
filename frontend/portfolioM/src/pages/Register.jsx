import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate'i içe aktar
import { registerUser } from '../server/api'; // API fonksiyonunu içe aktar
import '../Login.css'; // Mevcut stil dosyasını kullanıyoruz
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    surname: '',
    password: '',
    email: '',
    file: null,
  });
  const [error, setError] = useState(null); // Hata durumu
  const [passwordVisible, setPasswordVisible] = useState(false); // Şifre görünürlüğü durumu
  const navigate = useNavigate(); // useNavigate hook'unu kullan

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, file: e.target.files[0] });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await registerUser(formData);
      onLogin(); // isLoggedIn state'ini güncelle
      navigate('/login');
    } catch (error) {
      setError(error);
    }
  };

  return (
    <div className="login-container">
      <h2>Kayıt Ol</h2>
      {error && <div className="error-message">{error.message}</div>}
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Kullanıcı Adı</label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Kullanıcı adınızı girin"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Ad</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Adınızı girin"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="surname">Soyad</label>
          <input
            type="text"
            id="surname"
            name="surname"
            placeholder="Soyadınızı girin"
            value={formData.surname}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Şifre</label>
          <div className="password-container">
            <input
              type={passwordVisible ? 'text' : 'password'}
              id="password"
              name="password"
              placeholder="Şifrenizi girin"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <IconButton
              className="toggle-password"
              onClick={togglePasswordVisibility}
              edge="end"
              aria-label="toggle password visibility"
            >
              {passwordVisible ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="email">E-posta</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="E-posta adresinizi girin"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="file">Profil Resmi</label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="login-button">Kayıt Ol</button>
      </form>
      <p className="register-text">
        Zaten hesabınız var mı? <span className="register-link" onClick={() => navigate('/login')}>Giriş Yap</span>
      </p>
    </div>
  );
}

export default Register; 