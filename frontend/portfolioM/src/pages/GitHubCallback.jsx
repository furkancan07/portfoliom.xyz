import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GitHubCallback({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL'den parametreleri al
        const token = searchParams.get('token');
        const username = searchParams.get('username');
        const userId = searchParams.get('userId');

        if (token && username) {
          // Token ve kullanıcı bilgilerini localStorage'a kaydet
          localStorage.setItem('token', token);
          localStorage.setItem('username', username);
          
          // Kullanıcı nesnesini oluştur ve kaydet
          const user = {
            id: userId,
            username: username
          };
          localStorage.setItem('user', JSON.stringify(user));

          onLogin(); // isLoggedIn state'ini güncelle
          navigate('/');
        } else {
          console.error('Token veya username bulunamadı');
          navigate('/login');
        }
      } catch (error) {
        console.error('Giriş hatası:', error);
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate, searchParams, onLogin]);

  return (
    <div className="loading-container">
      <div className="loading">Giriş yapılıyor, lütfen bekleyin...</div>
    </div>
  );
}

export default GitHubCallback;
