// API Endpoints Configuration
// Base URL for Laravel Backend
export const BASE_URL = "http://localhost:8000/api";

// Authentication Endpoints
export const API_LOGIN = `${BASE_URL}/auth/login`;
export const API_LOGOUT = `${BASE_URL}/auth/logout`;
export const API_REFRESH = `${BASE_URL}/auth/refresh`;

// Profile Endpoints
export const API_PROFILE = `${BASE_URL}/profile`;
export const API_PROFILE_UPDATE = `${BASE_URL}/profile/update`;
export const API_PROFILE_AVATAR = `${BASE_URL}/profile/avatar`;
export const API_PROFILE_CV = `${BASE_URL}/profile/cv`;

// Resume Endpoints
export const API_RESUME = `${BASE_URL}/resume`;
export const API_EDUCATION = `${BASE_URL}/resume/education`;
export const API_EXPERIENCE = `${BASE_URL}/resume/experience`;
export const API_SKILLS = `${BASE_URL}/resume/skills`;

// Portfolio Endpoints
export const API_PORTFOLIO = `${BASE_URL}/portfolio`;
export const API_PORTFOLIO_CREATE = `${BASE_URL}/portfolio/create`;
export const API_PORTFOLIO_UPDATE = `${BASE_URL}/portfolio/update`;
export const API_PORTFOLIO_DELETE = `${BASE_URL}/portfolio/delete`;

// Blog Endpoints
export const API_BLOG = `${BASE_URL}/blog`;
export const API_BLOG_CREATE = `${BASE_URL}/blog/create`;
export const API_BLOG_UPDATE = `${BASE_URL}/blog/update`;
export const API_BLOG_DELETE = `${BASE_URL}/blog/delete`;

// Messages/Contact Endpoints
export const API_MESSAGES = `${BASE_URL}/messages`;
export const API_MESSAGES_READ = `${BASE_URL}/messages/read`;
export const API_MESSAGES_DELETE = `${BASE_URL}/messages/delete`;

// Services Endpoints
export const API_SERVICES = `${BASE_URL}/services`;

// Testimonials Endpoints
export const API_TESTIMONIALS = `${BASE_URL}/testimonials`;

// Clients Endpoints
export const API_CLIENTS = `${BASE_URL}/clients`;
