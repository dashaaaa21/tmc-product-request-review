# Testing

## 1. Complete Request

**Input:**
150 navy blue polo shirts with TMC logo, sizes S–XL,
100% cotton, €15 per shirt, delivery to Amsterdam by July 1.

**Expected result:**
- Most information is clear
- Few missing details
- No contradictions
- Few follow-up questions

**Result:** Passed 

---

## 2. Incomplete Request

**Input:**
We need some pens and notebooks.

**Expected result:**
- Missing quantity
- Missing colors
- Missing specifications
- Missing budget
- Missing delivery date
- Follow-up questions are generated

**Result:** Passed 

---

## 3. Contradictory Request

**Input:**
10 high-performance laptops with 32GB RAM, i9 CPU and 1TB SSD.
Budget: €500 per laptop. Delivery: tomorrow.

**Expected result:**
- Requirements are identified
- Budget/specification contradiction is detected
- Unrealistic delivery time is highlighted
- Follow-up questions are generated

**Result:** Passed 

---

## 4. Protected Access

**Steps:**
1. Open `/dashboard` without logging in.
2. Try to open a protected request page.

**Expected result:**
- User cannot access protected pages.
- User is redirected to the Login page.

**Result:** Passed 