import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css";
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      sessionStorage.setItem('username', username); 
      navigate('/chat');
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleLogin();
    }
  };
  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Welcome to ChatApp</h2>
        <input
          className="login-input"
          placeholder="Enter your name"
          value={username}
          onKeyDown={handleKeyDown}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button
          className="login-button"
          disabled={!username.trim()}
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginPage;
