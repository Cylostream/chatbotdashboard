# Project Plan: Customizable Multi-Client Chat Widget Platform

## Overview
A managed service platform for creating, customizing, and managing chat widgets for multiple clients. Each widget connects to a unique n8n workflow via webhooks, supports analytics, and is fully managed by the admin. Clients access only analytics via a read-only dashboard.

---

## 1. Architecture

### Components
- **Monorepo Structure**: Single repository containing both frontend (React) and backend (TypeScript API endpoints as Cloudflare Pages Functions).
- **Admin Dashboard**: React app (Cloudflare Pages) for managing clients, widgets, webhooks, and viewing analytics.
- **Client Dashboard**: (Already built) Displays analytics for each client's widgets.
- **Chat Widget**: Embeddable React/Web Component, unique per client, communicates with backend.
- **Backend API**: TypeScript (Cloudflare Pages Functions) for authentication, CRUD, analytics, webhook forwarding, and alerting. Uses Supabase JS client for database access.
- **Database**: PostgreSQL (Supabase) for storing clients, widgets, chat logs, analytics, and errors.
- **n8n Workflows**: Hosted on VPS, accessed via Cloudflare Tunnels, one unique webhook per client/widget.

---

## 2. Tech Stack
- **Frontend**: React (Admin Dashboard, Widget)
- **Backend**: TypeScript (Cloudflare Pages Functions)
- **Database**: PostgreSQL (Supabase)
- **Deployment**:
  - Monorepo deployed via Cloudflare Pages (frontend and backend together)
  - n8n: VPS + Cloudflare Tunnel
- **Database Access**: Supabase JS client, configured via environment variables in Cloudflare Pages

---

## 3. Project Structure Example

```
/ (repo root)
  /public                # Static assets (optional)
  /src                   # React frontend source code
    /components
    /pages
    ...
  /functions             # API endpoints (backend, serverless functions)
    widgets.ts           # e.g., /api/widgets
    analytics.ts         # e.g., /api/analytics
    webhook.ts           # e.g., /api/webhook
    ...
  package.json
  tsconfig.json
  ...
```

---

## 4. API Design Principles
- Endpoints are widget-centric (e.g., `/api/widgets/:widgetId/analytics`).
- Only admin-authenticated endpoints allow config changes.
- Analytics endpoints for the client dashboard are read-only and scoped to their widget(s).
- All endpoints designed to support multiple widgets per client in the future.

---

## 5. Widget Configuration & Security
- Each widget has a unique ID (UUID).
- Only the admin can update widget config (branding, webhook, etc.).
- Widget config fetched from backend using widget ID.
- Optionally, use a secret/token per widget for secure API calls.

---

## 6. Webhook Management & Alerting
- Webhook URLs are stored per widget in the DB.
- On save, backend tests webhook and alerts if unreachable.
- Periodic health checks (e.g., hourly) to verify webhooks are responsive.
- All webhook failures logged in `webhook_errors` table.
- Admin dashboard displays webhook health/errors; critical failures can trigger email/push notifications.

---

## 7. Analytics & Metrics
- Analytics stored in DB, keyed by widget/client ID.
- Metrics include: number of chats, average confidence score, user feedback, most common topics, response times.
- Analytics endpoints are read-only for clients.

---

## 8. Scalability & Maintainability
- Schema and API designed for future support of multiple widgets per client.
- All config and management actions are admin-only for security and simplicity.

---

## 9. Next Steps
1. Finalize production-ready DB schema and API routes.
2. Scaffold monorepo with React frontend and TypeScript backend (Cloudflare Pages Functions).
3. Build admin dashboard to manage widgets and view webhook health/errors.
4. Implement webhook health checks and error logging.
5. Integrate analytics into client dashboard (read-only API).
6. Test end-to-end flow: Widget → Backend → n8n → Backend → Widget, with analytics logging.

---

## 10. Database Schema

Below is the final, production-ready database schema. This design is scalable, supports multiple widgets per client, robust analytics, webhook error logging, and secure configuration. It uses best practices for field types, indexing, and relationships.

```sql
-- Clients table: stores client info
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    contact_email TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Widgets table: stores widget config and linkage to client
CREATE TABLE widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    config JSONB NOT NULL, -- branding, settings, etc.
    webhook_url TEXT NOT NULL,
    widget_secret TEXT NOT NULL, -- for secure API calls
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(client_id, name)
);
CREATE INDEX idx_widgets_client_id ON widgets(client_id);

-- Chat logs: stores all chat interactions for analytics and review
CREATE TABLE chat_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
    user_id TEXT, -- anonymous or session-based
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    confidence FLOAT,
    feedback TEXT, -- thumbs up/down, optional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_chat_logs_widget_id ON chat_logs(widget_id);
CREATE INDEX idx_chat_logs_created_at ON chat_logs(created_at);

-- Analytics: daily/periodic aggregates for dashboard
CREATE TABLE analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    num_chats INT DEFAULT 0,
    avg_confidence FLOAT DEFAULT 0,
    positive_feedback INT DEFAULT 0,
    negative_feedback INT DEFAULT 0,
    most_common_questions JSONB, -- array of top questions/topics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(widget_id, date)
);
CREATE INDEX idx_analytics_widget_id_date ON analytics(widget_id, date);

-- Webhook errors: logs failures for alerting and troubleshooting
CREATE TABLE webhook_errors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    widget_id UUID NOT NULL REFERENCES widgets(id) ON DELETE CASCADE,
    error_type TEXT,
    error_message TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_webhook_errors_widget_id ON webhook_errors(widget_id);
CREATE INDEX idx_webhook_errors_occurred_at ON webhook_errors(occurred_at);
```

**Notes:**
- All tables use UUIDs for primary keys for security and scalability.
- `config` in `widgets` is a JSONB field for flexible widget settings/branding.
- `widget_secret` is for secure backend/frontend communication.
- `analytics` table is designed for daily aggregates but can be extended for other periods.
- Indexes are added for efficient querying by widget, client, and date.
- Foreign keys use `ON DELETE CASCADE` for clean data removal.
- Feedback and most common questions are included for actionable analytics. 