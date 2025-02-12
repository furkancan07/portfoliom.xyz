import React, { useEffect, useState } from 'react';
import { Drawer, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchUserData } from '../server/api';
import './DrawerMenu.css';
import defaultAvatar from '../assets/user.png'


const DrawerMenu = ({ open, onClose, isLoggedIn, handleLogout }) => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (isLoggedIn && username) {
        try {
          const response = await fetchUserData(username);
          setUserData(response.data);
          // Profil fotoğrafı URL'sini localStorage'a kaydet
          if (response.data.profilePhotoUrl) {
            localStorage.setItem('user', JSON.stringify({
              ...JSON.parse(localStorage.getItem('user') || '{}'),
              profilePhotoUrl: response.data.profilePhotoUrl,
              name: response.data.name,
              surname: response.data.surname,
              job: response.data.job
            }));
          }
        } catch (error) {
          console.error('Kullanıcı bilgileri alınamadı:', error);
        }
      }
    };

    getUserData();
  }, [isLoggedIn, username]);

  const handleNavigation = (path) => {
    navigate(path);
    onClose(); // Navigasyondan sonra drawer'ı kapat
  };

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        '& .MuiDrawer-paper': {
          width: '300px',
          backgroundColor: 'var(--card-background)',
          color: 'var(--text-color)',
          position: 'relative',
        },
      }}
    >
      <div className="drawer-container">
        <div className="drawer-header">
          <button 
            className="close-drawer"
            onClick={onClose}
            aria-label="Close menu"
          >
            ×
          </button>
        </div>
        {isLoggedIn && (
          <div className="drawer-profile">
            <div className="drawer-image-container">
              <img 
                src={userData?.profilePhotoUrl || defaultAvatar} 
                alt="Profil" 
                className="drawer-profile-image"
              />
            </div>
            <h3 className="drawer-username">{userData?.name} {userData?.surname}</h3>
            <span className="drawer-role">{userData?.job || 'Yazılım Geliştirici'}</span>
          </div>
        )}

        <List className="drawer-list">
          <ListItem button className="drawer-item" onClick={() => handleNavigation('/')}>
            <ListItemText primary="Ana Sayfa" />
          </ListItem>

          {isLoggedIn ? (
            <>
              <ListItem button className="drawer-item" onClick={() => handleNavigation(`/${username}`)}>
                <ListItemText primary="Profilim" />
              </ListItem>
              <ListItem button className="drawer-item" onClick={() => handleNavigation('/profile-update')}>
                <ListItemText primary="Profil Düzenle" />
              </ListItem>
              <ListItem button className="drawer-item" onClick={() => handleNavigation('/projects')}>
                <ListItemText primary="Projeler" />
              </ListItem>
            </>
          ) : (
            <>
              <ListItem button className="drawer-item" onClick={() => handleNavigation('/login')}>
                <ListItemText primary="Giriş Yap" />
              </ListItem>
              <ListItem button className="drawer-item" onClick={() => handleNavigation('/register')}>
                <ListItemText primary="Kayıt Ol" />
              </ListItem>
            </>
          )}
        </List>

        {isLoggedIn && (
          <>
            <Divider className="drawer-divider" />
            <List className="drawer-list project-actions">
              <ListItem button className="drawer-item" onClick={() => handleNavigation('/add-project')}>
                <ListItemText primary="Proje Ekle" />
              </ListItem>
            </List>
            <Divider className="drawer-divider" />
            <List className="drawer-list">
              <ListItem button className="drawer-item logout" onClick={() => {
                handleLogout();
                onClose(); // Çıkış yaptıktan sonra drawer'ı kapat
              }}>
                <ListItemText primary="Çıkış Yap" />
              </ListItem>
            </List>
          </>
        )}
      </div>
    </Drawer>
  );
};

export default DrawerMenu; 