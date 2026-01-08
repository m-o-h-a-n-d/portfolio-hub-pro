# Portfolio Hub Pro - API Documentation

This document outlines the required Backend Endpoints and the structure for Real-Time Notifications. The frontend is currently using JSON mock files located in `src/api/mockData/`.

## Switching from JSON to Real API

To switch from mock data to a real backend:
1. Open `src/api/request.js`.
2. Change the `BASE_URL` to your backend API URL.
3. Ensure your backend returns data in the same structure as the JSON files (detailed below).
4. The `apiGet`, `apiPost`, `apiPut`, and `apiDelete` functions will automatically start hitting your real endpoints.

---

## Endpoints Summary

| Entity | Method | Endpoint | Description |
|--------|--------|----------|-------------|
| **Profile** | GET | `/profile` | Get user profile information |
| | POST | `/profile` | Update profile information |
| **Services** | GET | `/services` | Get list of services |
| | POST | `/services` | Add/Update a service |
| **Resume** | GET | `/resume` | Get resume data (education, experience) |
| | POST | `/resume` | Update resume data |
| **Portfolio** | GET | `/portfolio` | Get portfolio projects |
| | POST | `/portfolio` | Add/Update a project |
| **Blogs** | GET | `/blog` | Get blog posts |
| | POST | `/blog` | Add/Update a blog post |
| **Testimonials** | GET | `/testimonials` | Get client testimonials |
| | POST | `/testimonials` | Add/Update a testimonial |
| **Messages** | GET | `/messages` | Get contact messages |
| | POST | `/messages` | Send a new message (Public) |
| | DELETE | `/messages/{id}` | Delete a message |

---

## Data Structures (JSON/API Consistency)

### 1. Testimonials
**Endpoint:** `/testimonials`
```json
{
  "testimonials": [
    {
      "id": 1,
      "name": "Client Name",
      "avatar": "url_to_image",
      "text": "Feedback text",
      "rating": 5,
      "date": "2024-01-01"
    }
  ]
}
```

### 2. Blogs
**Endpoint:** `/blog`
```json
{
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "category": "Design",
      "date": "2024-01-01",
      "image": "url_to_image",
      "excerpt": "Short summary",
      "content": "Full HTML or Markdown content",
      "link": "https://external-link.com"
    }
  ]
}
```

### 3. Messages (Notifications)
**Endpoint:** `/messages`
```json
{
  "messages": [
    {
      "id": 1,
      "name": "Sender Name",
      "email": "sender@example.com",
      "message": "Message content",
      "date": "2024-01-01T10:00:00Z",
      "read": false
    }
  ],
  "unread_count": 1
}
```

---

## Real-Time Notifications (Laravel Echo / Pusher)

The project uses **Laravel Echo** for real-time notifications. The configuration is in `src/echo.js`.

### Backend Requirements:
1. **Channel Name:** `private-admin-notifications` (Requires authentication).
2. **Event Name:** `.NewContactMessage` (Note the dot prefix if using Laravel).
3. **Payload Structure:**
```json
{
  "id": 123,
  "sender_name": "John Doe",
  "sender_email": "john@example.com",
  "message": "Hello, I want to work with you!",
  "created_at": "2024-01-08T12:00:00Z"
}
```

### Frontend Handling:
The `NotificationContext.jsx` listens to this channel. When an event is received:
- It adds the new message to the `notifications` state.
- It increments the `unreadCount`.
- It triggers a visual Toast notification.
- The Navbar (DashboardLayout) reflects these changes immediately.

---

## Implementation Details for Backend Developers

- **Authentication:** The frontend expects a Bearer Token for admin routes.
- **CORS:** Ensure your backend allows requests from the frontend domain.
- **Image Uploads:** The admin panel sends images as Base64 strings. Your backend should handle Base64 decoding or be updated to use `Multipart/Form-Data`.
- **Soft Deletes:** Recommended for messages and testimonials.
