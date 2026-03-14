# SkillBridge - Full-Stack Application Setup Guide

## Project Overview

**SkillBridge** is a production-ready full-stack skill exchange platform built with Next.js 14, TypeScript, MongoDB, and TailwindCSS. Users can teach, learn, and exchange skills in a collaborative community environment.

### Key Features

- **User Authentication**: Secure signup/login with JWT tokens and bcrypt password hashing
- **Skill Marketplace**: Create, view, and manage skills with categories
- **Skill Requests**: Send, receive, accept, and reject skill learning requests
- **User Dashboard**: View your profile, skills, and request management
- **Responsive Design**: Mobile-first UI with TailwindCSS and Lucide icons

---

## Tech Stack

```
Frontend:
- Next.js 14 (App Router)
- React 19
- TypeScript
- TailwindCSS 4
- Lucide React Icons

Backend:
- Next.js Route Handlers
- Express-like API routes
- MongoDB with Mongoose ODM
- JWT Authentication
- bcryptjs for password hashing

Database:
- MongoDB Atlas
- Mongoose ODM

```

---

## Project Structure

```
skills_bridge/
├── app/                          # Main application directory
│   ├── page.tsx                 # Landing page with hero section
│   ├── login/page.tsx           # User login page
│   ├── signup/page.tsx          # User registration page
│   ├── dashboard/page.tsx       # User dashboard
│   ├── skills/                  # Skills management
│   │   ├── page.tsx            # Skills marketplace
│   │   ├── create/page.tsx      # Create new skill
│   │   └── [id]/page.tsx        # Skill details & request
│   ├── requests/page.tsx        # Requests management
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── api/                      # API routes
│       ├── auth/
│       │   ├── signup/route.ts   # User registration endpoint
│       │   ├── login/route.ts    # User login endpoint
│       │   └── logout/route.ts   # User logout endpoint
│       ├── skills/
│       │   ├── route.ts          # GET all skills, POST new skill
│       │   └── [id]/route.ts     # GET skill, DELETE skill
│       └── requests/
│           └── route.ts          # GET, POST, PUT requests
│
├── components/                   # Reusable components
│   ├── Navbar.tsx               # Navigation bar with auth state
│   ├── SkillCard.tsx            # Skill card component
│   ├── RequestCard.tsx          # Request card component
│   └── AuthForm.tsx             # Login/signup form
│
├── lib/                          # Utility functions
│   ├── mongodb.ts               # MongoDB connection manager
│   └── auth.ts                  # JWT & password utilities
│
├── models/                       # Mongoose models
│   ├── User.ts                  # User schema & model
│   ├── Skill.ts                 # Skill schema & model
│   └── Request.ts               # Skill request schema & model
│
├── public/                       # Static assets
├── .env.local                   # Environment variables
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
├── next.config.ts               # Next.js configuration
└── tailwind.config.ts           # TailwindCSS configuration
```

---

## Installation & Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Step 1: Install Dependencies

```bash
cd skills_bridge
npm install
```

This installs:
- `next`, `react`, `react-dom` - Core framework
- `typescript` - Type safety
- `mongoose` - MongoDB ODM
- `mongodb` - MongoDB driver
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `lucide-react` - Icons
- `tailwindcss` - Styling

### Step 2: Configure Environment Variables

Create/update `.env.local`:

```env
# MongoDB Connection String (already configured)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database-name

# JWT Secret for token signing (change in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
```

### Step 3: Run Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

### Step 4: Build for Production

```bash
npm run build
npm start
```

