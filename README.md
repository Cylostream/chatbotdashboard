# Customizable Multi-Client Chat Widget Platform

## Overview
A robust, scalable platform for deploying customizable chat widgets for multiple clients, featuring an admin dashboard, analytics, and seamless integration with n8n workflows. Built for extensibility, security, and rapid deployment.

## Features
- Multi-client support with strict data segregation
- Customizable chat widgets (branding, personality, webhook integration)
- Admin dashboard for client and widget management
- Real-time analytics and chat log viewer
- Demo widget creation and sharing
- Bulk operations (delete, manage)
- Secure authentication and rate limiting
- Automated cleanup of expired demo widgets

## Tech Stack
- **Frontend:** React, Tailwind CSS (or styled-components), React Router, **Vite** (bundler)
- **Backend:** TypeScript (Cloudflare Pages Functions), Supabase (Postgres)
- **Automation:** n8n (via secure Cloudflare Tunnel)
- **Deployment:** Cloudflare Pages, Docker (for n8n), Supabase Edge Functions

## Monorepo Structure
```
/public           # Static assets (root level)
/src              # React Admin Dashboard frontend
/functions        # TypeScript Backend API (Cloudflare Pages Functions)
```

## Getting Started
### Prerequisites
- Node.js (v18+ recommended)
- **pnpm** (package manager)
- Supabase account
- Cloudflare account
- Docker (for n8n automation)

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/Cylostream/chatbotdashboard.git
   cd chatbot-widget-platform
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Setup environment variables:**
   - Copy `.env.example` to `.env` and fill in required values (see IMPLEMENTATION_PLAN.md for details).
4. **Initialize Supabase:**
   - Create a new project and apply the schema from `DATABASE_SCHEMA.MD`.
5. **Configure Cloudflare Pages:**
   - Connect your repo and set build/output settings as described in `DEPLOYMENT.MD`.
6. **(Optional) Deploy n8n:**
   - Use Docker Compose as described in `DEPLOYMENT.MD`.

### Running Locally
- **Frontend:**
  ```bash
  cd src
  pnpm run dev
  ```
- **Backend Functions:**
  ```bash
  cd functions
  # Use Wrangler or your preferred local dev tool for Cloudflare Functions
  wrangler pages dev
  ```

## Documentation
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)
- [API_DESIGN.md](./API_DESIGN.md)
- [ARCHITECTURE.MD](./ARCHITECTURE.MD)
- [DATABASE_SCHEMA.MD](./DATABASE_SCHEMA.MD)
- [DEPLOYMENT.MD](./DEPLOYMENT.MD)
- [TECH_STACK.MD](./TECH_STACK.MD)
- [WIREFRAMES.MD](./WIREFRAMES.MD)
- [CURSOR_RULES.md](./CURSOR_RULES.md)

## Contact & Support
For questions, issues, or support, please open an issue or contact the maintainers at [your-email@domain.com]. 