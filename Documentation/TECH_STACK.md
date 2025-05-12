# Tech Stack

## Package Manager
All development and installation should use **pnpm** for consistency and performance. Do not use npm, yarn, or bun.

## Frontend Bundler
The widget bundle and frontend are built using **Vite** for optimal performance and modern tooling.

## Frontend
- **Framework:** React (latest LTS)
- **Build Tool:** Vite or Create React App
- **Deployment:** Cloudflare Pages
- **Styling:** Tailwind CSS or styled-components (optional)
- **Why:** React is widely adopted, component-based, and integrates well with Cloudflare Pages for static hosting and edge deployment.

## Backend
- **Language:** TypeScript
- **Platform:** Cloudflare Pages Functions (serverless)
- **API Style:** REST (with potential for GraphQL in the future)
- **Key Libraries:**
  - Supabase JS client (for PostgreSQL access)
  - node-fetch or native fetch (for HTTP requests to n8n)
- **Why:** TypeScript provides type safety and modern JS features. Cloudflare Pages Functions allow seamless deployment with the frontend and global edge performance.

## Database
- **Type:** PostgreSQL
- **Provider:** Supabase (managed Postgres)
- **Why:** PostgreSQL is robust, scalable, and well-supported. Supabase offers easy integration with JS/TS and serverless environments.

## Deployment
- **Frontend & Backend:** Cloudflare Pages (single repo, single deployment)
- **n8n Workflows:** VPS (Dockerized), exposed via Cloudflare Tunnel
- **Why:** Cloudflare Pages provides global edge hosting, automatic scaling, and easy integration with GitHub. n8n is self-hosted for full control and privacy.

## Integrations
- **Supabase:**
  - Use Supabase JS client for all DB operations
  - Environment variables for URL and anon/service keys
- **n8n:**
  - HTTP requests from backend to n8n webhooks
  - Webhooks are unique per client/widget, stored securely in DB
- **Email/Alerting:**
  - (Optional) Use SendGrid, Mailgun, or similar for admin alerts

## Environment Variables
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_KEY` or `SUPABASE_ANON_KEY`: For secure DB access
- `N8N_BASE_URL`: Base URL for n8n webhooks (via Cloudflare Tunnel)
- `ALERT_EMAIL`/`SENDGRID_API_KEY`: For alerting (if used)

## Security Notes
- All sensitive keys are stored as environment variables in Cloudflare Pages dashboard
- Widget secrets are used for secure API calls
- Admin endpoints require authentication (JWT or similar)
- Webhook URLs are never exposed to the client or frontend

## Versioning & Maintenance
- Use latest LTS versions for all frameworks/libraries
- Regularly update dependencies and monitor for security patches

## Demo Widget Support
- **Frontend & Backend:** Both support public demo widgets, accessible at `/demo/:demoId` on the main domain.
- **Features:** Demo widgets may have limited features, a "Demo Mode" watermark, and auto-expiry (configurable via environment variable, e.g., `DEMO_WIDGET_EXPIRY_HOURS`).
- **Routing:** Handled by React Router and/or Cloudflare Pages Functions.
- **Cleanup:** Expired demo widgets and all related data are deleted by a scheduled Supabase Edge Function, written in TypeScript/JavaScript and scheduled via the Supabase dashboard. This is the recommended approach for serverless projects.
- **No extra libraries required** beyond those already listed.

## Rate Limiting & API Security
- All widget chat endpoints are rate limited and secured at the backend/API gateway level. API keys and secrets are never exposed to users.

## Error Logging
- Handled by Supabase and Cloudflare, with plans for a centralized error dashboard in the admin.

## Embedding & Responsiveness
- Widgets are embeddable via script tag or iframe and are fully mobile responsive.

## Versioning & Compliance
- Versioning is managed via Git; GDPR compliance is ensured by using EU-based servers.

## Manual Cleanup
- Admin dashboard provides manual cleanup and management controls for all widgets and demo widgets.

## Widget Bundle
- The widget bundle is kept as small as possible for performance and accessibility.

## Bulk Delete & Custom Prompts
- Bulk delete and custom prompts/personality/first message are supported and managed via the admin dashboard.

## Error Handling
- If n8n is down or times out, the widget displays a user-friendly error message to the end user. 