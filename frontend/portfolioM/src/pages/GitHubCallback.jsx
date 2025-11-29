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
        const accessToken = searchParams.get('accessToken');
        const refreshToken = searchParams.get('refreshToken');

        // Eğer URL'de token varsa cookie'ye kaydet (Backend set etmediyse)
        if (accessToken) {
          document.cookie = `access_token=${accessToken}; path=/; max-age=900; SameSite=Lax`; // 15 dk
        }
        if (refreshToken) {
          document.cookie = `refresh_token=${refreshToken}; path=/; max-age=604800; SameSite=Lax`; // 7 gün
        }

        // Token artık cookie'de, sadece username kaydediyoruz
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
          // Hata olsa bile belki token vardır, ana sayfaya gitmeyi dene
          if (accessToken || document.cookie.includes('access_token')) {
            navigate('/');
          } else {
            navigate('/login');
          }
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
