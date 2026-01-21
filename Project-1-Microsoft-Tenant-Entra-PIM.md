## Projects / Labs

# Project 1: Microsoft 365 Tenant Setup & Entra PIM Implementation

## Objective
To set up a Microsoft 365 tenant using a custom domain and correctly implement Privileged Identity Management (PIM) by following least-privilege principles.

This lab documents real-world issues encountered during tenant setup and how they were resolved.

---

## Background / Context
I purchased a custom domain through GoDaddy and initially made the mistake of also purchasing a Microsoft 365 Essentials license through GoDaddy. I did not realise at the time that this would prevent me from managing my own Microsoft 365 tenant directly.

This resulted in limited control over tenant configuration and role management.

---

## What I Did

### 1. Domain & Tenant Setup
- Purchased a domain through GoDaddy.
- Purchased a Microsoft 365 Essentials licence via GoDaddy (mistake).
- Discovered that this prevented direct tenant configuration with Microsoft directly.
- Contacted GoDaddy support and requested the domain be **released**.
- Successfully joined the domain directly to Microsoft 365 and managed the tenant through Microsoft.

---

### 2. Licensing & User Creation
- Purchased:
  - Microsoft 365 Business Premium
  - Microsoft Defender for Endpoint P2
- Created multiple user accounts:
  - Several test users
  - One primary user account for myself
- Assigned my primary account **Global Administrator** permissions via the Microsoft 365 Admin Centre to allow tenant configuration.

---

### 3. PIM Implementation Issues
- Attempted to configure Privileged Identity Management (PIM) the following day.
- Encountered repeated failures stating that I already had **24/7 Global Administrator permissions**.
- Initially found this confusing, as PIM was enabled but role activation was blocked.

---

### 4. Root Cause Identified
- Realised the issue was caused by assigning **permanent Global Administrator** rights to my account via the Admin Centre.
- Understood that for PIM to function correctly:
  - The user must be a **standard user**
  - Privileged roles must be **eligible**, not permanently assigned

---

### 5. Resolution
- Created a second user account.
- Left the second account as a **standard user** in the Microsoft 365 Admin Centre.
- Assigned **Global Administrator** to the second account **via PIM** in Microsoft Entra.
- Signed in as the second account and elevated permissions through PIM.
- Used this elevated access to:
  - Remove Global Administrator rights from my primary account
  - Convert my primary account back to a standard user
- Successfully configured PIM for my primary account.
- Verified that I could now elevate to Global Administrator **only when required**.

---

## Outcome
- PIM successfully implemented.
- Primary account now operates on a least-privilege basis.
- Global Administrator access is only granted via time-bound elevation.

---

## Lessons Learned
- Purchasing Microsoft 365 licences through third-party providers can significantly limit tenant control.
- PIM cannot be implemented correctly if an account has permanent Global Administrator rights.
- Always maintain a secondary admin account to prevent lockout scenarios.
- Understanding role assignment paths (Admin Centre vs Entra vs PIM) is critical.
- Real-world mistakes are often the best learning experiences.

---

## Next Improvements
- Create a break-glass emergency access account.
- Configure MFA as a CA policy
- Enable logging and alerting for role activation events.
