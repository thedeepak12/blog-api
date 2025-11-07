import { useState, useEffect } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import SignupForm from './pages/SignupForm';
import Dashboard from './pages/Dashboard';
import LoginForm from './pages/LoginForm';

type SetTokenType = Dispatch<SetStateAction<string | null>>;

const LoginWithProps = ({ setToken }: { setToken: SetTokenType }) => (
  <LoginForm setToken={setToken} />
);

const SignupFormWithProps = ({ setToken }: { setToken: SetTokenType }) => (
  <SignupForm setToken={setToken} />
);

function App() {
  const [token, setToken] = useState<string | null>(null);
  
  useEffect(() => {
    const storedToken = localStorage.getItem('adminToken');
    setToken(storedToken);
  }, []);
  
  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginWithProps setToken={setToken} />
          )
        } 
      />
      <Route 
        path="/signup" 
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <SignupFormWithProps setToken={setToken} />
          )
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          token ? (
            <Dashboard />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
      <Route 
        path="/" 
        element={
          token ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } 
      />
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router basename="/admin">
      <App />
    </Router>
  );
}

export default AppWrapper;
