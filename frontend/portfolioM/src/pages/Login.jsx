import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../server/api'; // API fonksiyonunu içe aktar
import '../Login.css';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import logo from '../assets/logo.png'
import GitHubIcon from '@mui/icons-material/GitHub';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState(null); // Hata durumu
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await loginUser(formData);
      // Token artık cookie'de, sadece username kaydediyoruz
      localStorage.setItem('username', formData.username);
      if (response.data?.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      onLogin(); // isLoggedIn state'ini güncelle
      
      // Cookie'lerin browser'a yüklenmesi için kısa bir gecikme
      await new Promise(resolve => setTimeout(resolve, 100));
      
      navigate('/');
    } catch (error) {
      setError(error);
    }
  };

  const handleGitHubLogin = () => {
    window.location.href = 'https://portfoliom-is7q.onrender.com/oauth2/authorization/github'; // GitHub OAuth2 yönlendirmesi
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Logo" className="logo" />
      <h2>Giriş Yap</h2>
      {error && <div className="error-message">{error.message}</div>} {/* Hata mesajını göster */}
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
        <button type="submit" className="login-button">Giriş Yap</button>
        <button type="button" className="github-button" onClick={handleGitHubLogin}>
          <GitHubIcon className="github-icon" /> GitHub ile Giriş Yap
        </button>
        <p className="register-text">
          Hesabınız yok mu? <span className="register-link" onClick={() => navigate('/register')}>Kayıt Ol</span>
        </p>
      </form>
    </div>
  );
}

export default Login;
