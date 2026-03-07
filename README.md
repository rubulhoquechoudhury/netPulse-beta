# NetPulse - QR-Based Professional Networking

A full-stack web application for sharing professional profiles via QR codes. Scan QR codes to instantly connect and save contacts.

## Tech Stack

- **Frontend:** Vite + React
- **Backend:** Node.js + Express
- **Database:** MongoDB (Atlas)
- **Authentication:** JWT (HTTP-only cookies)
- **QR:** Auto-generated permanent QR per user
- **Scanner:** Camera-based (html5-qrcode)

## Setup

### 1. Install Dependencies

```bash
# Root
npm install

# Server
cd server && npm install

# Client
cd client && npm install
```

### 2. Environment Variables

Copy `server/.env.example` to `server/.env` and update:

- `MONGODB_URI` - Your MongoDB Atlas connection string (encode `@` in password as `%40`)
- `JWT_SECRET` - A secure random string for production
- `NODE_ENV` - Set to `production` when deploying
- `FRONTEND_URL` - Frontend URL (default: http://localhost:5173)

### 3. Run Development

```bash
# From root - runs both client and server
npm run dev
```

Or run separately:

```bash
# Terminal 1 - Backend (port 5000)
cd server && npm run dev

# Terminal 2 - Frontend (port 5173)
cd client && npm run dev
```

### 4. Build for Production

```bash
npm run build
npm start
```

## Features

- **Auth:** Login / Create Account with JWT
- **Profile:** Edit name, email, phone, social links
- **QR Code:** Unique permanent QR linked to `/user/:id`
- **Scan:** Camera-based QR scanner, add scanned users to contacts
- **Contacts:** View and search saved contacts

## Project Structure

```
/client          - Vite + React frontend
/server          - Express API
  /models        - Mongoose schemas
  /routes        - API routes
  /middleware    - Auth middleware
```

## API Endpoints

- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user (protected)
- `PUT /api/profile` - Update profile (protected)
- `GET /api/user/:id` - Public user profile by userId
- `GET /api/qr/my` - Get current user's QR (protected)
- `POST /api/contacts/add` - Add contact (protected)

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions on deploying NetPulse to:

- **Render** (full-stack, recommended) — deploy frontend + backend as one service
- **Railway** — full-stack alternative to Render
- **Vercel / Netlify + Render** — split deployment for more control
