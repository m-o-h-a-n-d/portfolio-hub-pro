import { useState, createContext, useContext, useEffect } from 'react';
import { isAuthenticated, removeAuthToken, apiFetch, setAuthToken } from '../api/request';
import { useNavigate } from 'react-router-dom';

// Auth Context
const AuthContext = createContext(null);

// Custom hook
export const useAuth = () => useContext(AuthContext);

// Auth Provider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on mount
    const checkAuth = async () => {
      if (isAuthenticated()) {
        // In a real app, you'd fetch user data from API
        setUser({
          id: 1,
          name: 'Richard Hanrick',
          email: 'admin@example.com',
          role: 'admin'
        });
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await apiFetch('/auth/login', 'POST', { email, password });
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
      return { success: false, message: 'Login failed' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', 'POST');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      removeAuthToken();
      setUser(null);
      navigate('/admin/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <svg
          className="w-16 h-16 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            animationDuration: '3s',
          }}
        >
          {/* React Logo */}
          <circle
            cx="12"
            cy="12"
            r="2"
            fill="currentColor"
            className="text-primary"
          />
          {/* Electron orbits */}
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary/60"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary/60"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="8"
            ry="3"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-primary/60"
            transform="rotate(120 12 12)"
          />
          {/* Electrons */}
          <circle
            cx="20"
            cy="12"
            r="1.5"
            fill="currentColor"
            className="text-primary"
          />
          <circle
            cx="8"
            cy="16"
            r="1.5"
            fill="currentColor"
            className="text-primary"
          />
          <circle
            cx="8"
            cy="8"
            r="1.5"
            fill="currentColor"
            className="text-primary"
          />
        </svg>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
