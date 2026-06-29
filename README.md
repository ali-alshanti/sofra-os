# Sofra OS

Sofra OS is a restaurant management system built with Next.js and Supabase. The application helps manage daily restaurant operations through a single dashboard, including orders, menu items, inventory, employees, customers, reservations, reports, and restaurant settings.

The project follows a feature-based architecture with a dedicated service layer, React Query for data fetching, and Supabase for authentication and database management.

---

## Features

- Dashboard with business metrics
- Order management
- Menu and category management
- Inventory management
- Customer management
- Employee management
- Table and reservation management
- Kitchen display system
- Reports and analytics
- Restaurant settings
- English and Arabic support (RTL)
- Secure authentication with Supabase

---

## Tech Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- Radix UI

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)

### Libraries

- TanStack React Query
- React Hook Form
- Zod
- next-intl

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

## Demo Account

A demo account is available for testing.

```text
Email: admin@sofra.com
Password: Admin@123456
```

---

## Screenshots

You can add screenshots of the dashboard, orders, menu, inventory, reports, and settings here.

---

## License

This project is available for educational and portfolio purposes.
