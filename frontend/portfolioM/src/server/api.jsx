import axios from 'axios';

// Development ve production URL'lerini ayır
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment 
  ? '/api/v1'  // Development'da proxy kullan
  : '/api/v1'; // Production'da da proxy kullan

// Axios instance oluştur
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Otomatik çıkış fonksiyonu
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
  window.location.href = '/login'; // Sayfayı login'e yönlendir
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Token geçersiz, çıkış yap
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');
      
      // Login sayfasına yönlendir
      window.location.href = '/login';
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
    const requestData = {
      name: userData.name,
      surname: userData.surname,
      university: userData.university,
      job: userData.job,
      area: userData.area,
      aboutMe: userData.aboutMe,
      skills: userData.skills,
      contactAddresses: userData.contactAddresses
    };

    const response = await api.put('/user/update', requestData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Kullanıcı verilerini almak için API isteği
export const fetchUserData = async (username) => {
  try {
    const response = await api.get(`/user/username/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Çıkış işlemi (token temizleme)
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
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

// Kullanıcının tüm projelerini getir
export const getUserProjects = async (userId) => {
  try {
    const response = await api.get(`/project/list/project/${userId}`);
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
    const response = await api.delete(`/project/delete/${projectId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export {
  api as default,
  // ... diğer export'lar
};