---

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,           // Full name (required)
  email: String,          // Unique email (required)
  password: String,       // Bcrypt hashed (required)
  createdAt: DateTime     // Auto-generated
}
```

### Skills Collection

```javascript
{
  _id: ObjectId,
  title: String,              // Skill title (required)
  description: String,        // Detailed description (required)
  category: String,           // Programming | Design | Languages | Business | Creative | Other
  createdBy: ObjectId,        // Reference to User (required)
  createdAt: DateTime         // Auto-generated
}
```

### Requests Collection

```javascript
{
  _id: ObjectId,
  skillId: ObjectId,          // Reference to Skill (required)
  studentId: ObjectId,        // Reference to User learning (required)
  teacherId: ObjectId,        // Reference to User teaching (required)
  status: String,             // pending | accepted | rejected | completed
  createdAt: DateTime         // Auto-generated
}
```

---

## API Endpoints

### Authentication Endpoints

**POST `/api/auth/signup`**
- Create new user account
- Body: `{ name, email, password, confirmPassword }`
- Returns: User object + JWT token

**POST `/api/auth/login`**
- Authenticate user
- Body: `{ email, password }`
- Returns: User object + JWT token

**POST `/api/auth/logout`**
- Clear authentication session
- Returns: Success message

### Skills Endpoints

**GET `/api/skills`**
- Retrieve all skills with creator info
- Authentication: Optional
- Returns: Array of skill objects

**POST `/api/skills`**
- Create new skill
- Authentication: Required (JWT)
- Body: `{ title, description, category }`
- Returns: Created skill object

**GET `/api/skills/[id]`**
- Get specific skill details
- Authentication: Optional
- Returns: Single skill object

**DELETE `/api/skills/[id]`**
- Delete skill (owner only)
- Authentication: Required (JWT)
- Returns: Success message

### Requests Endpoints

**GET `/api/requests?type=all|sent|received`**
- Get learning requests
- Authentication: Required (JWT)
- Query: `type` (optional: all, sent, received)
- Returns: Array of request objects

**POST `/api/requests`**
- Send skill learning request
- Authentication: Required (JWT)
- Body: `{ skillId }`
- Returns: Created request object

**PUT `/api/requests`**
- Accept/reject request
- Authentication: Required (JWT, teacher only)
- Body: `{ requestId, status: "accepted"|"rejected" }`
- Returns: Updated request object

---

## User Flows

### 1. Signup & Login

```
User → Signup/Login Page
      ↓
   Enter credentials
      ↓
   API validates & hashes password
      ↓
   JWT token generated (7 days expiry)
      ↓
   Token stored in HTTP-only cookie
      ↓
   Redirect to Dashboard
```

### 2. Create & Share Skill

```
Authenticated User → Dashboard
                  ↓
             Click "Add Skill"
                  ↓
             Fill skill form
                  ↓
             POST /api/skills
                  ↓
             Skill saved to MongoDB
                  ↓
             Redirect to Dashboard
```

### 3. Request to Learn

```
User → Skills Marketplace
    ↓
   Browse & filter skills
    ↓
   Click "View" on skill
    ↓
   View skill details
    ↓
   Click "Request to Learn"
    ↓
   POST /api/requests with skillId
    ↓
   Request created (pending status)
    ↓
   Teacher notified in Dashboard
```

### 4. Accept/Reject Request

```
Teacher → Dashboard
       ↓
    See "Requests for Your Skills"
       ↓
    Click Accept/Reject button
       ↓
    PUT /api/requests with new status
       ↓
    Status updated
       ↓
    Student sees status change
```

---

## Features & Components

### Landing Page (`/`)
- Hero section with call-to-action
- Feature showcase
- Login/Signup buttons
- Responsive grid layout

### Authentication Pages
- **Login** (`/login`): Email + password
- **Signup** (`/signup`): Full name + email + password + confirm
- Form validation & error handling
- Smooth redirects on success

### Dashboard (`/dashboard`)
- User profile display
- Skills count & requests count
- List of your created skills
- Quick view of pending requests
- Create new skill shortcut

### Skills Marketplace (`/skills`)
- Browse all community skills
- Search by title/description
- Filter by category
- View skill creator info
- Own skills management (delete option)

### Skill Details (`/skills/[id]`)
- Full skill description
- Teacher information & contact
- "Request to Learn" button
- Success confirmation

### Create Skill (`/skills/create`)
- Title input
- Category dropdown
- Description textarea
- Form validation
- Back/Cancel option

### Requests Management (`/requests`)
- Tabbed interface (All, Received, Sent)
- Request cards with status badges
- Accept/Reject buttons (for received)
- Timestamps and user info
- Color-coded status indicators

### Navbar Component
- Logo & branding
- Responsive mobile menu
- Auth state-based navigation
- Logout functionality
- Mobile hamburger menu

---

## Security Features

### Authentication
✓ JWT tokens with 7-day expiry
✓ HTTP-only, Secure, SameSite cookies
✓ Password hashing with bcryptjs (10 salt rounds)
✓ Email validation

### Authorization
✓ Protected routes (dashboard, requests)
✓ Skill deletion only by creator
✓ Request status update only by teacher
✓ Cannot request own skills

### Data Protection
✓ Passwords selected out by default (not returned)
✓ MongoDB connection pooling
✓ Environment variables for secrets
✓ CORS-friendly API design

---

## Development Tips

### Working with Authentication

```typescript
// Get current user
import { getCurrentUser } from '@/lib/auth';
const user = await getCurrentUser();

