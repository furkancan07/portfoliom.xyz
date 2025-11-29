import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function GitHubCallback({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // URL'den parametreleri al
        const username = searchParams.get('username');
        const userId = searchParams.get('userId');

        // Token artık cookie'de (Backend tarafından set edildi), sadece username kaydediyoruz
        if (username) {
          localStorage.setItem('username', username);

          // Kullanıcı nesnesini oluştur ve kaydet
          if (userId) {
            const user = {
              id: userId,
              username: username
            };
            localStorage.setItem('user', JSON.stringify(user));
          }

          onLogin(); // isLoggedIn state'ini güncelle
          navigate('/');
        } else {
          console.error('Username bulunamadı. Parametreler:', Object.fromEntries(searchParams.entries()));
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
