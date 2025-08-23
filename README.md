# SvelteKit E-Commerce Application

This is a monorepo for a simple e-commerce platform built with **SvelteKit** for the frontend and **Hono** for the backend API. The project demonstrates modern web development practices, including RESTful APIs, authentication, and responsive design.

## Apps Structure

- **Frontend** ([apps/Frontend](apps/Frontend)):  
  Built with SvelteKit, provides the user interface for browsing products, managing the cart, placing orders, and viewing reviews. Uses Tailwind CSS for styling and supports environment configuration via `.env`.

- **Backend** ([apps/backend](apps/backend)):  
  Powered by Hono (a lightweight Node.js web framework), exposes REST APIs for products, orders, and reviews. Integrates with Prisma for database management and supports CORS and static file serving.

## Features

- Dynamic product listings with ratings and reviews
- Secure login and token-based authentication
- Order tracking with status progress
- Toast notifications for user feedback
- Mobile and desktop responsive design
- Environment configuration via `.env` files

## Tech Stack

- **Frontend:** SvelteKit, Tailwind CSS
- **Backend:** Hono, Prisma
- **API:** RESTful endpoints for products, orders, reviews

## Getting Started

### Prerequisites

- Node.js v16+
- pnpm (recommended), npm, or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-repo/sveltekit-ecommerce.git
   cd sveltekit-ecommerce
   ```

2. Install dependencies for all apps:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Create `.env` files in both `apps/Frontend` and `apps/backend` as needed.
   - Example for frontend:
     ```
     VITE_API_BASE_URL=http://localhost:3000/api
     ```
   - Example for backend:
     ```
     PORT=3000
     ORIGIN=http://localhost:5173
     ```

4. Run the backend:

   ```bash
   pnpm --filter backend dev
   ```

5. Run the frontend:

   ```bash
   pnpm --filter Frontend dev
   ```

6. Open your browser at [http://localhost:5173](http://localhost:5173).

## Acknowledgements

- [SvelteKit](https://kit.svelte.dev/)
- [Hono](https://hono.dev/)
- [Prisma](https://www.prisma.io/)
