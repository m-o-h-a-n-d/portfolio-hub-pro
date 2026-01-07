/* src/api/endpoints.js */

export const BASE_URL = "http://localhost:8000/api";

// ==========================================
// 1. Authentication
// ==========================================
// [POST] Login user & return Token
export const API_LOGIN = `${BASE_URL}/auth/login`;

// ==========================================
// 2. Global Settings
// ==========================================
// [GET] Fetch site settings (Logo, Favicon, Social Links)
export const API_SETTINGS_GET = `${BASE_URL}/settings`;
// [POST] Update site settings
export const API_SETTINGS_UPDATE = `${BASE_URL}/settings/update`;

// ==========================================
// 3. Profile Section
// ==========================================
// [GET] Get personal info (Name, Bio, Job, CV URL)
export const API_PROFILE_GET = `${BASE_URL}/profile`;
// [POST] Update profile info (Handle FormData for CV PDF)
export const API_PROFILE_UPDATE = `${BASE_URL}/profile/update`;

// ==========================================
// 4. Resume Section (Unified Array Structure)
// ==========================================
// [GET] Get full resume array (Skills, Education, Experience in order)
export const API_RESUME_GET = `${BASE_URL}/resume`;
// [POST] Update full resume array (Handles ordering and all data changes)
export const API_RESUME_UPDATE = `${BASE_URL}/resume/update`;

// ==========================================
// 5. Portfolio Section
// ==========================================
// [GET] List all projects
export const API_PORTFOLIO_LIST = `${BASE_URL}/portfolio`;
// [POST] Add new project (FormData for Image)
export const API_PORTFOLIO_CREATE = `${BASE_URL}/portfolio`;
// [PUT] Update project
export const API_PORTFOLIO_UPDATE = `${BASE_URL}/portfolio`;
// [DELETE] Delete project
export const API_PORTFOLIO_DELETE = `${BASE_URL}/portfolio`;

// ==========================================
// 6. Blog Section
// ==========================================
// [GET] List all blog posts
export const API_BLOG_LIST = `${BASE_URL}/blog`;
// [POST] Create blog post (FormData for Thumbnail)
export const API_BLOG_CREATE = `${BASE_URL}/blog`;
// [PUT] Update blog post
export const API_BLOG_UPDATE = `${BASE_URL}/blog`;
// [DELETE] Delete blog post
export const API_BLOG_DELETE = `${BASE_URL}/blog`;

// ==========================================
// 7. Testimonials & Clients
// ==========================================
// [GET] List testimonials
export const API_TESTIMONIALS_LIST = `${BASE_URL}/testimonials`;
// [POST] Add testimonial
export const API_TESTIMONIALS_CREATE = `${BASE_URL}/testimonials`;
// [DELETE] Delete testimonial
export const API_TESTIMONIALS_DELETE = `${BASE_URL}/testimonials`;

// [GET] List clients
export const API_CLIENTS_LIST = `${BASE_URL}/clients`;
// [POST] Add client
export const API_CLIENTS_CREATE = `${BASE_URL}/clients`;
// [DELETE] Delete client
export const API_CLIENTS_DELETE = `${BASE_URL}/clients`;

// ==========================================
// 8. Communication
// ==========================================
// [GET] List all contact messages
export const API_MESSAGES_LIST = `${BASE_URL}/messages`;
// [POST] Send a contact message (Public Site)
export const API_MESSAGE_SEND = `${BASE_URL}/contact`;
