# 🎬 CineTube — AI Build Prompt for Antigravity

> Paste this entire file into Antigravity AI chat to start building the project.
> Work through it **section by section**. Do NOT ask Antigravity to build everything at once.

---

## 🧠 Project Context

You are helping me build a full-stack web application called **CineTube** — a Movie and Series Rating & Streaming Portal.

**Tech Stack:**
- Frontend: Next.js 14 (App Router), Tailwind CSS, TypeScript
- Backend: Node.js, Express.js, Prisma ORM
- Database: PostgreSQL
- Auth: JWT (jsonwebtoken + bcryptjs)
- Deployment: Vercel (frontend), Render (backend)

**Two user roles:**
- `USER` — browse, rate, review, like, comment, watchlist
- `ADMIN` — manage media library, moderate reviews, view dashboard

**Important:** Do NOT implement any payment/subscription functionality. Skip all payment-related code entirely.

---

## 📁 STEP 1 — Initialize Backend Project

Create a Node.js + Express backend project with the following structure:

```
backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── media.routes.js
│   │   ├── review.routes.js
│   │   ├── comment.routes.js
│   │   ├── watchlist.routes.js
│   │   └── admin.routes.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── media.controller.js
│   │   ├── review.controller.js
│   │   ├── comment.controller.js
│   │   ├── watchlist.controller.js
│   │   └── admin.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── role.middleware.js
│   │   └── error.middleware.js
│   └── utils/
│       ├── jwt.js
│       └── sendEmail.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── .env
├── .env.example
└── package.json
```

**Install these packages:**
```bash
npm install express prisma @prisma/client bcryptjs jsonwebtoken cors dotenv zod nodemailer
npm install -D nodemon
```

**app.js setup:**
- Use `express.json()` middleware
- Use `cors` with `FRONTEND_URL` from env
- Mount all routes under `/api`
- Mount global error handler at the end

**server.js:**
- Import app, listen on `process.env.PORT || 5000`

---

## 📁 STEP 2 — Prisma Schema

Create `prisma/schema.prisma` with the following exact models:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role {
  USER
  ADMIN
}

enum MediaType {
  MOVIE
  SERIES
}

enum ContentType {
  FREE
  PREMIUM
}

enum ReviewStatus {
  PENDING
  PUBLISHED
  UNPUBLISHED
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(USER)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  reviews   Review[]
  likes     Like[]
  comments  Comment[]
  watchlist Watchlist[]
}

model Media {
  id            String      @id @default(uuid())
  title         String
  synopsis      String
  genre         String[]
  releaseYear   Int
  director      String
  cast          String[]
  platform      String[]
  posterUrl     String?
  streamingLink String?
  type          MediaType
  contentType   ContentType @default(FREE)
  avgRating     Float       @default(0)
  totalRatings  Int         @default(0)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt

  reviews   Review[]
  watchlist Watchlist[]
}

model Review {
  id         String       @id @default(uuid())
  rating     Int
  content    String
  tags       String[]
  hasSpoiler Boolean      @default(false)
  status     ReviewStatus @default(PENDING)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  userId  String
  mediaId String
  user    User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  media   Media   @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  likes    Like[]
  comments Comment[]
}

model Like {
  id       String @id @default(uuid())
  userId   String
  reviewId String

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  review Review @relation(fields: [reviewId], references: [id], onDelete: Cascade)

  @@unique([userId, reviewId])
}

model Comment {
  id        String   @id @default(uuid())
  content   String
  createdAt DateTime @default(now())

  userId   String
  reviewId String
  parentId String?

  user     User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  review   Review    @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  parent   Comment?  @relation("CommentReplies", fields: [parentId], references: [id])
  replies  Comment[] @relation("CommentReplies")
}

