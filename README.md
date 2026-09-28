# JANJATHI SHIKSHA SETU (जनजाति शिक्षा सेतु)
> **"One Platform. One Profile. One Right."**

[![Prototype Status](https://img.shields.io/badge/Prototype-Functional-emerald.svg)]()
[![Stack](https://img.shields.io/badge/Stack-Node%20%7C%20Fastify%20%7C%20React%20Native%20%7C%20Expo-blue.svg)]()
[![Target](https://img.shields.io/badge/Audience-Scheduled%20Tribe%20(ST)%20Students-orange.svg)]()

A full-stack, mobile-first unified scholarship management infrastructure designed for the Ministry of Tribal Affairs (MoTA), bringing five major scholarship and fellowship schemes into a single sovereign student experience.

---

## 🏛️ Schemes Unified

1. **Pre-Matric Scholarship for ST Students** (Classes IX & X)
2. **Post-Matric Scholarship for ST Students** (Classes XI, XII, UG, PG, Professional)
3. **National Scholarship for Higher Education / Top Class Education for ST Students** (IITs, NITs, AIIMS, Central Universities)
4. **National Fellowship for ST Students (NFST)** (M.Phil. & Ph.D. scholars)
5. **National Overseas Scholarship for ST Students (NOS)** (Masters & Ph.D. abroad)

---

## 🚀 Key Innovations

- **One Profile Sovereign Wallet**: Upload and verify documents once (via mock e-District, DigiLocker, APAAR, UIDAI); automatically reuse them across all schemes without redundant submissions.
- **Rule-Based Central Eligibility Engine**: Transparent, preliminary assessment without official ambiguity.
- **Granular 8-Stage Timeline**: Clear visibility into every phase (`Submitted ➔ UIDAI ➔ Documents ➔ Institution ➔ Department ➔ Sanction ➔ DBT ➔ Disbursed`).
- **JAGO AI Assistant**: Grounded in real student context, never hallucinates decisions, and translates complex administrative terms into simple guidance.
- **Family Scholarship Overview**: Household-level transparency for families with siblings across school and higher education schemes.
- **Proactive Coverage Gap Detection**: Administrative cross-matching of mock UDISE+ and APAAR registries to identify unreached ST beneficiaries.

---

## 📁 Repository Structure

```
janjathi-shiksha-setu/
├── apps/
│   ├── mobile/         # React Native + Expo student application (32 screens)
│   └── admin/          # React + Vite + Tailwind Mission Control portal
├── services/
│   └── api/            # Fastify + TypeScript + Prisma REST API
├── packages/
│   └── shared/         # Shared interfaces, types, and schemas
├── docs/
│   ├── architecture.md # System architecture documentation
│   └── demo-flow.md    # Primary demonstration & evaluation script
├── .env.example        # Environment configuration template
└── README.md
```

---

## 🛠️ Quick Start & Setup

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### 1. Backend API & Database
```bash
cd services/api
npm install
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```
*API will be running at `http://localhost:5000` (Swagger docs available at `http://localhost:5000/docs`).*

### 2. Admin Mission Control Portal
```bash
cd apps/admin
npm install
npm run dev
```
*Admin Dashboard will be running at `http://localhost:5173`.*

### 3. Student Mobile Application
```bash
cd apps/mobile
npm install
npx expo start
```
*Press `w` to open in web browser or scan QR code via Expo Go / Android development build.*

---

## 🔑 Demo Credentials

| Role | Identifier / Mobile | Credential / OTP | Persona |
| :--- | :--- | :--- | :--- |
| **Student** | `9999999999` | `123456` (Demo OTP) | Arjun Kumar (ST Student, Tamil Nadu) |
| **Admin** | `9876543210` | `Admin@Demo2024` | Shri R. K. Soren (Director, MoTA) |

---

## ⚖️ Public Service Disclaimers

- All external government integrations (DigiLocker, UIDAI, APAAR, UDISE+, e-District, PFMS) in this prototype use mock integration adapters (`src/services/verification.service.ts`) clearly identified with a **Demo Integration** badge.
- JAGO operates under strict public service guardrails: it provides informational guidance and does not make binding administrative decisions.
