# Cinetube 🍿

## Project Description
**Cinetube** is a modern, full-stack cinematic streaming platform designed with a sleek, premium dark-mode aesthetic. 

It provides users with an immersive experience to browse movies, series, watch trailers, and manage their personal watchlists. It also features a robust Admin Dashboard for complete platform management, including secure authentication, payment processing, and media hosting.

---

## 🌐 Live URLs

- **Frontend Application:** [Cinetube Frontend](https://cine-tube-seven.vercel.app)
- **Backend API:** [Cinetube Backend](https://cine-tube-backend.vercel.app)

---

## ⚡ Features

### For Users
- **Cinematic UI/UX:** A beautifully crafted dark-mode interface using Tailwind CSS, Glassmorphism, and Framer Motion animations.
- **Media Catalog:** Browse categorized media (Trending, New Releases, Most Popular) and filter by genres like Action, Comedy, Drama, and more.
- **Search System:** Real-time search by title or genre.
- **User Profiles & Watchlists:** Create accounts, personalize profiles, and save favorite movies/series to your watchlist.
- **Authentication:** Secure user login and registration, including standard JWT auth and **Google OAuth integration**.
- **Premium Subscription & Payments:** Seamless integration with **Stripe** and **SSLCommerz** for unlocking premium content.

### For Administrators
- **Admin Dashboard:** Access a protected administration panel to oversee the application.
- **Media Management:** Add, update, and remove movies or series from the catalog. Uses **Cloudinary** for image uploads.
- **User Management:** Monitor, suspend, or manage platform users.
- **Platform Settings:** Configure general site settings, maintenance mode, and application behavior.

---

## 🛠️ Technologies Used

### Frontend (`/frontend`)
- **Framework:** [Next.js](https://nextjs.org/) (App Router, v16.1.6)
- **Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Dark Theme & Utility Classes)
- **Animations:** Framer Motion
- **State Management:** Zustand, React Query (@tanstack/react-query)
- **Forms & Validation:** React Hook Form, Zod
- **Authentication:** Google OAuth (@react-oauth/google)
- **Icons:** Lucide React

### Backend (`/Backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database:** PostgreSQL
- **Authentication & Security:** JWT (jsonwebtoken), bcrypt, Google Auth Library
- **Payments:** Stripe, SSLCommerz
- **Media Storage:** Cloudinary, Multer
- **Email Services:** Nodemailer
- **Validation:** Zod
- **Architecture:** Modular controller-service pattern

---

## 🚀 Setup Instructions

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v20+ recommended)
- `npm` or `yarn`
- PostgreSQL or your preferred Prisma-supported database

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file (Database connection string, JWT secrets, Stripe/Cloudinary/Google keys, etc.).
4. Run Prisma migrations and generate the Prisma Client:
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```
5. Seed the database with initial data (optional):
   ```bash
   npx prisma db seed
   ```
6. Start the backend development server:
   ```bash
   npm run dev
   ```
   *(The backend server usually runs on port 5000).*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env.local` file (Backend API URL, Next Auth/Google Client ID, Stripe public keys, etc.).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(The frontend server usually runs on port 3000).*

### 3. Open the App
Visit `http://localhost:3000` in your browser to start exploring Cinetube!