// Verify token
import { verifyToken } from '@/lib/auth';
const decoded = verifyToken(token);

// Hash password
import { hashPassword } from '@/lib/auth';
const hashed = await hashPassword(password);
```

### Connecting to Database

```typescript
import { connectDB } from '@/lib/mongodb';

export async function GET() {
  await connectDB(); // Reused connection
  // Use models
}
```

### Using Models

```typescript
import { User } from '@/models/User';
import { Skill } from '@/models/Skill';
import { Request } from '@/models/Request';

// Populate references
const skill = await Skill.findById(id).populate('createdBy', 'name email');
```

---

## Common Tasks

### Add a New Category

Edit `models/Skill.ts`:
```typescript
category: {
  enum: ['Programming', 'Design', 'Languages', 'Business', 'Creative', 'NewCategory'],
}
```

Update frontend skill forms to include new category.

### Change JWT Expiry

Edit `lib/auth.ts`:
```typescript
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '30d' }); // Change here
}
```

### Add Email Verification

Create new API route `/api/auth/verify-email`
Store `emailVerified` flag in User model
Check before allowing actions

### Implement Pagination

Update `/api/skills`:
```typescript
const page = parseInt(query.page || '1');
const limit = 10;
const skip = (page - 1) * limit;
const skills = await Skill.find().skip(skip).limit(limit);
```

---

## Troubleshooting

### MongoDB Connection Issues

```
Error: connect ECONNREFUSED
→ Check MONGODB_URI in .env.local
→ Verify MongoDB Atlas IP whitelist
→ Test connection string in MongoDB Compass
```

### JWT Token Not Working

```
Error: Invalid token
→ Check JWT_SECRET in .env.local
→ Verify token not expired
→ Clear cookies and re-login
```

### Build Errors

```
npm run build
→ Fix TypeScript errors shown in console
→ Check for missing imports
→ Verify all dependencies installed
```

---

## Performance Optimizations

✓ MongoDB connection pooling & reuse
✓ Server-side rendered pages by default
✓ Client components only where needed
✓ Image optimization (next/image)
✓ CSS-in-JS with TailwindCSS
✓ Lazy loading for modals/images
✓ API route caching headers ready

---

## Next Steps & Enhancements

- [ ] Add email notifications
- [ ] Implement skill ratings/reviews
- [ ] Add user profiles with bio
- [ ] Implement messaging system
- [ ] Add file uploads (certificates, portfolios)
- [ ] Create admin dashboard
- [ ] Add payment integration
- [ ] Implement social features (follow, likes)
- [ ] Add skill completion certificates
- [ ] Implement analytics & insights

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

### Environment Variables on Vercel

1. Project Settings → Environment Variables
2. Add:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Strong random string

### Other Platforms

- **Netlify**: Deploy from Git with serverless functions
- **Railway**: Zero-config deployment with MongoDB
- **Render**: Simple deployment dashboard

---

## Support & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Mongoose](https://mongoosejs.com)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev)
- [JWT.io](https://jwt.io)

---

## License

This project is open source and available for educational and commercial use.

---

**Happy Building! 🚀**
