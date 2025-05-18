import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import ChatPage from './ChatPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
  <Routes>
    <Route path="/login" element={<LoginPage/>} />
    <Route path="/chat" element={<ChatPage/>} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
</Router>
);
