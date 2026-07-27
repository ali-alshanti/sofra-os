# Sofra-OS

Sofra OS is a restaurant management system built with Next.js and Supabase. The application helps manage daily restaurant operations through a single dashboard, including orders, menu items, inventory, employees, customers, reservations, reports, and restaurant settings.

The project follows a feature-based architecture with a dedicated service layer, React Query for data fetching, and Supabase for authentication and database management.

---

## Live Demo

🔗 https://sofra-os.netlify.app/

---

## Features

* Dashboard with business metrics
* Order management
* Menu and category management
* Inventory management
* Customer management
* Employee management
* Table and reservation management
* Kitchen display system
* Reports and analytics
* Restaurant settings
* English and Arabic support (RTL)
* Secure authentication with Supabase
* Role-based access control

---

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* shadcn/ui
* Radix UI

### Backend

* Supabase
* PostgreSQL
* Supabase Auth
* Row Level Security (RLS)

### Libraries

* TanStack React Query
* React Hook Form
* Zod
* next-intl

---

## Project Structure

```text
app/
components/
config/
features/
lib/
providers/
services/
types/
```

---

## Getting Started

Install dependencies:

```bash
pnpm install
```

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Run the production server:

```bash
pnpm start
```

---

## Demo Accounts

The application includes accounts to test it.

| Role              | Email                                             | Password     |
| ----------------- | ------------------------------------------------- | ------------ |
| Owner             | [owner@sofra.com](mailto:owner@sofra.com)         | Admin@123456 |


---


## Screenshots

You can add screenshots of the Dashboard, Orders, Menu, Inventory, Kitchen, Reports, and Settings here.

---

## License

This project is available for educational and portfolio purposes.