model Watchlist {
  id      String @id @default(uuid())
  userId  String
  mediaId String

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  media Media @relation(fields: [mediaId], references: [id], onDelete: Cascade)

  @@unique([userId, mediaId])
}
```

After creating the schema run:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

---

## 📁 STEP 3 — Environment Variables

Create `.env` file:
```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/cinetube"
JWT_SECRET="cinetube-super-secret-jwt-key-2025"
JWT_EXPIRES_IN="7d"
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@cinetube.com
```

---

## 📁 STEP 4 — Utilities

### `src/utils/jwt.js`
```js
const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { generateToken, verifyToken };
```

### `src/utils/sendEmail.js`
Use Nodemailer to send password reset emails. Accept `{ to, subject, html }` and send via SMTP config from `.env`.

---

## 📁 STEP 5 — Middlewares

### `src/middlewares/auth.middleware.js`
- Extract Bearer token from `Authorization` header
- Verify using `verifyToken`
- Attach decoded user to `req.user`
- Return 401 if token missing or invalid

### `src/middlewares/role.middleware.js`
```js
const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
};
module.exports = requireRole;
```

### `src/middlewares/error.middleware.js`
Global error handler — catch all errors, return `{ success: false, message, errors }` with appropriate status code.

---

## 📁 STEP 6 — Auth Controller & Routes

### Routes: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

### Auth Controller logic:

**register:**
- Validate: name, email, password (min 6 chars) using Zod
- Check if email already exists → 409 error
- Hash password with bcryptjs (saltRounds: 10)
- Create user in DB
- Return user (without password) + JWT token

**login:**
- Validate email + password
- Find user by email → 401 if not found
- Compare password with bcrypt → 401 if wrong
- Return user (without password) + JWT token

**me:**
- Protected route (auth middleware)
- Return `req.user` data from DB (fetch fresh from Prisma, exclude password)

**forgot-password:**
- Find user by email
- Generate reset token: `crypto.randomBytes(32).toString('hex')`
- Store hashed token + expiry (15 min from now) — add `resetToken` and `resetTokenExpiry` fields to User model
- Send email with reset link: `${FRONTEND_URL}/reset-password?token=RAW_TOKEN`

**reset-password:**
- Hash the received token, find user where resetToken matches and expiry > now
- Update password (hash new one), clear reset fields

---

## 📁 STEP 7 — Media Controller & Routes

### Routes:
- `GET /api/media` — public, paginated, filterable
- `GET /api/media/featured` — public, returns top 8 highest rated
- `GET /api/media/search` — public, search by ?q=
- `GET /api/media/:id` — public, single media with reviews
- `POST /api/media` — admin only
- `PUT /api/media/:id` — admin only
- `DELETE /api/media/:id` — admin only

### Query params for GET /api/media:
- `?page=1&limit=12` (pagination)
- `?genre=Action` (filter)
- `?platform=Netflix`
- `?type=MOVIE` or `?type=SERIES`
- `?minRating=7`
- `?year=2023`
- `?sort=highest_rated | most_reviewed | latest`
- `?q=search term` (searches title, director)

### POST/PUT media body validation (Zod):
```js
{
  title: string (required),
  synopsis: string (required),
  genre: string[] (min 1),
  releaseYear: number,
  director: string,
  cast: string[],
  platform: string[],
  posterUrl: string (optional URL),
  streamingLink: string (optional URL),
  type: 'MOVIE' | 'SERIES',
  contentType: 'FREE' | 'PREMIUM'
}
```

---

## 📁 STEP 8 — Review Controller & Routes

### Routes:
- `GET /api/reviews` — public, only PUBLISHED reviews
- `GET /api/reviews/my` — protected user, own reviews
- `GET /api/reviews/:id` — public
- `POST /api/reviews` — protected user
- `PUT /api/reviews/:id` — protected, owner only, only if PENDING
- `DELETE /api/reviews/:id` — protected, owner or admin
- `PATCH /api/reviews/:id/approve` — admin only → set status PUBLISHED, recalculate avgRating
- `PATCH /api/reviews/:id/unpublish` — admin only → set status UNPUBLISHED, recalculate avgRating
- `POST /api/reviews/:id/like` — protected user → toggle like

### avgRating recalculation helper:
```js
const recalculateRating = async (mediaId) => {
  const reviews = await prisma.review.findMany({
    where: { mediaId, status: 'PUBLISHED' }
  });
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  await prisma.media.update({
    where: { id: mediaId },
    data: { avgRating: parseFloat(avg.toFixed(1)), totalRatings: reviews.length }
  });
};
```

### Review body validation (Zod):
```js
{
  mediaId: string (required),
  rating: number min(1) max(10),
  content: string min(10),
  tags: string[] optional,
  hasSpoiler: boolean default false
}
```

---

## 📁 STEP 9 — Comment & Watchlist Controllers

### Comment Routes:
- `GET /api/comments?reviewId=xxx` — public, get comments for a review
- `POST /api/comments` — protected user, body: `{ reviewId, content, parentId? }`
- `DELETE /api/comments/:id` — owner or admin

### Watchlist Routes:
- `GET /api/watchlist` — protected user, returns watchlist with full media details
- `POST /api/watchlist/:mediaId` — protected user, add to watchlist (use upsert)
- `DELETE /api/watchlist/:mediaId` — protected user, remove from watchlist

---

## 📁 STEP 10 — Admin Controller & Routes

All routes require auth middleware + `requireRole('ADMIN')`.

### Routes:
- `GET /api/admin/dashboard` — stats: total users, total media, pending reviews count, published reviews count
- `GET /api/admin/reviews/pending` — all reviews with status PENDING, include user + media info
- `GET /api/admin/users` — all users (exclude passwords)
- `DELETE /api/admin/users/:id` — delete user
- `GET /api/admin/analytics` — top 5 rated media, most reviewed media

---

## 📁 STEP 11 — Seed Data

Create `prisma/seed.js` that seeds:

1. **1 Admin user:** `{ name: "Admin", email: "admin@cinetube.com", password: bcrypt("Admin@123"), role: "ADMIN" }`
2. **5 regular users** with realistic names and emails
3. **15 Movies** — mix of genres (Action, Drama, Sci-Fi, Thriller, Comedy, Horror), mix of FREE/PREMIUM, with real-looking data
4. **5 Series** — different genres and platforms
5. **20 published reviews** — spread across users and media, varied ratings 1-10
6. **5 pending reviews** — for admin moderation testing
7. **Likes** — 2-3 likes per published review
8. **Comments** — 1-2 comments per published review
9. **Watchlist entries** — 2-3 saved titles per user

Add to `package.json`:
```json
"prisma": {
  "seed": "node prisma/seed.js"
}
```

Run with: `npx prisma db seed`

---

## 📁 STEP 12 — Initialize Frontend Project

```bash
npx create-next-app@latest frontend --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Install additional packages:
```bash
npm install axios react-hook-form @hookform/resolvers zod zustand react-hot-toast lucide-react clsx
```

