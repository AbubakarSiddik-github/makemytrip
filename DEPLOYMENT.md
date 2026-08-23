# Deploying MakeMyTour — Backend on Render, Frontend on Vercel

Your project has two parts:
- **Backend** (Spring Boot + MongoDB) — at the project root (`pom.xml`, `src/`)
- **Frontend** (Next.js) — in the `makemytour/` folder

We deploy the backend to **Render** and the frontend to **Vercel**. Both connect to a **GitHub repo**, so the first step is putting your code on GitHub.

I already prepared everything you need: `.gitignore` (keeps `node_modules`, the reference clone folder, and build files out of GitHub), a `Dockerfile` (tells Render how to build the backend), and I made the MongoDB URL / backend URL configurable so each platform uses the right value.

---

## Before you start
- A **GitHub** account → https://github.com
- Your **MongoDB Atlas** login
- **⚠ Make your GitHub repo PRIVATE.** Your database password is inside the code, so a public repo would expose it. Private repos work fine with both Render and Vercel (free).

---

## Step 1 — Put the project on GitHub

### Easiest way: GitHub Desktop (recommended, no commands)
1. Install **GitHub Desktop** → https://desktop.github.com
2. Open it, sign in to GitHub.
3. **File → Add Local Repository →** choose `D:\makemytrip`.
4. It will say "this isn't a git repository — create one?" → click **Create a repository** → **Create Repository**.
5. Click **Publish repository** (top right). **Uncheck "Keep this code private"? NO — leave it CHECKED so it stays private.** → **Publish**.

Done — your code is on GitHub.

### Or with commands (if you prefer the terminal)
Open a terminal in `D:\makemytrip` and run:
```
git init
git add .
git commit -m "MakeMyTour full stack project"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/makemytrip.git
git push -u origin main
```
(First create an empty **private** repo named `makemytrip` on github.com. If it asks for a password, use a Personal Access Token from GitHub → Settings → Developer settings → Personal access tokens.)

---

## Step 2 — Deploy the Backend to Render
1. Go to https://render.com → sign up / log in **with GitHub**.
2. Click **New +  → Web Service**.
3. Connect and pick your **makemytrip** repo.
4. Fill in:
   - **Name:** `makemytour-backend`
   - **Root Directory:** *(leave blank)*
   - **Language / Runtime:** **Docker** (Render auto-detects the Dockerfile)
   - **Instance Type:** **Free**
5. Open **Advanced → Add Environment Variable**:
   - **Key:** `MONGODB_URI`
   - **Value:**
     ```
     mongodb+srv://PBatRJXPM8tIDH43:PBatRJXPM8tIDH43@connectify-cluster.uieqfq3.mongodb.net/makemytrip?retryWrites=true&w=majority&appName=connectify-cluster
     ```
   *(You don't need to set PORT — Render sets it automatically.)*
6. Click **Create Web Service**. The first build takes about **5–10 minutes**.
7. When it says **Live**, copy the URL at the top, e.g.
   `https://makemytour-backend.onrender.com`
8. **Test it:** open that URL in your browser → you should see
   **✅ It's running on port 8080!**

---

## Step 3 — Let Render reach your database
1. In **MongoDB Atlas → Network Access → Add IP Address**.
2. Click **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**.
   *(Render's server IP changes, so this is required. You may already have done this.)*

---

## Step 4 — Deploy the Frontend to Vercel
1. Go to https://vercel.com → sign up / log in **with GitHub**.
2. **Add New… → Project** → **Import** your `makemytrip` repo.
3. Configure:
   - **Root Directory:** click **Edit** and select the **`makemytour`** folder. *(Important — the frontend lives in this subfolder.)*
   - **Framework Preset:** Next.js *(auto-detected)*
4. Expand **Environment Variables** and add:
   - **Key:** `NEXT_PUBLIC_BACKEND_URL`
   - **Value:** your Render backend URL from Step 2, e.g. `https://makemytour-backend.onrender.com`
     *(no slash at the end)*
5. Click **Deploy**. Takes about **2–3 minutes**.
6. You'll get a public URL like `https://makemytrip.vercel.app` — **that is your live website.** 🎉

---

## Step 5 — Final checks
- Open your **Vercel URL**. The site should load.
- Log in with `usiddik331@gmail.com` / `siddik@123`, search flights/hotels, book, review, etc.
- **If flights/hotels look empty:** the free Render backend "sleeps" after 15 minutes of no use. Open the **backend URL** once to wake it (takes ~50 seconds), then refresh your site.

---

## Keeping it live & updating
- **Free Render sleeps when idle** → the first visit after a while is slow (~1 min) while it wakes. For your evaluation, open the backend URL first to wake it, then share the site.
- **To update the live site later:** just push your changes to GitHub (GitHub Desktop: Commit → Push, or `git add . && git commit -m "update" && git push`). Render and Vercel redeploy automatically.

## Security reminder
- Keep the GitHub repo **private**.
- After your evaluation is done, **change your MongoDB password** (Atlas → Database Access → Edit → Edit Password), because it is stored in the code.

## Submit
Send your **Vercel URL** to **training@elevanceskills.com** with your name, domain, and project link. Keep it live until evaluation is complete.
