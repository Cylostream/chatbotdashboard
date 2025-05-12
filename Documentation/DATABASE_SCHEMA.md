# Database Schema

## Overview
This document details the production-ready database schema for the Customizable Multi-Client Chat Widget Platform. It is designed for scalability, security, and future-proofing, supporting multiple widgets per client, robust analytics, and webhook error logging.

---

## Complete PostgreSQL Schema for Supabase

The following SQL can be executed directly in the Supabase SQL Editor to create the complete database schema:

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients table: stores client info
CREATE TABLE public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    contact_email TEXT,
    company_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Widgets table: stores widget config and linkage to client
CREATE TABLE public.widgets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    config JSONB NOT NULL DEFAULT '{}', -- branding, settings, etc.
    webhook_url TEXT NOT NULL,
    widget_secret TEXT NOT NULL, -- for secure API calls
    is_active BOOLEAN DEFAULT TRUE,
    is_demo BOOLEAN DEFAULT FALSE, -- true for demo widgets
    expires_at TIMESTAMP WITH TIME ZONE, -- auto-expiry for demo widgets
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(client_id, name)
);
CREATE INDEX idx_widgets_client_id ON public.widgets(client_id);
CREATE INDEX idx_widgets_is_demo ON public.widgets(is_demo);
CREATE INDEX idx_widgets_expires_at ON public.widgets(expires_at) WHERE expires_at IS NOT NULL;

-- Chat logs: stores all chat interactions for analytics and review
CREATE TABLE public.chat_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
    user_id TEXT, -- anonymous or session-based
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    confidence FLOAT,
    feedback TEXT, -- thumbs up/down, optional
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_chat_logs_widget_id ON public.chat_logs(widget_id);
CREATE INDEX idx_chat_logs_created_at ON public.chat_logs(created_at);
CREATE INDEX idx_chat_logs_user_id ON public.chat_logs(user_id) WHERE user_id IS NOT NULL;

-- Analytics: daily/periodic aggregates for dashboard
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    num_chats INT DEFAULT 0,
    avg_confidence FLOAT DEFAULT 0,
    positive_feedback INT DEFAULT 0,
    negative_feedback INT DEFAULT 0,
    most_common_questions JSONB DEFAULT '[]', -- array of top questions/topics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(widget_id, date)
);
CREATE INDEX idx_analytics_widget_id_date ON public.analytics(widget_id, date);

-- Webhook errors: logs failures for alerting and troubleshooting
CREATE TABLE public.webhook_errors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    widget_id UUID NOT NULL REFERENCES public.widgets(id) ON DELETE CASCADE,
    error_type TEXT,
    error_message TEXT,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
CREATE INDEX idx_webhook_errors_widget_id ON public.webhook_errors(widget_id);
CREATE INDEX idx_webhook_errors_occurred_at ON public.webhook_errors(occurred_at);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.webhook_errors ENABLE ROW LEVEL SECURITY;

-- Create initial permissive policies for development
-- These should be refined for production security
CREATE POLICY "Enable all access for authenticated users" ON public.clients 
    FOR ALL USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.widgets 
    FOR ALL USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.chat_logs 
    FOR ALL USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.analytics 
    FOR ALL USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON public.webhook_errors 
    FOR ALL USING (auth.role() = 'authenticated') 
    WITH CHECK (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to update updated_at timestamp
CREATE TRIGGER update_clients_updated_at
BEFORE UPDATE ON public.clients
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_widgets_updated_at
BEFORE UPDATE ON public.widgets
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
```

### Execution Instructions for Supabase

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the entire SQL script above
4. Click "Run" to execute the script
5. Verify that all tables, indexes, and policies have been created successfully

---

## Table & Field Explanations

### `clients`
- **id**: Unique identifier for each client (UUID).
- **name**: Client's name (required).
- **contact_email**: For notifications and support.
- **company_name**: Optional, for B2B use.
- **created_at/updated_at**: Timestamps for record keeping.

### `widgets`
- **id**: Unique identifier for each widget (UUID).
- **client_id**: Foreign key to `clients` (supports multiple widgets per client).
- **name**: Widget name (unique per client).
- **config**: JSONB for flexible settings (branding, behavior, etc.).
- **webhook_url**: n8n workflow endpoint for this widget.
- **widget_secret**: Used for secure API calls from widget to backend.
- **is_active**: Soft delete/disable flag.
- **is_demo**: Boolean flag for demo widgets.
- **expires_at**: Timestamp for auto-expiry of demo widgets.
- **created_at/updated_at**: Timestamps for record keeping.

### `chat_logs`
- **id**: Unique identifier for each chat log entry.
- **widget_id**: Foreign key to `widgets`.
- **user_id**: Optional, for anonymous or session-based tracking.
- **message/response**: User message and bot response.
- **confidence**: Model confidence score for the response.
- **feedback**: User feedback (e.g., thumbs up/down).
- **created_at**: Timestamp for the chat event.

### `analytics`
- **id**: Unique identifier for each analytics record.
- **widget_id**: Foreign key to `widgets`.
- **date**: Aggregation period (daily).
- **num_chats**: Number of chats for the period.
- **avg_confidence**: Average confidence score.
- **positive_feedback/negative_feedback**: Feedback counts.
- **most_common_questions**: JSONB array of top questions/topics.
- **created_at**: Timestamp for the analytics record.

### `webhook_errors`
- **id**: Unique identifier for each error log.
- **widget_id**: Foreign key to `widgets`.
- **error_type**: Type/category of error (e.g., timeout, 500, unreachable).
- **error_message**: Error details for debugging.
- **occurred_at**: Timestamp for the error event.

---

## Indexing & Relationships
- All foreign keys use `ON DELETE CASCADE` for clean data removal.
- Indexes on `client_id`, `widget_id`, and `date` for efficient queries.
- Unique constraints to prevent duplicate widget names per client and duplicate analytics per widget/date.
- Partial indexes on nullable columns for better performance.

---

## Row Level Security (RLS)
- All tables have RLS enabled for security.
- Initial permissive policies for authenticated users are created for development.
- These policies should be refined for production to implement proper data segregation.

---

## Future Schema Evolution
- **Multi-widget per client:** Already supported by design.
- **New analytics:** Add columns or new tables for advanced metrics as needed.
- **User management:** Add a `users` table if client logins or roles are needed.
- **Audit logs:** Add a `change_logs` table if required in the future.
- **Widget versioning:** Add a `version` field or a `widget_versions` table for tracking changes.

## Demo Widget Handling
- Demo widgets are flagged with `is_demo = TRUE` and may have an `expires_at` for auto-expiry.
- Demo widgets are accessible via a public link and may have limited features.
- Expired demo widgets and all related data (chat logs, analytics, webhook errors) are deleted by a scheduled Supabase Edge Function. The `ON DELETE CASCADE` constraints ensure all related data is removed when a demo widget is deleted.

## Performance & Maintenance
- Indexes should be reviewed and added as the system grows to ensure performance.
- Manual cleanup of widgets and demo widgets is possible via admin endpoints.
- API keys and secrets are stored securely in the backend and never exposed to users or the frontend.

## Data Deletion & Bulk Operations
- ON DELETE CASCADE ensures all related data (chat logs, analytics, webhook errors) is removed when a widget or demo widget is deleted, including via bulk delete operations.
- Bulk delete is supported via admin endpoints for widgets, chat logs, and demo widgets.
- Custom prompts, chatbot personality, and first message are stored in the `config` JSONB field of the `widgets` table. 