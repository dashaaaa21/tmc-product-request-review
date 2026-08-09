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
We need 1000 premium metal pens with engraved company logo. High-quality stainless steel construction with luxury gift box packaging. Also, they should be cheap plastic pens. Budget: €2 per pen including packaging.


**Expected result:**
- Material: “premium metal” vs. “cheap plastic”
- Quality: “high-quality stainless steel” vs. “cheap”
- Budget: €2 per pen vs. luxury metal pens (typically €15–30 per pen)

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
