# Cinetube 🍿

**Cinetube** is a modern, full-stack cinematic streaming platform designed with a sleek, premium dark-mode aesthetic. 

It provides users with an immersive experience to browse movies, series, watch trailers, and manage their personal watchlists. It also features a robust Admin Dashboard for complete platform management.

---

## ⚡ Features

### For Users
- **Cinematic UI/UX:** A beautifully crafted dark-mode interface using Tailwind CSS, Glassmorphism, and Framer Motion animations.
- **Media Catalog:** Browse categorized media (Trending, New Releases, Most Popular) and filter by genres like Action, Comedy, Drama, and more.
- **Search System:** Real-time search by title or genre.
- **User Profiles & Watchlists:** Create accounts, personalize profiles, and save favorite movies/series to your watchlist.
- **Authentication:** Secure user login and registration.

### For Administrators
- **Admin Dashboard:** Access a protected administration panel.
- **Media Management:** Add, update, and remove movies or series from the catalog.
- **User Management:** Monitor, suspend, or manage platform users.
- **Platform Settings:** Configure general site settings, maintenance mode, and application behavior.

---

## 🛠️ Technology Stack

### Frontend (`/frontend`)
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Library:** React 18
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Dark Theme & Utility Classes)
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend (`/Backend`)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Architecture:** Modular controller-service pattern

---

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
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
3. Set up your `.env` file (Database connection string, JWT secrets).
4. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend development server:
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
3. Set up your `.env.local` file (Backend API URL).
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *(The frontend server usually runs on port 3000).*

### 3. Open the App
Visit `http://localhost:3000` in your browser to start exploring Cinetube!

---

## 📂 Project Structure

```text
Cinetube/
├── Backend/                 # Express API & Prisma Database
│   ├── prisma/              # Database schema & migrations
│   └── src/
│       ├── controllers/     # Route controllers
│       ├── middlewares/     # Auth & error handling middlewares
│       ├── modules/         # Modular services (media, user, etc.)
│       └── routes/          # API route definitions
│
└── frontend/                # Next.js Application
    ├── app/                 # App Router pages (admin, search, auth)
    ├── components/          # Reusable UI components (Navbar, HomeView)
    ├── services/            # API client and external services
    ├── store/               # Global state management (Zustand/Context)
    └── types/               # TypeScript interfaces
```

---

*Designed and built with ❤️ by Dev Arman Hossain & the Cinetube Team.*
