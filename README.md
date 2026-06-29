# Sofra OS

A modern restaurant operations platform built to centralize daily restaurant management into a single, scalable web application. Sofra OS provides tools for managing orders, menus, inventory, employees, customers, reservations, analytics, and restaurant settings through a unified dashboard.

The project follows a feature-based architecture with a service layer, typed database access, and a scalable frontend structure suitable for production-grade applications.

---

## Overview

Sofra OS streamlines restaurant operations by bringing together the most common management workflows into one platform.

The application includes:

- Dashboard & Business Analytics
- Order Management
- Menu Management
- Inventory & Stock Control
- Customer Management
- Employee Management
- Tables & Reservations
- Kitchen Display System (KDS)
- Reports & Analytics
- Restaurant Settings
- Authentication & Authorization
- Multi-language Support (English & Arabic)

---

## Key Features

### Dashboard

- Business performance overview
- Revenue analytics
- Popular menu items
- Inventory alerts
- Restaurant KPIs

### Orders

- Order lifecycle management
- Status tracking
- Search & filtering
- Pagination
- Customer assignment

### Menu

- Categories
- Menu items
- Availability management
- Soft delete
- Search & filtering

### Inventory

- Inventory items
- Categories
- Suppliers
- Low-stock monitoring
- Purchase tracking

### Customers

- Customer profiles
- Loyalty management
- Search
- Filtering
- Activity overview

### Employees

- Employee management
- Shift tracking
- Attendance monitoring
- Status management

### Tables & Reservations

- Floor management
- Reservations
- Table availability
- Occupancy tracking

### Kitchen Display System

- Kitchen queue
- Order workflow
- Preparation status
- Live updates

### Reports

- Revenue reports
- Sales analytics
- Customer analytics
- Employee analytics
- Inventory analytics

### Settings

- Restaurant configuration
- Business hours
- Tax & currency
- Notifications
- Integrations

---

# Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Radix UI

### Backend

- Supabase
- PostgreSQL
- Supabase Auth
- Row Level Security (RLS)
- Supabase Storage

### Data Management

- TanStack React Query
- Feature-based Service Layer

### Validation

- Zod
- React Hook Form

### Internationalization

- next-intl
- English & Arabic
- RTL Support

---

# Architecture

The application follows a modular feature-based architecture where every feature is isolated into its own module.

```text
UI
    │
    ▼
React Query Hooks
    │
    ▼
Service Layer
    │
    ▼
Supabase
```

Each feature is responsible for its own:

- Components
- Types
- Business Logic
- Data Fetching
- Service Layer

This structure improves scalability, maintainability, and long-term project organization.

---

# Project Structure

```text
app/
components/
config/
features/
lib/
providers/
public/
services/
types/
```

---

# Internationalization

The platform supports multilingual user interfaces.

Currently supported:

- English
- Arabic (RTL)

The localization system is built using feature-based translation namespaces, allowing additional languages to be added without changing application code.

---

# Security

The application includes:

- Supabase Authentication
- Protected Routes
- Session Persistence
- Row Level Security (RLS)
- Multi-tenant Data Isolation
- Typed Database Access

---

# Getting Started

Clone the repository:

```bash
git clone <repository-url>
cd sofra-os
```

Install dependencies:

```bash
pnpm install
```

Create a local environment file:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run the development server:

```bash
pnpm dev
```

Create a production build:

```bash
pnpm build
```

Start the production server:

```bash
pnpm start
```

---

# Development Principles

The project follows several engineering principles:

- Feature-Based Architecture
- Modular Design
- Separation of Concerns
- Reusable Components
- Type Safety
- Clean Code
- Scalable Folder Structure
- Optimistic UI Updates
- Server-side Security
- Production-oriented Architecture

---

# License

This repository is provided for educational, demonstration, and portfolio purposes.
