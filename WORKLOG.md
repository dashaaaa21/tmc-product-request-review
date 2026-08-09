# Work Log

## Problem
TMC employees submit vague merchandise requests. Reviewers manually identify missing information, leading to delays and errors.

## Solution
Web application that uses AI to analyze requests, identify gaps, and generate structured procurement briefs.

---

## Plan

### Phase 1: Core Features
- Authentication with Supabase Auth
- Request CRUD operations
- AI analysis (OpenAI GPT-4o-mini)
- Brief generation
- Request history

### Phase 2: Security & Quality
- Row Level Security (RLS)
- Rate limiting
- Input validation (Zod)
- Error handling
- Unit tests

### Phase 3: Deployment
- Environment configuration
- Vercel deployment
- Documentation

---

## Key Assumptions

1. **Internal tool only** - No public sign-up needed
2. **Demo accounts sufficient** - alice@tmc.nl and bob@tmc.nl for testing
3. **OpenAI is acceptable** - Appropriate for internal tool with test data
4. **Single page per feature** - Simplified UX over complex workflows
5. **In-memory rate limiting** - No Redis needed for assignment scope

---

## Technical Decisions

### Architecture
**Decision:** Next.js 15 + TypeScript  
**Reasoning:** Full-stack framework, type safety, API routes built-in

### Database
**Decision:** Supabase (PostgreSQL)  
**Reasoning:** Auth + database + RLS in one platform, excellent TypeScript SDK

### AI
**Decision:** OpenAI GPT-4o-mini with JSON mode  
**Reasoning:** Reliable structured outputs, fast, cost-effective

### Validation
**Decision:** Zod for all inputs and AI responses  
**Reasoning:** Runtime validation, type inference, prevents invalid data

### UI
**Decision:** shadcn/ui + Tailwind CSS  
**Reasoning:** Copy-paste components (no framework lock-in), accessible by default

---

## Important Changes During Development

### 1. Split Review and Brief Pages
**Original Plan:** Single page for both analysis and brief  
**Changed To:** Separate pages  
**Reason:** Clearer user flow, less cognitive load

### 2. Lazy OpenAI Initialization
**Problem:** Build failed with "Missing credentials" error  
**Solution:** Changed from module-level to function-level initialization  
**Impact:** Vercel deployment successful

### 3. Duplicate Brief Prevention
**Problem:** Users could accidentally generate brief twice  
**Solution:** Check existing brief, return 409 Conflict  
**Impact:** Prevents wasted API calls, clearer UX

---

## Security Implementation

### Two-Layer Authorization
1. **Middleware:** Fast rejection at request level
2. **RLS Policies:** Database-level enforcement (real security boundary)

### Rate Limiting
- AI endpoints: 10 requests / 10 minutes per user
- Regular endpoints: 100 requests / 10 minutes

### Ownership Verification
Every API route verifies user owns the requested resource

### Input Validation
- Frontend validation (basic checks)
- API route validation (Zod schemas)
- AI response validation (Zod + custom rules)
- Database constraints (final safety net)

---

## AI Response Validation

OpenAI responses validated with strict rules:
- Character length: 5-500 per item
- No duplicates (Set-based detection)
- Questions must end with "?"
- Word count minimums for summaries
- Array size limits (max 50 items)

**If validation fails:** User gets clear error, can retry

---

## Test Examples

### Complete Request
```
Title: Branded Polo Shirts for Summer Event
Description: 150 navy blue polo shirts, TMC logo embroidered (5cm), 
sizes: 30 S, 60 M, 50 L, 10 XL. 100% cotton. €15/shirt. 
Delivery by July 1st to Amsterdam.
```
**Result:** Few questions, mostly confirmation

### Incomplete Request
```
Title: Office Supplies
Description: We need some pens and notebooks.
```
**Result:** Many missing details, lots of questions

### Contradictory Request
```
Title: Laptop Purchase
Description: 10 high-performance laptops (32GB RAM, i9, 1TB SSD, GPU). 
Budget: €500 each. Delivery: tomorrow.
```
**Result:** Contradictions identified (budget vs specs, timeline unrealistic)

---

## Known Limitations

### Not Implemented
- Sign-up / password reset
- Admin dashboard
- File attachments
- Email notifications
- Real-time updates
- E2E tests
- Performance monitoring

### Why
Assignment focused on core functionality over edge cases

### If I Had More Time
**Week 1:** E2E tests, error monitoring, accessibility audit  
**Week 2:** Real-time updates, email notifications, admin panel  
**Week 3:** File attachments, templates, export functionality

---

## Project Structure

```
app/
├── (auth)/login/         - Authentication
├── (dashboard)/          - Protected pages
│   ├── dashboard/        - Overview
│   ├── history/          - Request history
│   └── requests/[id]/    - Request details, review, brief
└── api/                  - API routes (analyze, brief, CRUD)

lib/
├── services/             - Business logic (analysis, brief, requests)
├── validations/          - Zod schemas
├── errors/               - Error handling
├── middleware/           - Rate limiting, ownership checks
└── prompts/              - AI prompt templates

__tests__/                - Unit tests (20 tests, 100% pass)
```

---

## Git Workflow

- Feature branch for each change
- Descriptive commit messages
- Pull requests with descriptions
- Clean history (no force pushes to main)

**Branches:**
- `feat/improve-api-security` - Rate limiting, ownership verification
- `feat/validate-ai-responses` - Zod validation for AI
- `test/add-backend-tests` - Unit tests
- `fix/security-improvements` - Password removal, duplicate prevention
- `docs/add-readme` - Documentation

---

## Deployment

**Platform:** Vercel  
**Build Time:** ~10 seconds  
**Environment Variables:** Configured in Vercel Dashboard  
**Status:** Deployed successfully

**Challenges Solved:**
1. OpenAI initialization during build → Lazy loading
2. Missing environment variables → Validation + fallbacks
3. Invalid API key → Updated in Vercel

---

## Results

-  Functional AI-powered request analysis
-  Structured brief generation
-  Secure multi-user system (RLS)
-  Rate limiting and error handling
-  20 unit tests passing
-  Deployed to production
-  Clean code with documentation

