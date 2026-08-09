# Setup Instructions

For testing purposes, two demo accounts are available:

**Account 1:**
- Email: `alice@tmc.nl`
- Password: _(provided separately for security)_

**Account 2:**
- Email: `bob@tmc.nl`  
- Password: _(provided separately for security)_

> **Note:** As a security best practice, demo passwords are not stored in the repository. They will be provided to reviewers through a secure channel.

## Important Notes

- These credentials are for **demonstration purposes only**
- Each user can only see their own requests (RLS enforced)
- Do not use these credentials in production
- For production, users should be created through proper authentication flow

## Environment Setup

1. Copy `.env.example` to `.env.local`
2. Add your Supabase credentials
3. Add your OpenAI API key
4. Run migrations: see `supabase/migrations/`

## Running the Application

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` and use the demo credentials provided.
