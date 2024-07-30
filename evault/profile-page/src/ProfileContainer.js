import React from 'react';
import './ProfileContainer.css';

function ProfileContainer({ username, onLogout }) {
  return (
    <div className="profile-container">
      <h2>Hi, {username}!</h2>
      <p>Manage your Google Account</p>
      <button onClick={onLogout}>Log out</button>
    </div>
  );
}

export default ProfileContainer;
