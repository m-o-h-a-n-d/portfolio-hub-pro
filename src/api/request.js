// API Request Wrapper with Mock Data Support
// Toggle this flag to switch between mock and real API
export const MOCK_MODE = true;

// Import mock data
import profileData from './mockData/profile.json';
import resumeData from './mockData/resume.json';
import portfolioData from './mockData/portfolio.json';
import blogData from './mockData/blog.json';
import messagesData from './mockData/messages.json';
import servicesData from './mockData/services.json';
import testimonialsData from './mockData/testimonials.json';
import clientsData from './mockData/clients.json';

// Mock data mapping
const mockDataMap = {
  '/profile': profileData,
  '/resume': resumeData,
  '/portfolio': portfolioData,
  '/blog': blogData,
  '/messages': messagesData,
  '/services': servicesData,
  '/testimonials': testimonialsData,
  '/clients': clientsData,
};

// Simulated network delay (300-800ms)
const simulateDelay = () => new Promise(resolve => 
  setTimeout(resolve, Math.random() * 500 + 300)
);

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

// Set auth token in localStorage
export const setAuthToken = (token) => {
  localStorage.setItem('auth_token', token);
};

// Remove auth token from localStorage
export const removeAuthToken = () => {
  localStorage.removeItem('auth_token');
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

/**
 * Main API Fetch Wrapper
 * @param {string} endpoint - API endpoint (e.g., '/profile', '/resume')
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE)
 * @param {object|FormData} body - Request body
 * @returns {Promise} - Response data
 */
export const apiFetch = async (endpoint, method = 'GET', body = null) => {
  // Mock Mode Logic
  if (MOCK_MODE) {
    await simulateDelay();
    
    // Handle authentication
    if (endpoint.includes('/auth/login')) {
      const credentials = body;
      // Mock login validation
      if (credentials?.email === 'admin@example.com' && credentials?.password === 'password') {
        const mockToken = 'mock_jwt_token_' + Date.now();
        setAuthToken(mockToken);
        return {
          success: true,
          token: mockToken,
          user: {
            id: 1,
            name: 'Richard Hanrick',
            email: 'admin@example.com',
            role: 'admin'
          }
        };
      } else {
        throw new Error('Invalid credentials');
      }
    }

    if (endpoint.includes('/auth/logout')) {
      removeAuthToken();
      return { success: true };
    }

    // Handle GET requests
    if (method === 'GET') {
      // Find matching mock data
      for (const [path, data] of Object.entries(mockDataMap)) {
        if (endpoint.includes(path)) {
          return { success: true, data };
        }
      }
      throw new Error('Endpoint not found');
    }

    // Handle POST/PUT requests (Create/Update)
    if (method === 'POST' || method === 'PUT') {
      console.log(`[Mock API] ${method} to ${endpoint}:`, body);
      return { 
        success: true, 
        message: 'Operation completed successfully',
        data: body 
      };
    }

    // Handle DELETE requests
    if (method === 'DELETE') {
      console.log(`[Mock API] DELETE ${endpoint}`);
      return { success: true, message: 'Item deleted successfully' };
    }

    throw new Error('Unknown request method');
  }

  // Real API Mode
  const headers = {
    'Accept': 'application/json',
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser will set it with boundary)
  if (body && !(body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = body instanceof FormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(endpoint, config);
    
    // Handle unauthorized response
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/admin/login';
      throw new Error('Session expired. Please login again.');
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Convenience methods
export const apiGet = (endpoint) => apiFetch(endpoint, 'GET');
export const apiPost = (endpoint, body) => apiFetch(endpoint, 'POST', body);
export const apiPut = (endpoint, body) => apiFetch(endpoint, 'PUT', body);
export const apiDelete = (endpoint) => apiFetch(endpoint, 'DELETE');

// File upload helper
export const apiUpload = async (endpoint, file, fieldName = 'file') => {
  const formData = new FormData();
  formData.append(fieldName, file);
  return apiFetch(endpoint, 'POST', formData);
};
