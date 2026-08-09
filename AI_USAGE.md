# AI Usage Documentation

## Overview

I used AI tools during the project for coding, debugging, learning, and reviewing ideas. I did not accept AI suggestions automatically. I checked each suggestion and decided if it was correct for my project.

## AI Tools I Used

### 1. Kiro AI Agent

I used Kiro mainly for:
- Fixing bugs
- Improving existing code
- Helping with TypeScript issues

For example, I had a TypeScript problem with Supabase error handling. Kiro suggested changing a ternary expression to an if/else structure. I checked the solution, understood why it fixed the type narrowing problem, and accepted it.

### 2. OpenAI GPT-4o-mini

OpenAI is the main AI inside the application.

I use it to:
- Analyze product requests
- Find missing information
- Find contradictions
- Create follow-up questions
- Generate Product Briefs

I use structured JSON responses and validate them with Zod before showing the data to the user.

### 3. ChatGPT / Claude

I used ChatGPT and Claude mainly for learning and technical questions.

For example:
- Understanding PostgreSQL and JSONB
- Improving SQL queries
- Discussing different implementation approaches

## AI Result I Rejected

One important example was a GitHub Copilot suggestion about database migrations.

**Copilot suggested:** Creating a new migration file instead of changing the initial migration.

**I rejected the suggestion** because this is a practical assignment with a fresh database. The database is created from the beginning, so changing the initial migration is simpler and easier to review.

For a real production system with existing data, I would use a new migration instead.

This shows that I considered the project context instead of blindly accepting AI suggestions.

## AI Result I Accepted

Another example was handling JSONB data from the database.

**Copilot suggested:** Checking if the data is an array before using `.map()`.

**I accepted this suggestion** because database data can be null or have an unexpected format. This prevents runtime errors and makes the application more reliable.

## How I Checked AI Suggestions

Before using an AI suggestion, I asked myself:
- Does it solve the real problem?
- Is it correct for this project?
- Does it make the code simpler or safer?
- Can I explain why I used it?

If I could not explain the suggestion, I did not use it.

## My Approach to AI

I used AI as a development assistant, not as a replacement for my decisions.

**AI helped me work faster with:**
- Boilerplate code
- Debugging
- Learning new technologies
- Code improvements
- Exploring solutions

**But I was responsible for the final:**
- Architecture
- Security
- Code quality
- Implementation
- Testing
- Technical decisions

I reviewed and tested the AI-generated code before committing it.

## Git and Security

I documented my work through branches, commits, and pull requests, so the development process and my decisions can be followed step by step.

I also did not commit any secret keys or passwords to GitHub. API keys are stored in `.env` and are not exposed in the repository.

## Conclusion

Overall, AI helped me develop the project faster, but I always reviewed the results and made the final decisions myself.
