# Implementation Plan: Customizable Multi-Client Chat Widget Platform

## Overview
This document provides an extremely detailed, step-by-step plan for implementing the Customizable Multi-Client Chat Widget Platform. Each step references the relevant design and architecture documents. We will follow the rules outlined in `CURSOR_RULES.MD`.

---

## Phase 1: Project Setup & Foundation (Day 1-2)

### 1.1. Git Repository & Monorepo Structure
- **Reference:** `DEPLOYMENT.MD` (Project Structure), `TECH_STACK.MD` (Frontend/Backend)
- **Sub-Task 1.1.1:** Initialize Git Repository
    - **Action:** Create a new private repository on GitHub (e.g., `chatbot-widget-platform`).
    - **Action:** Clone the repository locally.
    - **Action:** Configure `main` as the default and protected branch.
- **Sub-Task 1.1.2:** Initialize Node.js Project
    - **Action:** Navigate to the repository root and run `pnpm init`.
    - **Action:** Create a `.gitignore` file and add `node_modules`, `.env*`, `dist`, `build`, and other common ignores.
    - **Reference:** `TECH_STACK.MD` (Build Tool)
- **Sub-Task 1.1.3:** Setup Monorepo Project Structure
    - **Action:** Create the top-level directories:
        - `/public` (for static assets, if any for the root level)
        - `/src` (for React Admin Dashboard frontend code)
        - `/functions` (for TypeScript Backend API - Cloudflare Pages Functions)
    - **Reference:** `DEPLOYMENT.MD` (Project Structure)
- **Sub-Task 1.1.4:** Install Core Dependencies
    - **Action:** Install TypeScript: `pnpm add -D typescript`
    - **Action:** Initialize TypeScript: `pnpm exec tsc --init`. Configure `tsconfig.json` for both frontend (`src`) and backend (`functions`) contexts (e.g., set `rootDir`, `outDir`, `baseUrl`, `paths` if using path aliases, `jsx` for React).
    - **Action:** Install React and ReactDOM for frontend: `pnpm add react react-dom`
    - **Action:** Install development tools: `pnpm add -D @types/react @types/react-dom eslint prettier eslint-config-prettier eslint-plugin-prettier eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin`
    - **Reference:** `TECH_STACK.MD` (Frontend, Backend)
- **Sub-Task 1.1.5:** Configure Linting and Formatting
    - **Action:** Create `.eslintrc.js` and `.prettierrc.js` (or `.json`) files.
    - **Action:** Configure ESLint rules for TypeScript, React, and Prettier integration.
    - **Action:** Add pnpm scripts for linting and formatting (e.g., `"lint": "eslint . --ext .ts,.tsx"`, `"format": "prettier --write ."`).

