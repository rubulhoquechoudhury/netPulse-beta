# Deployment Guide

NetPulse is a full-stack application (Vite + React frontend, Node.js + Express backend, MongoDB Atlas database). Choose the deployment strategy that best fits your needs.

---

## Option 1: Render — Full-Stack (Recommended)

Deploy both the frontend and backend as a single web service on [Render](https://render.com). Express serves the React build in production, so you only need **one service**.

### Steps

1. **Push your code** to a GitHub repository (already done).

2. **Create a MongoDB Atlas cluster** at [mongodb.com/atlas](https://www.mongodb.com/atlas) and get your connection string. Encode any `@` in your password as `%40`.

3. **Deploy on Render:**

   #### Option A — One-click Blueprint (easiest)
   - Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Blueprint**
   - Connect your GitHub repository — Render will detect `render.yaml` automatically
   - Fill in the required environment variables when prompted (see below)

   #### Option B — Manual
   - Go to [dashboard.render.com](https://dashboard.render.com) → **New** → **Web Service**
   - Connect your GitHub repository
   - Set the following fields:

     | Field | Value |
     |---|---|
     | **Runtime** | Node |
     | **Build Command** | `npm install && npm run build && cd server && npm install` |
     | **Start Command** | `npm start` |

4. **Set environment variables** in the Render dashboard under *Environment*:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string (Render can generate one) |
   | `FRONTEND_URL` | Your Render service URL, e.g. `https://netpulse.onrender.com` |

5. Click **Create Web Service**. Render will build and deploy automatically on every push to your main branch.

---

## Option 2: Railway — Full-Stack

[Railway](https://railway.app) is another easy platform for full-stack Node apps.

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**
2. Select your repository
3. Railway detects Node.js automatically. Set environment variables in the **Variables** tab:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string |
   | `FRONTEND_URL` | Your Railway service URL |
   | `PORT` | `5000` (or leave Railway to assign it) |

4. Set the build command: `npm install && npm run build && cd server && npm install`
5. Set the start command: `npm start`

---

## Option 3: Split Deployment (Vercel / Netlify + Render)

Deploy the **frontend** and **backend** as separate services if you want more control.

### Backend → Render

1. Create a new **Web Service** on Render pointing to your repository
2. Set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add environment variables:

   | Variable | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A long random string |
   | `FRONTEND_URL` | Your Vercel/Netlify frontend URL |

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repository
2. Set **Root Directory** to `client`
3. Vercel detects Vite automatically — no build command changes needed
4. Add an environment variable:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | Your Render backend URL, e.g. `https://netpulse-api.onrender.com` |

5. Update `client/src` API calls to use `import.meta.env.VITE_API_URL` as the base URL (instead of a relative `/api` path), since the frontend and backend are on different origins.

### Frontend → Netlify (alternative to Vercel)

1. Go to [netlify.com](https://www.netlify.com) → **Add new site** → **Import an existing project**
2. Set **Base directory** to `client`, **Build command** to `npm run build`, **Publish directory** to `client/dist`
3. Add the same `VITE_API_URL` environment variable as above

---

## Environment Variables Reference

All required environment variables for the server:

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB Atlas connection string |
| `JWT_SECRET` | ✅ | Secret key for signing JWTs — use a long random string in production |
| `NODE_ENV` | ✅ | Set to `production` to serve the React build from Express |
| `FRONTEND_URL` | ✅ | Full URL of the frontend (used for CORS). Same as backend URL in Options 1 & 2 |
| `PORT` | Optional | Port the server listens on (default: `5000`; platforms usually set this automatically) |

---

## After Deployment

- Your app will be accessible at the URL provided by your platform
- Each registered user gets a permanent QR code at `/api/qr/my`
- Public profiles are accessible at `<your-url>/user/:id`
- On free-tier Render services, the server may spin down after inactivity — the first request after a cold start may take ~30 seconds
