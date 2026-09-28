# JANJATHI SHIKSHA SETU — Primary Demonstration Flow

> **"One Platform. One Profile. One Right."**

This document describes the end-to-end evaluation flow for judges, officials, and examiners evaluating the **Janjathi Shiksha Setu** prototype.

---

## 1. Student Mobile Experience (Primary Journey)

### Step 1: Launch & Splash
- Open **Janjathi Setu**.
- Observe the splash screen and tagline *"One Platform. One Profile. One Right."*

### Step 2: Authentication (Demo Mode)
- **Mobile**: `9999999999`
- **Demo OTP**: `123456`
- Notice that the app clearly labels Demo Mode with pre-filled credentials for **Arjun Kumar** (ST Student, Coimbatore, Tamil Nadu).

### Step 3: Sovereign Student Home
- View Arjun's profile completion (**92%**) and Application Readiness Index (**88%**).
- Note the signature **Horizontal Journey Bar**:
  `PROFILE (✓) ➔ ELIGIBILITY (✓) ➔ APPLICATION (✓) ➔ VERIFY (●) ➔ BENEFIT (○)`
- See the **Active Application** card: *Post-Matric Scholarship for ST Students* under *Department Verification*.
- View the **Action Required** card alerting that Arjun's income certificate requires renewal in 48 days.
- View the **Opportunity Alert**: *Top Class Higher Education Scheme*.
- View the **Recent DBT Transaction**: `₹42,000` credited to SBI account `****4521`.

### Step 4: Scholarships Discovery & Eligibility Engine
- Tap **Scholarships** in bottom navigation to see the 5 unified Ministry of Tribal Affairs schemes:
  1. Pre-Matric Scholarship for ST Students
  2. Post-Matric Scholarship for ST Students
  3. Top Class Education Scheme for ST Students
  4. National Fellowship for ST Students (NFST)
  5. National Overseas Scholarship (NOS)
- Tap **"Find Scholarships For Me"**.
- Change parameters or keep defaults and run the evaluation:
  - Post-Matric status shows **"Likely Eligible"** with 4 verified criteria matches.
  - Top Class status shows **"Potential Opportunity"**.
  - NFST and NOS clearly show prerequisite criteria (e.g. M.Phil/Ph.D or Overseas admission).

### Step 5: The "One-Click" Application Experience
- Tap **"Proceed with One-Click Application"**.
- **Step 1 (Profile)**: Review pre-populated verified attributes.
- **Step 2 (Auto-Reuse)**: Witness the key innovation — **5 verified documents** (ST Certificate, Income Certificate, Marksheet, Aadhaar, Bank Mandate) are automatically bundled without asking the student to scan or re-upload.
- **Step 3 (Declaration)**: Confirm statutory undertaking.
- **Step 4 (Submission)**: Instant lodgement with reference `APP-2024-91823`.

### Step 6: 8-Stage Visual Application Timeline
- Navigate to **Applications** ➔ select `APP-2024-91823`.
- Inspect the granular 8-stage timeline:
  - `✓ Application Submitted`
  - `✓ UIDAI Identity Match`
  - `✓ Document Cross-Verification`
  - `✓ Institution Verification (Cleared by Govt Arts College)`
  - `● Department Scrutiny (Active Stage)`
  - `○ Sanction Order`
  - `○ DBT Disbursement`

### Step 7: JAGO AI Assistant
- Tap the floating **JAGO** button.
- Notice the government disclaimer banner.
- Select or type:
  - *"Why is my application pending?"* ➔ JAGO pulls the real application state and explains that institution verification was cleared on 4 Aug and the file is currently under final scrutiny at the Coimbatore District Office.
  - *"What documents are missing?"* ➔ JAGO explains that 5 documents are verified, Domicile is pending, and Income certificate expires soon.
  - *"When was my last scholarship payment?"* ➔ JAGO cites the exact `₹42,000` DBT transaction.

### Step 8: Multi-Beneficiary Family View
- Go to **Profile** ➔ **Family Scholarship Overview**.
- See household transparency:
  - **Arjun Kumar** (College): Active Post-Matric
  - **Priya Kumar** (Sister, Class 10): Disbursed Pre-Matric (`₹3,500`)
  - **Ravi Kumar** (Brother, Class 9): Flagged as an unclaimed entitlement gap.

---

## 2. Administrator & Mission Control Portal

### Step 1: Admin Sign In
- Open the Admin Web App (`http://localhost:5173`).
- Use Demo Admin credentials:
  - **Mobile**: `9876543210`
  - **Password**: `Admin@Demo2024`

### Step 2: Consolidated Mission Control Dashboard
- Review national ST scholarship health:
  - Total registered students, ST certification match rate, and total DBT disbursed.
  - Scheme distribution bar charts across all 5 schemes.
  - State beneficiary distribution.

### Step 3: Proactive Coverage Gap Identification
- Click **Coverage Gap** in the sidebar.
- Inspect mock cross-matched data from UDISE+ and APAAR.
- Identify unreached ST students who have not applied.
- Click **"Flag for Outreach"** on a student (e.g., in Karbi Anglong, Assam or Koraput, Odisha) to dispatch targeted field support.

### Step 4: Verification Exception Queue
- Click **Verification Queue**.
- Inspect documents requiring manual officer intervention.
- Click **"Approve Override"** to clear exceptions without canceling or penalizing the student.
