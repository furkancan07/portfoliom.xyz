import axios from 'axios';

// Development ve production URL'lerini ayır
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api/v1'  // Development'da proxy kullan
  : '/api/v1'; // Production'da da proxy kullan

// Axios instance oluştur
// Cookie'ler otomatik gönderilmesi için withCredentials: true
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true // Cookie'leri otomatik gönder
});

// Otomatik çıkış fonksiyonu - SADECE manuel logout için kullanılmalı
const handleLogout = async () => {
  try {
    // Logout endpoint'ine istek gönder (cookie'leri temizlemek için)
    await api.delete('/auth/logout');
  } catch (error) {
    console.error('Logout hatası:', error);
  } finally {
    // LocalStorage'ı temizle
    localStorage.removeItem('username');
    localStorage.removeItem('user');
    // Login sayfasına yönlendir
    window.location.href = '/login';
  }
};

// Refresh token fonksiyonu
const refreshAccessToken = async () => {
  try {
    // Refresh endpoint'ine istek gönder (cookie'ler otomatik gidecek)
    const response = await api.post('/auth/refresh', {}, {
      withCredentials: true
    });
    return response.data; // Başarılı, yeni token cookie'ye set edildi
  } catch (error) {
    // Refresh başarısız - sadece hata döndür
    console.warn('Token refresh başarısız:', error.response?.status, error.response?.data);
    throw error;
  }
};

// Request interceptor - Artık token header eklenmiyor, cookie otomatik gidiyor
api.interceptors.request.use(
  (config) => {
    // Cookie'ler withCredentials: true ile otomatik gönderiliyor
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - 401 durumunda refresh token mekanizması
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const requestUrl = originalRequest?.url || '';

    // Login ve refresh endpoint'leri için interceptor devreye girmesin
    // Bu endpoint'lerde 401 hatası normal olabilir
    if (requestUrl.includes('/auth/login') || requestUrl.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // 401 hatası ve daha önce retry edilmemişse
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Public endpoint'ler için refresh token mekanizması devreye girmesin
      const isPublicEndpoint = requestUrl.includes('/user/username/') || 
                               requestUrl.includes('/project/list/project/') ||
                               requestUrl.includes('/experience/') ||
                               requestUrl.includes('/project/') && requestUrl.match(/\/project\/[^\/]+$/); // GET /project/{id}
      
      if (isPublicEndpoint) {
        // Public endpoint'ler için 401 normal olabilir (kaynak bulunamadı)
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Zaten refresh işlemi devam ediyorsa, kuyruğa ekle
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            // Cookie'ler otomatik gidiyor, header eklemeye gerek yok
            return api(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Refresh token isteği gönder
        await refreshAccessToken();
        processQueue(null, null);
        
        // Orijinal isteği tekrar dene (cookie'ler otomatik gidecek)
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Refresh başarısız - refresh token yoksa veya geçersizse logout yap
        if (refreshError.response?.status === 401) {
          console.warn('Refresh token yok veya geçersiz. Kullanıcı logout ediliyor.');
          // Refresh token geçersiz, kullanıcıyı logout yap
          await handleLogout();
        } else {
          console.error('Token refresh hatası:', refreshError);
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // 403 hatası için de logout yap (yetkisiz erişim)
    if (error.response?.status === 403) {
      console.warn('403 Forbidden - Kullanıcı logout ediliyor.');
      await handleLogout();
    }

    return Promise.reject(error);
  }
);

// Kullanıcı kaydı için API isteği
export const registerUser = async (userData) => {
  try {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify({
      username: userData.username,
      name: userData.name,
      surname: userData.surname,
      password: userData.password,
      email: userData.email,
    })], { type: 'application/json' });

    formData.append('request', jsonBlob);

    if (userData.file) {
      formData.append('file', userData.file);
    }

    const response = await api.post('/user/create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Kullanıcı girişi için API isteği
export const loginUser = async (body) => {
  try {
    const response = await api.post('/auth/login', body);
    return response.data;
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error.response?.data || error.message;
  }
};

// Kullanıcı verilerini güncellemek için API isteği
export const updateUser = async (userData) => {
  try {
    const response = await api.put(
      '/user/update',
      {
        name: userData.name,
        surname: userData.surname,
        university: userData.university,
        job: userData.job,
        area: userData.area,
        aboutMe: userData.aboutMe,
        skills: userData.skills,
        contactAddresses: userData.contactAddresses,
        experiences: userData.experiences // Yeni eklenen deneyimler alanı
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Kullanıcı verilerini almak için API isteği - token gerektirmez
export const fetchUserData = async (username) => {
  try {
    // Public endpoint, token gerektirmez
    const response = await axios.get(`${baseURL}/user/username/${username}`, {
      withCredentials: false // Public endpoint, cookie gönderme
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Çıkış işlemi
export const logoutUser = async () => {
  await handleLogout();
};

// Profil fotoğrafı güncelleme
export const updateProfilePhoto = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.patch('/user/profile-photo/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// CV yükleme
export const uploadCV = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.patch('/user/upload-cv', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const createProject = async (projectData, images) => {
  const formData = new FormData();
  
  formData.append('request', new Blob([JSON.stringify(projectData)], {
    type: 'application/json'
  }));

  images.forEach((image) => {
    formData.append(`file`, image);
  });

  try {
    const response = await api.post('/project/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response;
  } catch (error) {
    console.error('Proje oluşturma hatası:', error);
    throw error;
  }
};

// Kullanıcının projelerini getir - token gerektirmez
export const getUserProjects = async (userId) => {
  try {
    // Public endpoint, token gerektirmez
    const response = await axios.get(`${baseURL}/project/list/project/${userId}`, {
      withCredentials: false // Public endpoint, cookie gönderme
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Belirli bir tag'e göre projeleri getir
export const getUserProjectsByTag = async (userId, tag) => {
  try {
    const response = await api.get(`/project/list/project/${userId}/${tag}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Proje güncelleme fonksiyonu
export const updateProject = async (projectId, projectData) => {
  try {
    const requestData = {
      name: projectData.name,
      description: projectData.description,
      projectArea: projectData.projectArea,
      skills: projectData.skills,
      projectLink: projectData.projectLink
    };

    const response = await api.put(`/project/update/${projectId}`, requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tek bir projenin detaylarını getir
export const getProjectById = async (projectId) => {
  try {
    const response = await api.get(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const searchUsers = async (username) => {
  try {
    const response = await api.get(`/user/search/${username}`);
    console.log('Search API Response:', response); 
    return response;
  } catch (error) {
    console.error('Search API Error:', error);
    throw error;
  }
};

// Proje silme fonksiyonu
export const deleteProject = async (projectId) => {
  try {
    const response = await api.delete(`/project/delete/${projectId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const reorderProjects = (projectIds) => {
  return api.put('/project/reorder', {
    projectIds: projectIds
  });
};

// Deneyimleri getir - token gerektirmez
export const getUserExperiences = async (username) => {
  try {
    // Public endpoint, token gerektirmez
    const response = await axios.get(`${baseURL}/experience/${username}`, {
      withCredentials: false // Public endpoint, cookie gönderme
    });
    return response.data;
  } catch (error) {
    console.error('Deneyimler getirilemedi:', error);
    return { data: [] };
  }
};

// Deneyim silme fonksiyonu
export const deleteExperience = async (experienceId) => {
  try {
    const response = await api.delete(`/experience/delete/${experienceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Tüm fonksiyonlar zaten export const ile export edilmiş
// Sadece api'yi default export olarak export ediyoruz
export default api;