### 1.2. Supabase Project & Database Schema
- **Reference:** `DATABASE_SCHEMA.MD`, `TECH_STACK.MD` (Database)
- **Sub-Task 1.2.1:** Create Supabase Project
    - **Action:** Go to [Supabase.com](https://supabase.com) and create a new project.
    - **Action:** Choose the EU (Frankfurt) region as per GDPR compliance (`ARCHITECTURE.MD` - Versioning and Compliance).
    - **Action:** Securely save the Project URL, anon key, and service role key. These will be used as environment variables.
- **Sub-Task 1.2.2:** Implement Database Schema via Supabase SQL Editor
    - **Action:** Navigate to the SQL Editor in the Supabase dashboard.
    - **Action:** Execute the `CREATE TABLE` statements from `DATABASE_SCHEMA.MD` for `clients`, `widgets`, `chat_logs`, `analytics`, and `webhook_errors` one by one.
    - **Action:** Verify table creation, primary keys, foreign keys (with `ON DELETE CASCADE`), indexes, `is_demo`, `expires_at` fields, and `UNIQUE` constraints.
    - **Reference:** `DATABASE_SCHEMA.MD` (Schema Definition, Indexing & Relationships)
- **Sub-Task 1.2.3:** Enable Row Level Security (RLS)
    - **Action:** For each table, enable RLS in the Supabase dashboard.
    - **Action:** Initially, create a default permissive policy for admin access during development (e.g., `CREATE POLICY "Enable all access for authenticated users" ON public.clients FOR ALL USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');`). Refine these policies later for production security.
    - **Reference:** Supabase RLS documentation.

### 1.3. Cloudflare Pages Setup
- **Reference:** `DEPLOYMENT.MD` (Monorepo Deployment, Environment Variables), `TECH_STACK.MD` (Deployment)
- **Sub-Task 1.3.1:** Connect GitHub Repository
    - **Action:** Log in to Cloudflare dashboard and navigate to Pages.
    - **Action:** Connect your GitHub account and select the `chatbot-widget-platform` repository.
- **Sub-Task 1.3.2:** Configure Build Settings
    - **Action:** Set the production branch (e.g., `main`).
    - **Action:** Set the build command (e.g., `pnpm run build` - to be defined later in `package.json` for building the React app with Vite).
    - **Action:** Set the output directory (e.g., `build` or `dist` - depending on your React build tool setup).
    - **Action:** Select the "React" preset if available, or configure manually.
- **Sub-Task 1.3.3:** Configure Environment Variables
    - **Action:** In Cloudflare Pages dashboard (Settings > Environment Variables), add:
        - `SUPABASE_URL` (from Supabase project)
        - `SUPABASE_SERVICE_KEY` (from Supabase project - for backend functions)
        - `SUPABASE_ANON_KEY` (from Supabase project - for frontend if direct Supabase calls are made, though typically backend handles this)
        - `N8N_BASE_URL` (to be configured after n8n setup)
        - `DEMO_WIDGET_EXPIRY_HOURS` (e.g., `48`)
    - **Reference:** `TECH_STACK.MD` (Environment Variables)
- **Sub-Task 1.3.4:** Initial Deployment Test
    - **Action:** Create a simple `index.html` in `/public` and a basic React app structure in `/src`.
    - **Action:** Add a build script to `package.json` (e.g., using Vite to build into `/build` or `/dist`).
    - **Action:** Push to `main` to trigger a Cloudflare Pages build and deployment to verify the pipeline.

### 1.4. n8n & Cloudflare Tunnel Setup
- **Reference:** `DEPLOYMENT.MD` (n8n Workflow Deployment), `ARCHITECTURE.MD` (n8n Workflows)
- **Sub-Task 1.4.1:** Provision VPS & Install Docker
    - **Action:** Provision a VPS (e.g., Ubuntu) in an EU region.
    - **Action:** Install Docker and Docker Compose on the VPS.
- **Sub-Task 1.4.2:** Deploy n8n using Docker Compose
    - **Action:** Create a `docker-compose.yml` file on the VPS as per `DEPLOYMENT.MD` (n8n Workflow Deployment).
    - **Action:** Configure n8n environment variables (basic auth, timezone, etc.).
    - **Action:** Run `docker-compose up -d`.
    - **Action:** Verify n8n is running and accessible locally on the VPS (e.g., `curl http://localhost:5678`).
- **Sub-Task 1.4.3:** Setup Cloudflare Tunnel
    - **Action:** Install `cloudflared` on the VPS.
    - **Action:** Authenticate `cloudflared` with your Cloudflare account.
    - **Action:** Create a tunnel: `cloudflared tunnel create n8n-tunnel`.
    - **Action:** Configure DNS for the tunnel: `cloudflared tunnel route dns n8n-tunnel n8n.yourdomain.com` (replace `yourdomain.com` with your actual domain, e.g., `chat.cylostream.com` for n8n specific endpoint like `n8n.chat.cylostream.com`).
    - **Action:** Run the tunnel: `cloudflared tunnel run n8n-tunnel`.
    - **Action:** Consider setting up `cloudflared` as a system service for persistence.
- **Sub-Task 1.4.4:** Update Environment Variables
    - **Action:** Update the `N8N_BASE_URL` environment variable in Cloudflare Pages with the secure tunnel URL (e.g., `https://n8n.chat.cylostream.com`).

---

## Phase 2: Backend API Development (Cloudflare Pages Functions) (Day 3-7)

- **General Notes for all API Endpoints:**
    - **Reference:** `API_DESIGN.MD`, `ARCHITECTURE.MD` (Backend API), `TECH_STACK.MD` (Backend)
    - All functions will reside in the `/functions` directory.
    - Use the Supabase JS client (`@supabase/supabase-js`) for database interactions. Initialize it with `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`.
    - Implement robust error handling (return JSON with `error` and `message` as per `API_DESIGN.MD`).
    - Implement data validation for all incoming requests.
    - Ensure strict data segregation by `client_id` and `widget_id` in all database queries.
    - Implement rate limiting where specified (`API_DESIGN.MD` - Security, Rate Limiting).

### 2.1. Helper Utilities & Middleware
- **Sub-Task 2.1.1:** Create Supabase Client Utility
    - **Action:** Create `/functions/utils/supabaseClient.ts` to initialize and export the Supabase service role client.
- **Sub-Task 2.1.2:** Create Authentication Middleware (for Admin Endpoints)
    - **Action:** Create `/functions/middleware/auth.ts`. This will verify JWT or session tokens.
    - **Action:** This middleware will be applied to all admin-only API routes.
    - **Reference:** `API_DESIGN.MD` (Authentication)
- **Sub-Task 2.1.3:** Create Widget Authentication Middleware
    - **Action:** Create `/functions/middleware/widgetAuth.ts`. This will verify `widget_secret` from headers.
    - **Action:** This middleware will be applied to widget-specific API routes like chat.
    - **Reference:** `API_DESIGN.MD` (Authentication)

### 2.2. Admin Authentication API
- **Reference:** `API_DESIGN.MD` (Admin Auth)
- **Sub-Task 2.2.1:** Implement `/functions/api/admin/login.ts`
    - **Action:** Handle `POST` requests.
    - **Action:** Validate `email` and `password`.
    - **Action:** Query Supabase `auth.users` or a custom admin table to verify credentials.
    - **Action:** Generate and return a JWT or session token.
- **Sub-Task 2.2.2:** Implement `/functions/api/admin/logout.ts`
    - **Action:** Handle `POST` requests.
    - **Action:** Invalidate JWT (if using a blacklist) or clear session.

### 2.3. Client Management API
- **Reference:** `API_DESIGN.MD` (Clients)
- **Sub-Task 2.3.1:** Implement `/functions/api/clients/index.ts` (for GET all, POST create)
    - **Action:** `onRequestGet`: Fetch all clients from `clients` table. Apply admin auth middleware.
    - **Action:** `onRequestPost`: Create a new client. Validate request body. Apply admin auth middleware.
- **Sub-Task 2.3.2:** Implement `/functions/api/clients/[clientId].ts` (for GET one, PUT update, DELETE)
    - **Action:** `onRequestGet`: Fetch a specific client by `clientId`. Apply admin auth middleware.
    - **Action:** `onRequestPut`: Update a client's info. Validate request body. Apply admin auth middleware.
    - **Action:** `onRequestDelete`: Delete a client and all their associated widgets, chat logs, etc. (rely on `ON DELETE CASCADE`). Apply admin auth middleware.

### 2.4. Widget Management API
- **Reference:** `API_DESIGN.MD` (Widgets), `DATABASE_SCHEMA.MD` (widgets table)
- **Sub-Task 2.4.1:** Implement `/functions/api/widgets/index.ts` (for GET all, POST create)
    - **Action:** `onRequestGet`: Fetch all widgets, optionally filter by `client_id`. Apply admin auth middleware.
    - **Action:** `onRequestPost`: Create a new widget. Validate request body (`client_id`, `name`, `config`, `webhook_url`). Auto-generate `widget_secret`. Store custom prompts/personality in `config` JSONB. Apply admin auth middleware.
    - **Reference:** `DATABASE_SCHEMA.MD` (Custom prompts/personality in `config`)
- **Sub-Task 2.4.2:** Implement `/functions/api/widgets/[widgetId].ts` (for GET one, PUT update, DELETE)
    - **Action:** `onRequestGet`: Fetch widget details/config by `widgetId`. Apply admin auth middleware.
    - **Action:** `onRequestPut`: Update widget config, webhook, etc. Apply admin auth middleware.
    - **Action:** `onRequestDelete`: Delete a widget. Apply admin auth middleware.

### 2.5. Chat API (Widget API)
- **Reference:** `API_DESIGN.MD` (Chat (Widget API))
- **Sub-Task 2.5.1:** Implement `/functions/api/widgets/[widgetId]/chat.ts`
    - **Action:** Handle `POST` requests.
    - **Action:** Apply widget authentication middleware (verify `widget_secret`).
    - **Action:** Validate request body (`message`, `user_id`).
    - **Action:** Fetch widget's `webhook_url` from `widgets` table.
    - **Action:** Make an HTTP POST request to the n8n webhook URL with the message.
    - **Action:** Handle n8n response or timeout/error (return user-friendly message from `ARCHITECTURE.MD` - Error Handling).
    - **Action:** Log the chat (message, response, confidence, widget_id, user_id) to `chat_logs` table.
    - **Action:** Return response from n8n (or error) to the widget.
    - **Action:** Implement rate limiting for this endpoint.

### 2.6. Analytics API
- **Reference:** `API_DESIGN.MD` (Analytics)
- **Sub-Task 2.6.1:** Implement `/functions/api/widgets/[widgetId]/analytics.ts`
    - **Action:** Handle `GET` requests.
    - **Action:** Apply widget authentication middleware (or client dashboard token - to be defined if client dashboard needs separate auth).
    - **Action:** Query `analytics` table for aggregated data for the given `widgetId` and date range.
    - **Action:** Query `chat_logs` for data if live/non-aggregated data is needed.
    - **Action:** Format and return analytics data.
- **Sub-Task 2.6.2:** Implement `/functions/api/widgets/[widgetId]/chat-logs.ts`
    - **Action:** Handle `GET` requests.
    - **Action:** Apply admin auth middleware.
    - **Action:** Fetch chat logs from `chat_logs` table for the given `widgetId`, with pagination.

### 2.7. Webhook Management API
- **Reference:** `API_DESIGN.MD` (Webhook Management)
- **Sub-Task 2.7.1:** Implement `/functions/api/widgets/[widgetId]/test-webhook.ts`
    - **Action:** Handle `POST` requests.
    - **Action:** Apply admin auth middleware.
    - **Action:** Fetch widget's `webhook_url`.
    - **Action:** Send a test payload to the webhook and return status.
- **Sub-Task 2.7.2:** Implement `/functions/api/widgets/[widgetId]/webhook-errors.ts`
    - **Action:** Handle `GET` requests.
    - **Action:** Apply admin auth middleware.
    - **Action:** Fetch recent errors from `webhook_errors` table for the `widgetId`.

### 2.8. Demo Widget API
- **Reference:** `API_DESIGN.MD` (Demo Widgets)
- **Sub-Task 2.8.1:** Implement `/functions/api/demo-widgets/index.ts` (for POST create)
    - **Action:** `onRequestPost`: Create a new demo widget. Apply admin auth middleware.
        - Set `is_demo = TRUE`.
        - Set `expires_at` based on `expires_in_hours` from request or default from `DEMO_WIDGET_EXPIRY_HOURS`.
        - Use a separate, smaller knowledge base (this might mean a different `webhook_url` or a parameter in the `config` that n8n interprets).
        - **Reference:** `ARCHITECTURE.MD` (Demo Widget Knowledge Base)
        - Generate `demoId` (can be the widget `id`) and `demoLink` (e.g., `https://chat.cylostream.com/demo/[demoId]`).
- **Sub-Task 2.8.2:** Implement `/functions/api/demo-widgets/[demoId].ts` (for GET one)
    - **Action:** `onRequestGet`: Fetch demo widget details by `demoId` (widget `id`). No auth required.
    - **Action:** Check `is_demo` flag and `expires_at`. If expired, return 'Demo expired' message.
- **Sub-Task 2.8.3:** Implement `/functions/api/demo-widgets/[demoId]/chat.ts`
    - **Action:** Handle `POST` requests. No auth required (or basic auth as per `API_DESIGN.MD` - Demo Widget Access).
    - **Action:** Check `is_demo` flag and `expires_at`. If expired, return 'Demo expired' message.
    - **Action:** Process chat similarly to the main chat API but potentially with demo-specific n8n webhook/config.
    - **Action:** Implement rate limiting.

### 2.9. Bulk Delete API
- **Reference:** `API_DESIGN.MD` (Bulk Delete Endpoints)
- **Sub-Task 2.9.1:** Implement `/functions/api/widgets/index.ts` (extend for bulk DELETE)
    - **Action:** `onRequestDelete` (if handling `DELETE /api/widgets` with body/query params for IDs): Delete multiple widgets based on a list of IDs. Apply admin auth middleware.
- **Sub-Task 2.9.2:** Implement `/functions/api/widgets/[widgetId]/chat-logs/index.ts` (for bulk DELETE chat logs)
    - **Action:** `onRequestDelete` (e.g. `DELETE /api/widgets/:widgetId/chat-logs` with date range or all): Delete chat logs for a widget. Apply admin auth middleware.
- **Sub-Task 2.9.3:** Implement `/functions/api/demo-widgets/index.ts` (extend for bulk DELETE demo widgets)
    - **Action:** `onRequestDelete`: Delete multiple demo widgets. Apply admin auth middleware.

### 2.10. Scheduled Cleanup Job (Supabase Edge Function)
- **Reference:** `DEPLOYMENT.MD` (Scheduled Cleanup), `ARCHITECTURE.MD` (Demo Widget Flow), `TECH_STACK.MD` (Cleanup)
- **Sub-Task 2.10.1:** Create Supabase Edge Function for Cleanup
    - **Action:** In your Supabase project, create a new Edge Function (e.g., `delete-expired-demos`).
    - **Action:** Write TypeScript/JavaScript code using `supabase-js` (service role) to:
        - Query `widgets` table for records where `is_demo = TRUE` AND `expires_at < NOW()`.
        - For each expired demo widget, delete it (e.g., `supabase.from('widgets').delete().eq('id', widgetId)`).
        - `ON DELETE CASCADE` in `DATABASE_SCHEMA.MD` will handle deletion of related `chat_logs`, `analytics`, `webhook_errors`.
- **Sub-Task 2.10.2:** Schedule the Edge Function
    - **Action:** Use the Supabase dashboard or CLI to schedule the `delete-expired-demos` function to run hourly (e.g., using a cron expression like `0 * * * *`).
- **Sub-Task 2.10.3:** Implement Alerting for Cleanup Failure
    - **Action:** Add error handling within the Edge Function. If deletion fails, log the error.
    - **Action:** Set up Supabase function logs monitoring or an external alerting mechanism (e.g., if Supabase can trigger a webhook on function failure) to notify admin if the cleanup job fails.
    - **Reference:** `API_DESIGN.MD` (Alerting for cleanup failures)

---

## Phase 3: Frontend Development (Admin Dashboard - React) (Day 8-14)

- **General Notes for Frontend Development:**
    - **Reference:** `WIREFRAMES.MD`, `TECH_STACK.MD` (Frontend), `ARCHITECTURE.MD` (Admin Dashboard)
    - Use a React framework/setup like Vite or Create React App (as decided in `TECH_STACK.MD`).
    - Use a state management solution (e.g., Context API, Zustand, Redux Toolkit) if complex state is anticipated.
    - Use a routing library (e.g., React Router).
    - Style with Tailwind CSS or styled-components (as per `TECH_STACK.MD`).
    - All API calls will be to the backend functions deployed on Cloudflare Pages.

### 3.1. Core Layout, Routing & UI Kit
- **Sub-Task 3.1.1:** Setup React Router
    - **Action:** Install `react-router-dom`.
    - **Action:** Define main routes: `/login`, `/admin/dashboard`, `/admin/clients`, `/admin/clients/:clientId`, `/admin/widgets/:widgetId/edit`, `/admin/widgets/:widgetId/analytics`, `/admin/alerts`, `/admin/settings` (settings can be basic initially).
- **Sub-Task 3.1.2:** Implement Main Layout Components
    - **Action:** Create `Sidebar`, `TopBar`, and main content area components.
    - **Action:** Implement navigation links in the sidebar.
    - **Reference:** `WIREFRAMES.MD` (Dashboard Home)
- **Sub-Task 3.1.3:** Setup Basic UI Kit/Styling
    - **Action:** Integrate Tailwind CSS or chosen styling solution.
    - **Action:** Create common UI components (Button, Input, Table, Card, Modal, etc.) or use a component library.

### 3.2. Admin Authentication UI
- **Sub-Task 3.2.1:** Create Login Page (`/login`)
    - **Action:** Design login form (email, password).
    - **Action:** Handle form submission, call `/api/admin/login`.
    - **Action:** Store token (e.g., in localStorage or secure cookie) and redirect to dashboard on success.
    - **Action:** Display login errors.
- **Sub-Task 3.2.2:** Implement Logout Functionality
    - **Action:** Add logout button (e.g., in TopBar).
    - **Action:** Call `/api/admin/logout`, clear token, redirect to login.
- **Sub-Task 3.2.3:** Implement Protected Routes
    - **Action:** Create a HOC or wrapper component to protect admin routes, redirecting to login if not authenticated.

### 3.3. Client Management UI
- **Reference:** `WIREFRAMES.MD` (Dashboard Home, Client Details)
- **Sub-Task 3.3.1:** Dashboard Home - Client List (`/admin/dashboard` or `/admin/clients`)
    - **Action:** Fetch and display list of clients from `/api/clients` in a table or card layout.
    - **Action:** Implement "Add Client" button and modal/form to call `POST /api/clients`.
    - **Action:** Implement View/Edit actions per client, linking to client details page.
- **Sub-Task 3.3.2:** Client Details Page (`/admin/clients/:clientId`)
    - **Action:** Fetch and display client details from `/api/clients/:clientId`.
    - **Action:** Allow editing client info (call `PUT /api/clients/:clientId`).
    - **Action:** Display list of widgets for this client (fetch from `/api/widgets?clientId=...`).
    - **Action:** Implement "Add Widget" button for this client.
    - **Action:** Implement delete client functionality (call `DELETE /api/clients/:clientId`) with confirmation.

### 3.4. Widget Management UI
- **Reference:** `WIREFRAMES.MD` (Client Details, Widget Config/Edit)
- **Sub-Task 3.4.1:** Add/Edit Widget Form/Modal
    - **Action:** Create a reusable form/modal for adding (via `POST /api/widgets`) and editing (via `PUT /api/widgets/:widgetId`) widgets.
    - **Action:** Include fields for Name, Status (is_active), Branding (Logo upload, Color picker, Welcome message), Personality, First Message, Webhook URL.
    - **Action:** Store Personality & First Message within the `config` JSONB field.
    - **Reference:** `WIREFRAMES.MD` (Widget Config/Edit - Personality, First Message)
- **Sub-Task 3.4.2:** Live Preview in Widget Config
    - **Action:** Embed a version of the Chat Widget UI within the config form.
    - **Action:** Update the preview in real-time as branding, personality, and first message settings are changed by the admin.
    - **Action:** Show a user-friendly error in the preview if n8n is down/webhook test fails.
    - **Reference:** `WIREFRAMES.MD` (Widget Config/Edit - Live Preview with error message)
- **Sub-Task 3.4.3:** Webhook Test Functionality
    - **Action:** Add "Test Webhook" button to call `POST /api/widgets/:widgetId/test-webhook`.
    - **Action:** Display success/failure status.
- **Sub-Task 3.4.4:** Widget Secret Display
    - **Action:** Display widget secret (read-only) with a copy button.
- **Sub-Task 3.4.5:** Delete Widget Functionality
    - **Action:** Implement delete widget functionality (call `DELETE /api/widgets/:widgetId`) with confirmation.

### 3.5. Demo Widget UI
- **Reference:** `WIREFRAMES.MD` (Dashboard Home, Demo Widget Flow, Widget Config/Edit)
- **Sub-Task 3.5.1:** "Create Demo Widget" Button & Flow
    - **Action:** Add "Create Demo Widget" button on Dashboard Home.
    - **Action:** On click, open a simplified widget config form (or reuse widget form with demo flag).
        - Allow setting demo name, basic config, and expiry time (e.g., dropdown 24h, 48h, 72h).
        - Include live preview.
    - **Action:** Call `POST /api/demo-widgets`.
    - **Action:** On success, display the "Demo Widget Created" modal with the shareable link and copy/open buttons.
    - **Reference:** `WIREFRAMES.MD` (Dashboard Home - Create Demo Widget, Demo Widget Flow modal)

### 3.6. Analytics UI
- **Reference:** `WIREFRAMES.MD` (Analytics View)
- **Sub-Task 3.6.1:** Analytics View Page (`/admin/widgets/:widgetId/analytics`)
    - **Action:** Implement date range picker.
    - **Action:** Fetch and display key metrics from `/api/widgets/:widgetId/analytics`.
    - **Action:** Implement charts (chats over time, confidence, feedback) using a library like Chart.js, Recharts, or Nivo.
    - **Action:** Display table of most common questions.
- **Sub-Task 3.6.2:** Chat Log Viewer (within Analytics or separate)
    - **Action:** Fetch and display chat logs from `/api/widgets/:widgetId/chat-logs` with pagination.

### 3.7. Alerts/Errors UI
- **Reference:** `WIREFRAMES.MD` (Alerts/Errors)
- **Sub-Task 3.7.1:** Alerts Page (`/admin/alerts`)
    - **Action:** Fetch and display webhook errors from `/api/widgets/:widgetId/webhook-errors` (or a global errors endpoint if created).
    - **Action:** Allow filtering by client/widget.
    - **Action:** Implement "Mark as Resolved" functionality (this might just be a UI state or could update a status in the DB if errors are stored more permanently).
    - **Action:** Display alerts for cleanup job failures (this requires a mechanism to get this info from backend to frontend, e.g., a dedicated alerts table or polling).
    - **Reference:** `ARCHITECTURE.MD` (Error Logging and Alerting - planned centralized dashboard)

### 3.8. Bulk Delete UI
- **Reference:** `WIREFRAMES.MD` (Dashboard Home, Client Details)
- **Sub-Task 3.8.1:** Implement Bulk Delete on Dashboard Home
    - **Action:** Add a "Bulk Delete" button.
    - **Action:** Allow selection of multiple clients or widgets (across clients) from the main list.
    - **Action:** On confirm, call relevant bulk delete API endpoints.
- **Sub-Task 3.8.2:** Implement Bulk Delete on Client Details Page
    - **Action:** Add a "Bulk Delete Widgets" button.
    - **Action:** Allow selection of multiple widgets for that specific client.
    - **Action:** On confirm, call relevant bulk delete API endpoints.
- **Sub-Task 3.8.3:** Consider UI for bulk deleting chat logs or demo widgets if not covered by widget deletion.

---

## Phase 4: Chat Widget Development (React/Web Component) (Day 12-15)

- **General Notes:**
    - **Reference:** `WIREFRAMES.MD` (Widget), `TECH_STACK.MD` (Frontend - Widget), `ARCHITECTURE.MD` (Chat Widget)
    - Build as a React component that can be easily embedded or compiled to a Web Component.
    - Ensure it's lightweight and performs well (`TECH_STACK.MD` - Widget Bundle).
    - Ensure full mobile responsiveness (`ARCHITECTURE.MD` - Branding, Responsiveness).

### 4.1. Widget UI Core
- **Sub-Task 4.1.1:** Basic Chat Window Structure
    - **Action:** Create components for chat messages (user, bot), input area, send button, feedback buttons (👍👎).
    - **Action:** Implement styling based on branding config (logo, color, welcome message, first message) passed from the backend or embed script.
    - **Reference:** `WIREFRAMES.MD` (Widget)
- **Sub-Task 4.1.2:** Displaying Messages
    - **Action:** Manage a list of messages in component state.
    - **Action:** Render user and bot messages correctly.
- **Sub-Task 4.1.3:** User Input
    - **Action:** Handle text input and send button click/enter key press.

### 4.2. Widget API Integration
- **Sub-Task 4.2.1:** Fetch Widget Configuration
    - **Action:** On load, the widget (or its embedding script) needs its `widgetId` and `widget_secret`.
    - **Action:** It might fetch its full `config` (branding, etc.) from `/api/widgets/:widgetId` or `/api/demo-widgets/:demoId` if it's a demo, using its secret/ID for auth.
- **Sub-Task 4.2.2:** Sending Messages to Backend
    - **Action:** On user send, make a POST request to `/api/widgets/:widgetId/chat` (or demo equivalent) with message and `widget_secret` in header.
- **Sub-Task 4.2.3:** Receiving and Displaying Responses
    - **Action:** Handle API response, display bot message and confidence.
    - **Action:** Handle API errors (e.g., n8n timeout, show user-friendly message from `ARCHITECTURE.MD` - Error Handling).
- **Sub-Task 4.2.4:** Feedback Collection
    - **Action:** On feedback button click, send feedback to a dedicated API endpoint (e.g., `POST /api/widgets/:widgetId/feedback`) or include in chat log update.
    - **Note:** Current `API_DESIGN.MD` has feedback in `chat_logs`. Decide if this is logged with each message or as a separate event.

### 4.3. Widget Embedding & Initialization
- **Reference:** `DEPLOYMENT.MD` (Widget Embedding), `ARCHITECTURE.MD` (Embedding)
- **Sub-Task 4.3.1:** Create Embed Script (JavaScript)
    - **Action:** Write a small JS loader script that clients can put on their page.
    - **Action:** This script will create an iframe or inject the widget bundle, passing `widgetId` and `widget_secret` (or a public token that backend exchanges for secret).
    - **Action:** Ensure script is minimal and loads widget asynchronously.
- **Sub-Task 4.3.2:** (Alternative) Iframe Embedding
    - **Action:** Provide an iframe embed code: `<iframe src="https://chat.cylostream.com/widget-render/:widgetId?token=..."></iframe>`.
    - **Action:** The `/widget-render/:widgetId` route would serve the widget UI.
- **Sub-Task 4.3.3:** Admin UI to Generate Embed Code
    - **Action:** In the Admin Dashboard (Widget Config page), provide a section to copy the generated script tag or iframe code.

---

## Phase 5: Testing, Deployment & Polish (Day 16-20)

### 5.1. End-to-End Manual Testing
- **Sub-Task 5.1.1:** Admin Flow Testing
    - **Action:** Test all admin CRUD operations for clients and widgets.
    - **Action:** Test demo widget creation, sharing, access, expiry, and cleanup.
    - **Action:** Test analytics display, webhook testing, error viewing, and bulk delete.
- **Sub-Task 5.1.2:** Widget Flow Testing
    - **Action:** Test chat functionality for normal and demo widgets.
    - **Action:** Test widget embedding on a sample client page.
    - **Action:** Test error handling (n8n down, expired demo).
    - **Action:** Test mobile responsiveness of the widget.
- **Sub-Task 5.1.3:** Security Testing
    - **Action:** Attempt unauthorized access to admin APIs.
    - **Action:** Test widget API access with invalid/missing secrets.
    - **Action:** Verify data segregation between clients.
    - **Action:** Test rate limiting.

### 5.2. Final Deployment to Production
- **Reference:** `DEPLOYMENT.MD`
- **Sub-Task 5.2.1:** Final Configuration Review
    - **Action:** Double-check all Cloudflare Pages environment variables for production.
    - **Action:** Ensure Supabase RLS policies are secure for production.
    - **Action:** Ensure n8n is configured securely.
- **Sub-Task 5.2.2:** Deploy `main` Branch
    - **Action:** Merge all completed features into the `main` branch.
    - **Action:** Let Cloudflare Pages build and deploy.
- **Sub-Task 5.2.3:** Post-Deployment Smoke Test
    - **Action:** Perform a quick smoke test of all critical functionalities on the live production environment (`chat.cylostream.com`).

### 5.3. Documentation Finalization
- **Sub-Task 5.3.1:** Update All Project Documents
    - **Action:** Review and update `API_DESIGN.MD`, `ARCHITECTURE.MD`, `DATABASE_SCHEMA.MD`, `DEPLOYMENT.MD`, `TECH_STACK.MD`, `WIREFRAMES.MD`, and this `IMPLEMENTATION_PLAN.MD` with any deviations, new learnings, or final details from the implementation process.
    - **Action:** Ensure all diagrams and schemas are accurate.
- **Sub-Task 5.3.2:** Create Basic Admin Runbook (Internal)
    - **Action:** Document common admin tasks, troubleshooting steps for n8n/Supabase/Cloudflare, and how to manage demo widgets or perform manual cleanups.
    - **Reference:** `ARCHITECTURE.MD` (Admin Runbooks - noted as future task, but basic version good here)

### 5.4. (Optional) Setup CI/CD Pipeline
- **Reference:** `DEPLOYMENT.MD` (CI/CD Best Practices)
- **Sub-Task 5.4.1:** Configure GitHub Actions (or similar)
    - **Action:** Set up workflows for linting, testing (if any unit tests were written), and building on push/PR to `main`.
    - **Action:** Integrate with Cloudflare Pages for automated deployments from `main` after checks pass.

---

## Phase 6: Ongoing Maintenance & Future Iterations

- **Task 6.1:** Monitor System Health
    - **Action:** Regularly check Cloudflare logs, Supabase logs, and n8n logs.
    - **Action:** Monitor Supabase resource usage (DB size, function executions).
    - **Action:** Monitor demo widget cleanup job success.
- **Task 6.2:** Dependency Updates
    - **Action:** Periodically update pnpm packages, Docker images, and other dependencies.
    - **Reference:** `TECH_STACK.MD` (Versioning & Maintenance)
- **Task 6.3:** Future Feature Implementation (as per backlog)
    - **Action:** Implement planned features like the centralized error dashboard (`ARCHITECTURE.MD`), advanced analytics, etc.

---
This plan aims to be exhaustive. We will tackle each sub-task methodically, ensuring alignment with our established documentation and rules. Ready to begin with Phase 1, Sub-Task 1.1.1?
 