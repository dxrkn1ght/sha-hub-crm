# Education CRM

A comprehensive platform for managing educational institutions, students, teachers, and administrative tasks. Built with Next.js, TypeScript, Zustand, and Tailwind CSS.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Demo Accounts](#demo-accounts)
- [Project Structure](#project-structure)
- [License](#license)

## Overview

Education CRM is designed to streamline the management of schools, colleges, and other educational institutions. It provides dedicated dashboards and tools for admins, teachers, and students, supporting user management, payments, attendance, achievements, and more.

## Features

- **Admin Panel**: Manage teachers, students, payments, salaries, products, and view analytics dashboards.
- **Teacher Portal**: Track groups, lessons, attendance, and student points.
- **Student Portal**: View achievements, join groups, shop, and access a personalized dashboard.
- **Authentication**: Role-based login for Admin, Teacher, and Student.
- **Mock Data**: Preloaded demo data for instant testing and exploration.
- **Responsive UI**: Modern, mobile-friendly interface.

## Tech Stack

- [Next.js](https://nextjs.org/) (v15)
- [React](https://react.dev/) (v19)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Radix UI](https://www.radix-ui.com/)
- [Recharts](https://recharts.org/) (charts & analytics)

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- pnpm, yarn, or npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd edu-crm
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   # or
   yarn install
   # or
   npm install
   ```
3. **Run the development server:**
   ```bash
   pnpm dev
   # or
   yarn dev
   # or
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Accounts

Use the following credentials to log in as different roles:

| Role    | Username | Password |
| ------- | -------- | -------- |
| Admin   | admin    | password |
| Teacher | teacher  | password |
| Student | student  | password |

Select the appropriate role on the login page.

## Project Structure

```
app/
  admin/         # Admin dashboard, teachers, students, payments, salaries, shop
  teacher/       # Teacher dashboard, groups, lessons, attendance, points
  student/       # Student dashboard, achievements, groups, shop
  dashboard/     # Shared dashboard
  login-form.tsx # Login form component
  layout.tsx     # Root layout and metadata
components/
  layouts/       # Layouts for admin, teacher, student, unified
  ui/            # Reusable UI components (button, card, table, etc.)
hooks/           # Custom React hooks
lib/             # Utility functions
mock/            # Mock data for demo/testing
providers/       # Context and theme providers
public/          # Static assets (logo, images)
stores/          # Zustand stores for state management
types/           # TypeScript types and interfaces
```

## License

MIT


## Setup for production (PostgreSQL + Prisma + NextAuth)

This repository has been adjusted to use **Prisma (PostgreSQL)** and **NextAuth.js**.

1. Create a PostgreSQL database and set `DATABASE_URL` in your environment:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
```

2. Set NextAuth secret:
```
NEXTAUTH_SECRET="a-long-random-string"
```

3. Install dependencies and Prisma:
```
pnpm install
npx prisma generate
npx prisma migrate dev --name init
```

4. Run the app:
```
pnpm dev
```

Notes:
- Admin routes for creating teachers/students are under `/api/admin/teachers` and `/api/admin/students`.
- Use the Admin UI pages at `/admin/teachers` and `/admin/students` to create accounts.
