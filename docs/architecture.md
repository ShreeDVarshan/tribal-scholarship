# JANJATHI SHIKSHA SETU — System Architecture

**Tagline**: *"One Platform. One Profile. One Right."*

A sovereign public-service digital infrastructure unifying five Ministry of Tribal Affairs scholarship and fellowship schemes into a cohesive, dignified student lifecycle.

---

## 1. High-Level Architectural Topology

```
+-----------------------------------------------------------------------------------+
|                              CLIENT CHANNELS                                      |
|                                                                                   |
|   +------------------------------------+    +---------------------------------+   |
|   |         JANJATHI SETU              |    |       MISSION CONTROL           |   |
|   |   Student Mobile Application       |    |       Admin Web Portal          |   |
|   |  (React Native / Expo / TS)        |    |   (React / Vite / Tailwind)     |   |
|   +-----------------+------------------+    +----------------+----------------+   |
+---------------------|----------------------------------------|--------------------+
                      | HTTPS / REST                           | HTTPS / REST
                      v                                        v
+-----------------------------------------------------------------------------------+
|                        API GATEWAY & FASTIFY BACKEND                              |
|                                                                                   |
|  +--------------------+  +--------------------+  +--------------------+           |
|  | JWT / Auth Guard   |  | Zod Validation     |  | Rate Limiting      |           |
|  +--------------------+  +--------------------+  +--------------------+           |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  |                             CORE SERVICES                                   |  |
|  |  * AuthService             * ProfileService        * DocumentService        |  |
|  |  * ApplicationService      * PaymentService        * NotificationService    |  |
|  |  * EligibilityEngine       * AdminService          * JAGO Guidance Engine   |  |
|  +-----------------------------------------------------------------------------+  |
+---------------------+---------------------------------+---------------------------+
                      |                                 |
                      v                                 v
+-------------------------------+             +-------------------------------------+
|        DATABASE LAYER         |             |     UNIFIED VERIFICATION RAIL       |
|  * SQLite (Local Development) |             |     (MOCK INTEGRATION ADAPTERS)     |
|  * PostgreSQL (Production)    |             |                                     |
|  * Prisma ORM Data Access     |             |  * DigiLocker Demo    * UIDAI Demo  |
|                               |             |  * APAAR Demo         * UDISE+ Demo |
|                               |             |  * e-District Demo    * UGC Demo    |
+-------------------------------+             |  * NSP / SFMP / NOS Connectors      |
                                              +-------------------------------------+
```

---

## 2. Core Modules & Innovations

### A. "One Profile" Sovereign Credential Wallet
Rather than requesting repeated submissions across NSP, SFMP, and National Overseas portals, verified credentials (ST certificate, Income certificate, marksheet, bank mandate) are cryptographically matched once and automatically reused across eligible schemes.

### B. Rule-Based Central Eligibility Engine
A deterministic, rule-based service (`src/eligibility/engine.ts`) cross-evaluates academic level, family income ceiling, institution type, and research status to evaluate entitlements transparently before application submission.

### C. JAGO Context-Aware AI Guidance
JAGO acts as a conversational guide. It combines rule-based fallback intent classification with optional LLM integration (Gemini / OpenRouter) while maintaining government service guardrails: it never hallucinates decisions and always references real application state.

### D. Proactive Coverage Gap Identification
Identifies potentially eligible ST students by correlating simulated school and university enrolment records (UDISE+ / APAAR) against existing scholarship registries to enable proactive field outreach.
