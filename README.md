# TinyLink - URL Shortener

A full-stack URL shortener application built with Next.js, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Create Short Links**: Shorten any URL with optional custom codes
- **Redirect**: Automatic 302 redirects with click tracking
- **Dashboard**: View all links with search and sorting
- **Statistics**: Detailed stats for each short link
- **Delete Links**: Remove links with proper 404 handling
- **Health Check**: System health endpoint

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd url_shortner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Health Check
- `GET /api/healthz` - Returns system health status

### Links
- `GET /api/links` - List all links
- `POST /api/links` - Create a new link
  - Body: `{ originalUrl: string, code?: string }`
  - Returns 409 if code already exists
- `GET /api/links/:code` - Get link stats
- `DELETE /api/links/:code` - Delete a link

## Routes

- `/` - Dashboard (list, add, delete links)
- `/:code` - Redirect to original URL (302)
- `/code/:code` - Stats page for a link
- `/healthz` - Health check endpoint

## Code Validation

Custom codes must match the pattern: `[A-Za-z0-9]{6,8}` (6-8 alphanumeric characters)

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The app will automatically build and deploy.

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
- `NEXT_PUBLIC_BASE_URL` - Base URL for short links (required)
- `NEXT_PUBLIC_APP_URL` - Full app URL (optional)

## License

ISC

