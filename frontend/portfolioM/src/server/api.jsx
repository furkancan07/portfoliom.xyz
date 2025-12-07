import axios from 'axios';

// dev mi prod mu ona göre url ayarla burda
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment
  ? '/api/v1'  // geliştirme ortamında proxy var
  : '/api/v1'; // canlıda da aynı şekilde

// axios objesi yaptık burda api istekleri için
const api = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// kullanıcıyı çıkış yaptırmak için fonksiyon
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('username');
  window.location.href = '/login'; // login sayfasına gönder
};

// istek gitmeden önce token ekle
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

// gelen cevaları kontrol et
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // token bozuksa kullanıcıyı atsın dışarı
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('user');

      // tekrar giriş yapsın
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// kullanıcı kayıt fonksiyonu
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

// giriş yapma fonksiyonu
export const loginUser = async (body) => {
  try {
    const response = await api.post('/auth/login', body);
    return response.data;
  } catch (error) {
    console.error("Giriş hatası:", error);
    throw error.response?.data || error.message;
  }
};

// profil güncellemek için
export const updateUser = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(
      `${baseURL}/user/update`,
      {
        name: userData.name,
        surname: userData.surname,
        university: userData.university,
        job: userData.job,
        area: userData.area,
        aboutMe: userData.aboutMe,
        skills: userData.skills,
        contactAddresses: userData.contactAddresses,
        experiences: userData.experiences // deneyimler buraya ekleniyo
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// kullanıcı bilgilerini çek, token olmadan da olur
export const fetchUserData = async (username) => {
  try {
    // direkt git token şart değil
    const response = await axios.get(`${baseURL}/user/username/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// çıkış yap ve localdeki herşeyi temizle
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// pp değiştirme
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

// cv yi yükle
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

// kullanıcının projelerini getir token gerek yok
export const getUserProjects = async (userId) => {
  try {
    // tokensz da çalışıyo
    const response = await axios.get(`${baseURL}/project/list/project/${userId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// tage göre filtrele projeleri
export const getUserProjectsByTag = async (userId, tag) => {
  try {
    const response = await api.get(`/project/list/project/${userId}/${tag}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// projeyi güncelle
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

// bi projenin detayını çek
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

// projeyi sil
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

export const reorderProjects = (projectIds) => {
  return axios.put(`${baseURL}/project/reorder`, {
    projectIds: projectIds
  }, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};

// deneyimleri çek token olmasa da olur
export const getUserExperiences = async (username) => {
  try {
    // token şartt değil
    const response = await axios.get(`${baseURL}/experience/${username}`);
    return response.data;
  } catch (error) {
    console.error('Deneyimler getirilemedi:', error);
    return { data: [] };
  }
};

// deneyimi sil
export const deleteExperience = async (experienceId) => {
  try {
    const response = await api.delete(`/experience/delete/${experienceId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export {
  api as default,
  // diğer exportlar
};