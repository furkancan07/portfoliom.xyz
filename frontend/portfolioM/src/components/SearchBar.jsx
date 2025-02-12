import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchUsers } from '../server/api';
import SearchIcon from '@mui/icons-material/Search';
import './SearchBar.css';
import defaultAvatar from '../assets/user.png'

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);
  const MIN_SEARCH_LENGTH = 3; // Minimum arama uzunluğu
  const DEBOUNCE_DELAY = 500; // Bekleme süresi 500ms'ye çıkarıldı

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Önceki timeout'u temizle
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Arama terimi boş veya minimum uzunluktan kısaysa, sonuçları temizle
    if (!searchTerm.trim() || searchTerm.trim().length < MIN_SEARCH_LENGTH) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

    // Son aramadan bu yana DEBOUNCE_DELAY ms geçmesini bekle
    searchTimeout.current = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await searchUsers(searchTerm);
        if (response.data?.data) {
          setUsers(response.data.data);
          setShowDropdown(true);
        }
      } catch (error) {
        console.error('Arama hatası:', error);
        setUsers([]);
        setShowDropdown(false);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_DELAY);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [searchTerm]);

  const handleUserClick = (username) => {
    navigate(`/${username}`);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="search-container" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          placeholder={`Kullanıcı Ara`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button 
          className="search-button"
          style={{
            minWidth: '35px',
            width: '35px',
            padding: '0.6rem',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: 'red',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}
          disabled={loading || searchTerm.length < MIN_SEARCH_LENGTH}
        >
          <SearchIcon style={{ fontSize: '1.1rem' }} />
        </button>
        {loading && <div className="search-loading">Aranıyor...</div>}
        {!loading && searchTerm.length > 0 && searchTerm.length < MIN_SEARCH_LENGTH && (
          <div className="search-info">
            {MIN_SEARCH_LENGTH - searchTerm.length} karakter daha...
          </div>
        )}
      </div>

      {showDropdown && users.length > 0 && (
        <div className="search-dropdown">
          {users.map((user) => (
            <div
              key={user.id}
              className="user-item"
              onClick={() => handleUserClick(user.username)}
            >
              <img
                src={user.profilePhotoUrl || defaultAvatar}
                alt={user.username}
                className="user-avatar"
              />
              <div className="user-info">
                <span className="user-name">{user.name} {user.surname}</span>
                <span className="user-username">@{user.username}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 