### Folder structure inside `src/`:
```
app/
├── (auth)/
│   ├── login/page.tsx
│   └── register/page.tsx
├── (main)/
│   ├── page.tsx                  # Homepage
│   ├── movies/page.tsx           # All movies & series
│   ├── movies/[id]/page.tsx      # Detail page
│   ├── watchlist/page.tsx
│   ├── profile/page.tsx
│   └── plans/page.tsx
├── admin/
│   ├── dashboard/page.tsx
│   ├── media/page.tsx
│   ├── reviews/page.tsx
│   └── users/page.tsx
├── about/page.tsx
├── contact/page.tsx
├── faq/page.tsx
├── not-found.tsx
└── layout.tsx

components/
├── layout/
│   ├── Navbar.tsx
│   └── Footer.tsx
├── ui/
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Skeleton.tsx
│   ├── Badge.tsx
│   ├── StarRating.tsx
│   └── EmptyState.tsx
├── home/
│   ├── HeroSection.tsx
│   ├── TopRatedSection.tsx
│   ├── NewlyAddedSection.tsx
│   ├── EditorsPicks.tsx
│   ├── PricingCards.tsx
│   └── Testimonials.tsx
├── media/
│   ├── MediaCard.tsx
│   ├── MediaGrid.tsx
│   └── FilterSidebar.tsx
├── review/
│   ├── ReviewCard.tsx
│   ├── ReviewForm.tsx
│   └── CommentSection.tsx
└── admin/
    ├── StatsCard.tsx
    ├── AdminTable.tsx
    └── MediaForm.tsx

lib/
├── api.ts          # Axios instance with base URL + auth header
├── auth.ts         # Token helpers (get/set/remove)
└── utils.ts        # Helper functions

hooks/
├── useAuth.ts
├── useMedia.ts
└── useWatchlist.ts

types/
└── index.ts        # All TypeScript interfaces
```

