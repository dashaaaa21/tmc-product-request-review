# TMC Product Request Review

Built an internal website for reviewing product requests. A TMC employee can log in, submit a merchandise request, review what is clear or missing, and save a Product Brief.

##  Live Demo

[https://tmc-product-request-review-efo6zkccs-dashas-projects-fa234119.vercel.app](https://tmc-product-request-review-bu8k-5i6d21tvx.vercel.app/login)

**Test accounts:**
- `alice@tmc.nl` / - Password: _(provided separately for security)_
- `bob@tmc.nl` / - Password: _(provided separately for security)_

## Quick Start

1. **Clone and install**
```bash
git clone https://github.com/dashaaaa21/tmc-product-request-review.git
cd tmc-product-request-review
npm install
```

2. **Configure environment**
```bash
cp .env.example .env.local
```
Add your Supabase and OpenAI keys to `.env.local`

3. **Run locally**
```bash
npm run dev
```

Open http://localhost:3000 and login with demo account

## How to Test

1. Create a new request describing a product you need
2. Click "Analyze" to get AI analysis
3. Click "Generate Brief" to create procurement brief
4. Check History to see all your requests

## Tests

```bash
npm test
```

## Built With

Next.js 15, TypeScript, Supabase, OpenAI GPT-4, Tailwind CSS
