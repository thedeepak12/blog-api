import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import PostPage from './pages/PostPage';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
  };

  return (
    <div className="bg-gray-900 min-h-screen">
      <Routes>
        <Route
          path="/"
          element={<Home onLogout={handleLogout} isAuthenticated={!!token} />}
        />
        <Route
          path="/posts/:id"
          element={<PostPage onLogout={handleLogout} isAuthenticated={!!token} />}
        />
        <Route path="/login" element={<LoginForm setToken={setToken} />} />
        <Route path="/signup" element={<SignupForm setToken={setToken} />} />
      </Routes>
    </div>
  );
}

export default App;