---

## 📁 STEP 13 — TypeScript Types

Create `src/types/index.ts`:

```typescript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
}

export interface Media {
  id: string;
  title: string;
  synopsis: string;
  genre: string[];
  releaseYear: number;
  director: string;
  cast: string[];
  platform: string[];
  posterUrl?: string;
  streamingLink?: string;
  type: 'MOVIE' | 'SERIES';
  contentType: 'FREE' | 'PREMIUM';
  avgRating: number;
  totalRatings: number;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  content: string;
  tags: string[];
  hasSpoiler: boolean;
  status: 'PENDING' | 'PUBLISHED' | 'UNPUBLISHED';
  userId: string;
  mediaId: string;
  user: User;
  media?: Media;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
}

export interface Like {
  id: string;
  userId: string;
  reviewId: string;
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  reviewId: string;
  parentId?: string;
  user: User;
  replies?: Comment[];
  createdAt: string;
}

export interface WatchlistItem {
  id: string;
  userId: string;
  mediaId: string;
  media: Media;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}
```

---

## 📁 STEP 14 — API Client & Auth Helpers

### `src/lib/api.ts`
```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cinetube_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cinetube_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### `src/lib/auth.ts`
Helper functions: `getToken()`, `setToken(token)`, `removeToken()`, `getUser()`, `isLoggedIn()`, `isAdmin()`

---

## 📁 STEP 15 — Zustand Auth Store

Create `src/hooks/useAuth.ts` using Zustand:
- State: `user: User | null`, `token: string | null`, `isLoading: boolean`
- Actions: `login(email, password)`, `register(name, email, password)`, `logout()`, `fetchMe()`
- On `login` success: save token to localStorage, set user in state
- On `logout`: clear localStorage, reset state

---

## 📁 STEP 16 — UI Design System

### Color Palette (add to `tailwind.config.ts`):
```typescript
colors: {
  cinema: {
    bg: '#0F0F1A',
    card: '#1A1A2E',
    accent: '#E94560',
    gold: '#F5A623',
    border: '#2D2D44',
  }
}
```

### Global styles in `globals.css`:
- Background: `#0F0F1A`
- Default text: white
- Scrollbar: thin, dark styled
- Font: Inter or system-ui

### Design rules to follow:
- Dark cinema theme throughout
- Cards: `bg-cinema-card rounded-xl border border-cinema-border`
- Buttons primary: `bg-cinema-accent hover:bg-red-600 text-white`
- Buttons secondary: `border border-cinema-border hover:border-cinema-accent`
- All interactive elements have hover transitions
- Use `lucide-react` for all icons

---

## 📁 STEP 17 — Navbar Component

Build `components/layout/Navbar.tsx`:
- Logo: "🎬 CineTube" in accent red
- Nav links: Home, Movies, Series (filter preset), About
- Right side (not logged in): Login, Register buttons
- Right side (logged in): Watchlist icon, user avatar dropdown (Profile, My Reviews, Logout)
- Admin users: extra "Dashboard" link in dropdown
- Sticky top with backdrop blur
- Mobile: hamburger menu with slide-down drawer
- Active link highlighting

---

## 📁 STEP 18 — Footer Component

Build `components/layout/Footer.tsx`:
- Logo + tagline
- 4 columns: Explore, Account, Company, Social
- Dark background matching theme
- Copyright line at bottom
- Fully responsive (stacks on mobile)

---

## 📁 STEP 19 — Homepage Sections

Build each section as a separate component:

### HeroSection.tsx
- Full viewport height
- Background: gradient overlay on a dark cinematic image (use CSS gradient, no external image required)
- Large heading: "Discover, Rate & Review Your Favorite Movies"
- Subheading
- Search bar with genre filter chips below
- Two CTA buttons: "Explore Movies" and "Sign Up Free"

