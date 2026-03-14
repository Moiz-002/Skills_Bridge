# SkillBridge - Quick Start Guide

Get SkillBridge up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

## Installation

### 1️⃣ Install Dependencies (30 seconds)

```bash
npm install
```

### 2️⃣ Configure Environment (30 seconds)

Your `.env.local` is already configured with:
- `MONGODB_URI` - Your MongoDB connection
- `JWT_SECRET` - JWT signing key

**⚠️ For Production:**
Update `JWT_SECRET` to a strong random value:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3️⃣ Start Development Server (10 seconds)

```bash
npm run dev
```

Visit **http://localhost:3000** 🎉

---

## First Steps

### 1. Create an Account
1. Click "Sign Up" button
2. Enter name, email, password
3. Click "Create Account"
4. Redirected to dashboard

### 2. Create Your First Skill
1. Click "Add Skill" on dashboard
2. Fill in title, category, description
3. Click "Create Skill"
4. Skill appears on your dashboard

### 3. Browse Skills
1. Click "Skills" in navbar
2. Search or filter by category
3. Click "View" on any skill
4. Send learning request

### 4. Manage Requests
1. Click "Requests" in navbar
2. See requests you sent and received
3. Accept/reject requests you received
4. Track learning status

---

## Project Structure at a Glance

```
app/                    # Pages & API routes
├── page.tsx           # Landing page ✨
├── login/page.tsx     # Auth pages 🔐
├── signup/page.tsx
├── dashboard/page.tsx # User dashboard 📊
├── skills/            # Skill pages 📚
│   ├── page.tsx      # Marketplace
│   ├── create/page.tsx
│   └── [id]/page.tsx
├── requests/page.tsx  # Requests page 📨
└── api/               # API endpoints 🔌
    ├── auth/          # Login/signup/logout
    ├── skills/        # CRUD skills
    └── requests/      # Manage requests

components/           # Reusable components 🧩
├── Navbar.tsx
├── SkillCard.tsx
├── RequestCard.tsx
└── AuthForm.tsx

lib/                 # Utilities 🛠️
├── mongodb.ts      # DB connection
└── auth.ts         # JWT & password

models/             # Mongoose schemas 📦
├── User.ts
├── Skill.ts
└── Request.ts
```

---

## Common Tasks

### Build for Production

```bash
npm run build
npm start
```

### Debug API Issues

Check browser console (F12) and server logs in terminal.

### Test an Endpoint

```bash
# Get all skills
curl http://localhost:3000/api/skills

# See API docs
cat API_DOCUMENTATION.md
```

### Reset Database

Delete all collections in MongoDB Atlas, then restart app.

### Change Password Rules

Edit `app/api/auth/signup/route.ts` line ~30

---

## Key Files to Know

| File | Purpose |
|------|---------|
| `lib/mongodb.ts` | MongoDB connection (reused) |
| `lib/auth.ts` | JWT & password functions |
| `models/*.ts` | Mongoose schemas |
| `app/api/**/*.ts` | API endpoint handlers |
| `components/*.tsx` | Reusable UI components |
| `app/**/page.tsx` | Page components |

---

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use different port
npm run dev -- -p 3001
```

### MongoDB Connection Error
```bash
✓ Check MONGODB_URI in .env.local
✓ Verify IP whitelisted in MongoDB Atlas
✓ Test connection string
```

### Build Fails
```bash
npm run build
# Read error messages carefully
# Delete .next folder and try again
rm -rf .next
npm run build
```

### Styles Not Loading
```bash
# Rebuild TailwindCSS
npm run dev
# Hard refresh browser (Ctrl+Shift+R)
```

---

## Environment Setup

### Windows Users
- Use PowerShell or Git Bash
- Run commands from project folder
- `.env.local` should be in root

### Mac/Linux Users
- Works out of the box
- Remember to add execution permissions if needed

---

## Next.js App Router Basics

```typescript
// Pages use file-based routing
app/page.tsx           → /
app/login/page.tsx     → /login
app/skills/[id]/page.tsx → /skills/123

// API routes
app/api/skills/route.ts       → /api/skills
app/api/skills/[id]/route.ts  → /api/skills/123

// Client vs Server Components
'use client'           // Client component
                       // Default is server component
```

---

## Database Models at a Glance

### User
```javascript
{ name, email, password (hashed), createdAt }
```

### Skill
```javascript
{ title, description, category, createdBy (User), createdAt }
```

### Request
```javascript
{ skillId (Skill), studentId (User), teacherId (User), status, createdAt }
```

---

## Authentication Flow

```
Signup/Login
    ↓
JWT token generated
    ↓
Stored in HTTP-only cookie
    ↓
Sent automatically with requests
    ↓
Verified on protected routes
```

---

## Performance Tips

✅ MongoDB connections are pooled and reused
✅ Server-side rendering by default (faster)
✅ Only use 'use client' where needed (forms)
✅ TailwindCSS is pre-purged for production

---

## Resources

- **Docs**: Open `PROJECT_SETUP.md`
- **API Docs**: Open `API_DOCUMENTATION.md`
- **Issues**: Check terminal error messages
- **Next.js**: https://nextjs.org/docs
- **MongoDB**: https://docs.mongodb.com
- **TailwindCSS**: https://tailwindcss.com/docs

---

## Deploy in 2 Minutes

### To Vercel

```bash
npm install -g vercel
vercel
# Follow prompts
# Add environment variables in Vercel dashboard
```

### To Other Platforms

See `PROJECT_SETUP.md` → Deployment section

---

## You're All Set! 🚀

Your SkillBridge app is ready to go!

Next:
1. Explore the app
2. Create a skill
3. For production, read `PROJECT_SETUP.md`
4. For API details, see `API_DOCUMENTATION.md`

Happy coding! 💻

---

Questions? Check the documentation files or look at the code comments!
