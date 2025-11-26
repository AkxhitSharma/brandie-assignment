# Social Media Backend (Express + TypeScript + PostgreSQL)

A minimal social-media style backend fulfilling the assignment: auth, user follow graph, posting, and timeline.

## Tech
- Node 18+, Express, TypeScript
- PostgreSQL with `pg`
- JWT auth, input validation with Zod

## Setup
1. Copy `.env.example` to `.env` and update values.
2. Install deps:
```
npm install
```
3. Create database and run migration:
```
createdb social_backend   # or use your preferred way
npm run db:setup
```
4. Start dev server:
```
npm run dev
```

## API Overview
Base URL: `/api`

- Auth
  - POST `/auth/register` { username, email, password }
  - POST `/auth/login` { usernameOrEmail, password }

- Users
  - POST `/users/:id/follow` (auth)
  - DELETE `/users/:id/follow` (auth)
  - GET `/users/:id/followers`
  - GET `/users/:id/following`

- Posts
  - POST `/posts` (auth) { text, mediaUrl? }
  - GET `/posts/user/:id?limit=20&cursor=ISO`
  - GET `/posts/feed/me?limit=20&cursor=ISO` (auth)

Pagination uses `cursor` = last `created_at` ISO from previous page.

## Test Cases (manual plan)
- Register, then login returns JWT
- Cannot register with duplicate username/email
- Auth required endpoints reject missing/invalid tokens
- Follow/unfollow flows, self-follow rejected
- Followers/following lists reflect graph
- Create post with/without media
- User posts: newest first, paginated by cursor
- Feed shows self + followed users only, paginated

## Notes / Assumptions
- Media handled as external URL; uploading/binary storage is out of scope.
- Simple error handling; extend as needed. Add indexes provided in migration for performance.
- Add Docker and e2e tests if desired.