### TopRatedSection.tsx
- Section heading + "View All" link
- Horizontal scrollable row of `MediaCard` components
- Fetch from `/api/media?sort=highest_rated&limit=8`

### NewlyAddedSection.tsx
- Grid of recently added media
- Fetch from `/api/media?sort=latest&limit=8`

### EditorsPicks.tsx
- Featured/premium content grid
- Fetch from `/api/media?contentType=PREMIUM&limit=4`
- Larger cards with overlay text

### PricingCards.tsx
- 3 cards: Free, Monthly, Yearly
- Free: basic browsing, public reviews
- Monthly/Yearly: premium content access, early access
- Highlight the "Monthly" card as recommended
- Note: Payment not implemented yet — buttons show "Coming Soon"

### Testimonials.tsx
- Static/hardcoded testimonial cards
- User avatar (initials fallback), name, rating stars, review quote
- Grid layout, 3 columns on desktop

---

## 📁 STEP 20 — MediaCard Component

Build `components/media/MediaCard.tsx`:

Props: `media: Media`, `showWatchlistButton?: boolean`

Features:
- Poster image with fallback gradient placeholder
- Type badge (MOVIE / SERIES) top-left
- Content type badge (FREE / PREMIUM) top-right
- Title, year, genres (first 2 shown)
- Star rating display + numeric rating
- Platform icons/tags
- Watchlist toggle button (bookmark icon) — calls API if logged in
- Hover: scale slightly, show "View Details" overlay
- Click: navigate to `/movies/${media.id}`

---

## 📁 STEP 21 — All Movies/Series Page

Build `app/(main)/movies/page.tsx`:

Features:
- Page heading with result count
- Search input (debounced 400ms)
- Filter sidebar (genre checkboxes, type toggle, rating range slider, platform checkboxes)
- Sort dropdown: Recent | Top Rated | Most Liked
- `MediaGrid` component with paginated results
- Loading skeleton cards while fetching
- Empty state if no results
- Pagination controls at bottom
- All filters update URL query params (use `useSearchParams`)

---

## 📁 STEP 22 — Movie Detail Page

Build `app/(main)/movies/[id]/page.tsx`:

Sections:
1. **Media Header:** poster (left), all details right (title, year, type, genres, director, cast, platforms, avg rating)
2. **Action Bar:** "Add to Watchlist" button, streaming link button (YouTube icon)
3. **Rating Summary:** large number + star visual + total ratings count
4. **Review Form** (logged-in users only): star picker (1-10), textarea, tags input, spoiler toggle, submit button
5. **Reviews List:** all published reviews sorted by newest
   - Each review: user avatar+name, date, rating stars, content (blur if spoiler, click to reveal), tags, like button, comment count
   - Admin actions bar on each review: Approve / Unpublish / Delete
6. **Comment Section** per review (collapsible)

---

## 📁 STEP 23 — User Profile Page

Build `app/(main)/profile/page.tsx`:

Tabs:
1. **Profile:** avatar (initials if none), name (editable), email (read-only), change password form
2. **My Reviews:** list of own reviews with status badge (Pending/Published/Unpublished), edit/delete for PENDING ones
3. **Watchlist:** grid of saved media with remove button

---

## 📁 STEP 24 — Admin Pages

### `app/admin/dashboard/page.tsx`
- 4 stat cards: Total Users, Total Media, Pending Reviews, Published Reviews (fetch from `/api/admin/dashboard`)
- Recent pending reviews list with quick approve/reject buttons
- Protected: redirect to home if not ADMIN

### `app/admin/media/page.tsx`
- Table of all media: poster thumbnail, title, type, year, avg rating, actions
- "Add New Media" button → opens modal with full form
- Edit button → same modal pre-filled
- Delete button → confirmation modal

### `app/admin/reviews/page.tsx`
- 3 tabs: Pending | Published | Unpublished
- Each row: media title, user name, rating, content snippet, spoiler badge, date
- Actions: Approve, Unpublish, Delete

### `app/admin/users/page.tsx`
- Table of all users: name, email, role, joined date, review count
- Delete user with confirmation

