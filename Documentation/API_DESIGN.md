# API Design

## Overview
This document details the API endpoints for the Customizable Multi-Client Chat Widget Platform. Endpoints are grouped by resource and include method, path, request/response shape, authentication, and error handling notes.

---

## Authentication
- **Admin endpoints:** Require JWT or session-based authentication.
- **Widget endpoints:** Use widget ID and secret for secure access.
- **Client dashboard endpoints:** Read-only, scoped to widget/client.

---

## Endpoints

### Clients
- `GET /api/clients` (admin)
  - List all clients
- `POST /api/clients` (admin)
  - Create a new client
- `GET /api/clients/:clientId` (admin)
  - Get client details
- `PUT /api/clients/:clientId` (admin)
  - Update client info
- `DELETE /api/clients/:clientId` (admin)
  - Delete client and all widgets

### Widgets
- `GET /api/widgets` (admin)
  - List all widgets (optionally filter by client)
- `POST /api/widgets` (admin)
  - Create a new widget for a client
- `GET /api/widgets/:widgetId` (admin)
  - Get widget details/config
- `PUT /api/widgets/:widgetId` (admin)
  - Update widget config, webhook, etc.
- `DELETE /api/widgets/:widgetId` (admin)
  - Delete widget

### Chat (Widget API)
- `POST /api/widgets/:widgetId/chat`
  - **Auth:** Widget secret in header
  - **Request:** `{ message: string, user_id?: string }`
  - **Response:** `{ response: string, confidence: number }`
  - **Notes:** Forwards to n8n webhook, logs chat, returns response

### Analytics
- `GET /api/widgets/:widgetId/analytics`
  - **Auth:** Widget secret or client dashboard token
  - **Response:** `{ num_chats, avg_confidence, positive_feedback, negative_feedback, most_common_questions, ... }`
  - **Notes:** Read-only for client dashboard
- `GET /api/widgets/:widgetId/chat-logs` (admin)
  - List all chat logs for a widget

### Webhook Management
- `POST /api/widgets/:widgetId/test-webhook` (admin)
  - Test webhook URL, return status
- `GET /api/widgets/:widgetId/webhook-errors` (admin)
  - List recent webhook errors

### Admin Auth
- `POST /api/admin/login`
  - **Request:** `{ email, password }`
  - **Response:** `{ token }`
- `POST /api/admin/logout`

### Demo Widgets

#### Endpoints
- `POST /api/demo-widgets` (admin)
  - Create a new demo widget (minimal config, auto-expiry optional)
  - **Request:** `{ name, config, [expires_in_hours] }`
  - **Response:** `{ demoId, demoLink }`
- `GET /api/demo-widgets/:demoId`
  - Get demo widget details (public)
  - **If expired:** Returns a 'Demo expired' message
- `POST /api/demo-widgets/:demoId/chat`
  - Public chat endpoint for demo widget
  - **Request:** `{ message: string }`
  - **Response:** `{ response: string, confidence: number }`
  - **If expired:** Returns a 'Demo expired' message

#### Notes
- Demo widgets are accessible via a public link (e.g., `/demo/:demoId`).
- No authentication required for chat on demo widgets.
- Demo widgets may have limited features or auto-expiry (e.g., 24-48 hours, set by admin).
- After expiry, demo widgets and all related data (chat logs, analytics, webhook errors) are automatically deleted by a scheduled Supabase Edge Function.
- Admin can copy and share the demo link with clients for instant access.

---

## Request/Response Examples

### Chat Request
```json
{
  "message": "How can I reset my password?",
  "user_id": "session-123"
}
```

### Chat Response
```json
{
  "response": "To reset your password, click 'Forgot Password' on the login page...",
  "confidence": 0.92
}
```

### Analytics Response
```json
{
  "num_chats": 120,
  "avg_confidence": 0.87,
  "positive_feedback": 80,
  "negative_feedback": 10,
  "most_common_questions": ["How do I log in?", "What is my balance?"]
}
```

---

## Security, Rate Limiting, and Admin Controls

- **Rate Limiting:** All widget chat endpoints (including demo widgets) are rate limited to prevent abuse. Limits are enforced per IP and per widget.
- **Demo Widget Access:** Demo widget routes can be protected with basic auth (user/pass) if desired. Credentials are provided to the client.
- **API Key Security:** API keys and secrets are never exposed to users or in the frontend; only accessible by the admin and backend.
- **Alerting:** Alerting is in place for cleanup failures for both normal and demo widgets. Admins are notified if scheduled cleanup jobs fail.
- **Manual Cleanup:** Admin endpoints are available for manual cleanup of widgets, demo widgets, and all related data.

---

## Error Handling
- All errors return JSON with `error` and `message` fields.
- Example:
```json
{
  "error": "Unauthorized",
  "message": "Invalid widget secret."
}
```

---

## Extensibility Notes
- All endpoints are RESTful and versioned under `/api/`.
- Easy to add new resources (e.g., user management, advanced analytics) in the future.
- Consider GraphQL for more flexible queries if needed later. 