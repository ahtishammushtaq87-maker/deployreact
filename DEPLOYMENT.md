# Novapay Deployment Guide

## MongoDB Atlas Database
- **Connection String:** `mongodb+srv://ahtisham:db_ary123@cluster0.hwvvmzf.mongodb.net/novapay?retryWrites=true&w=majority&appName=Cluster0`
- **Database Name:** novapay
- **Status:** ✅ Already configured in `server/.env`

---

## Deployment Steps

### Part 1: Deploy Backend (Node.js Server)

**Option A: Deploy to Railway (Recommended)**
1. Sign up at [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository `deployreact`
4. Configure:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js` or `npm start`
5. Add Environment Variables:
   ```
   PORT=5002
   MONGODB_URI=mongodb+srv://ahtisham:db_ary123@cluster0.hwvvmzf.mongodb.net/novapay?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=SuperSecretNovapayKey2024!
   NODE_ENV=production
   CLIENT_URL=https://your-vercel-app.vercel.app
   EXCHANGERATE_API_KEY=your_actual_api_key_here
   ```
6. Click "Deploy"
7. After deployment, copy the backend URL (e.g., `https://novapay-backend.up.railway.app`)

**Option B: Deploy to Render**
1. Sign up at [render.com](https://render.com)
2. Click "New" → "Web Service"
3. Connect GitHub repo
4. Settings:
   - **Name:** novapay-api
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Add same environment variables as above
6. Deploy

---

### Part 2: Update Frontend with Backend URL

After backend is deployed:
1. Get your backend URL from Railway/Render (e.g., `https://novapay-backend.up.railway.app`)
2. Update `client/.env`:
   ```env
   VITE_API_BASE_URL=https://your-backend-url/api
   ```
3. Commit and push:
   ```bash
   git add client/.env
   git commit -m "Update API endpoint for production"
   git push
   ```
4. Vercel will auto-redeploy

---

### Part 3: Deploy Frontend to Vercel (Already in Progress)

Current status: Frontend deployment is ready. Once backend URL is set, final deploy will work.

---

## Important Notes

- **CORS:** Backend `CLIENT_URL` must match your Vercel frontend URL
- **MongoDB Atlas:** Already configured, ensure IP whitelist includes `0.0.0.0/0` (all IPs) or Railway/Render IP ranges
- **Backend Port:** Railway provides `PORT` env var automatically; backend uses `PORT=5002` fallback
- **Production Build:** Frontend builds to `dist/` folder (Vercel configured)

---

## Verify Deployment

1. **Test Backend Health:** `https://your-backend-url/api/health` or similar endpoint
2. **Test Frontend:** Visit your Vercel URL
3. **Check CORS:** Ensure frontend can make API calls to backend
4. **Check Logs:** Railway/Render dashboard for backend errors

---

## Troubleshooting

### "Vite command not found" - FIXED
✅ Resolved by adding `"workspaces": ["client"]` to root `package.json`

### "No output directory named 'dist' found" - FIXED
✅ Resolved by configuring Vite to output to root `dist/` via `vite.config.js`

### CORS Errors
Update `server/index.js` to include:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5174',
  credentials: true
}));
```

### MongoDB Connection Failed
- Check Atlas cluster is running
- Verify connection string in `server/.env`
- Ensure network access allows all IPs