---

## 📁 STEP 25 — Additional Pages

### `app/about/page.tsx`
- Hero section about CineTube
- Mission statement
- Team/features highlights
- CTA to sign up

### `app/contact/page.tsx`
- Contact form (name, email, message) — frontend only, no backend needed
- Contact info cards

### `app/faq/page.tsx`
- Accordion FAQ items covering: account, reviews, watchlist, subscriptions

### `app/not-found.tsx`
- Custom 404 with cinema theme
- "Back to Home" button

---

## 📁 STEP 26 — Error Handling (Frontend)

Implement throughout the app:

1. **Form validation:** Use `react-hook-form` + Zod resolver on all forms. Show inline field errors.
2. **API errors:** Catch axios errors, show `react-hot-toast` notification with error message.
3. **Loading states:** Show skeleton loaders for cards/lists, spinner for buttons during submission.
4. **Empty states:** Show `EmptyState` component with relevant message and icon.
5. **Protected routes:** Create `withAuth` HOC or middleware — redirect to `/login` if not authenticated.
6. **Admin guard:** Check `user.role === 'ADMIN'`, redirect to home if not.
7. **404 handling:** `not-found.tsx` catches all unmatched routes.

Example toast usage:
```typescript
import toast from 'react-hot-toast';
try {
  await api.post('/reviews', data);
  toast.success('Review submitted! Awaiting approval.');
} catch (err: any) {
  toast.error(err.response?.data?.message || 'Something went wrong');
}
```

---

## 📁 STEP 27 — Responsive Design Checklist

Ensure every page is responsive:
- Navbar: hamburger menu on mobile
- Homepage sections: single column on mobile, 2-col tablet, 3-4 col desktop
- MediaCard grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Detail page: stacked on mobile, side-by-side on desktop
- Admin tables: horizontally scrollable on mobile
- Filter sidebar: hidden drawer on mobile (toggle button), persistent on desktop
- All forms: full width on mobile

---

## 📁 STEP 28 — Frontend .env.local

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=CineTube
```

---

## 📁 STEP 29 — README Files

### Backend README must include:
- Project name + description
- Live API URL
- Local setup instructions (clone, install, .env, migrate, seed, run)
- All API endpoints documented
- Tech stack

### Frontend README must include:
- Project name + description
- Live frontend URL
- Local setup instructions
- Features list
- Screenshots (add after building)
- Tech stack

---

## 📁 STEP 30 — Deployment

### Backend → Render
1. Push backend to GitHub
2. Create new Web Service on Render
3. Build command: `npm install && npx prisma generate && npx prisma migrate deploy`
4. Start command: `node src/server.js`
5. Add all environment variables from `.env`
6. Use a PostgreSQL database from Render or Neon.tech

### Frontend → Vercel
1. Push frontend to GitHub
2. Import project on Vercel
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
4. Deploy

---

## ✅ Final Checklist Before Submission

- [ ] Frontend GitHub repo (public) with professional README
- [ ] Backend GitHub repo (public) with professional README
- [ ] Frontend live URL on Vercel
- [ ] Backend live URL on Render
- [ ] Admin credentials: `admin@cinetube.com` / `Admin@123`
- [ ] Minimum 35 meaningful commits across both repos
- [ ] All pages responsive on mobile + desktop
- [ ] Input validation on all forms
- [ ] Loading skeletons and error toasts everywhere
- [ ] Seed data working (admin + test users + movies + reviews)
- [ ] Demo video (5-10 min) uploaded to Google Drive (Anyone with link)
- [ ] Payment section: ⏳ **Add this yourself before submission**

---

## 🎯 How to Use This Prompt with Antigravity

1. Paste this entire file into Antigravity AI chat
2. Then say: **"Let's start with STEP 1 — initialize the backend project"**
3. Complete each step fully before moving to the next
4. After every step, test it works before continuing
5. Use this message between steps: **"STEP X is done and working. Now let's do STEP X+1"**

> **Tip:** Never ask Antigravity to do multiple steps at once. One step at a time = cleaner code and fewer bugs.
