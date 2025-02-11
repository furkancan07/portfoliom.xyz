import React from 'react';

function Home() {
  return (
    <div className="home-container">
      <h1>Ana Sayfa</h1>
      <div className="search-container">
        <input type="text" placeholder="Kullanıcı Ara" />
        <button className="search-button">Ara</button>
      </div>
    </div>
  );
}

export default Home; 