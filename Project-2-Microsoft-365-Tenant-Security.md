# Project 2: Microsoft 365 Tenant Security 

## Objective
Build a secure Microsoft 365 tenant environment, implement Conditional Access (CA) and Multi-Factor Authentication (MFA) policies

This lab documents hands-on experience configuring tenant security, troubleshooting real-world issues, and understanding authentication flows and policy interactions in a Microsoft 365 environment.

---

## Background / Context
While configuring MFA via a Conditional Access policy, I encountered issues that could have completely locked me out of my tenant. This highlighted the importance of having a **break-glass admin account** and gave me practical experience in troubleshooting authentication conflicts and understanding policy precedence in Azure AD.

---

## What I Did

### 1️⃣ Break-Glass Admin Account
- Created an **emergency global admin account** to prevent tenant lockouts.  

- I had already enabled MFA when initially setting up my Microsoft 365 tenant, but it **slipped my mind**. When I created a **Conditional Access policy for MFA**, I ended up duplicating the setup, which caused multiple conflicting prompts:
  - I was repeatedly asked to **re-register the Microsoft Authenticator**.  
  - I was also prompted to use **software OATH tokens** instead of the Authenticator app.  

- To try to fix this, I went into my primary account’s authentication methods and selected **“require re-register multifactor authentication.”**  

- After signing out, I encountered a **sign-in loop**: the system continuously prompted for MFA, but completing the steps always returned an error.  

- I then tried to use a **secondary global admin account** to revert the change, but the sign-in was blocked due to the MFA misconfiguration. Interestingly, my **break-glass admin account** didn’t require re-setting up MFA—likely because it was an intermittent issue that accepted the original sign-in. This clearly demonstrated why having a **break-glass account** is critical.  

- I headed over to **authentication methods** and removed both the **software OATH token** and **Microsoft Authenticator** entries so that the account would default to my Conditional Access policy. This resolved the error and allowed me to regain control of my primary account.  

**Lessons learned:**
- Always maintain a **break-glass account** with permanent access in case of lockouts.  
- Test policy changes carefully, as even minor misconfigurations can lock out administrators.  

---

### 2️⃣ Conditional Access & MFA Policy
- Configured **Conditional Access policies** to enforce MFA across the tenant.  
- Encountered **conflicts with pre-existing Microsoft MFA policies**, which caused the sign-in loop.  
- Created an **MFA exclusion group** for testing, and confirmed that standard accounts could bypass MFA when included.  
- Key takeaways:
  - Always **test policies on non-admin users** before enforcing them tenant-wide.  
  - Understand **existing MFA setups** to avoid conflicts with new policies.  
  - **Break-glass accounts** are essential to recover from unintended lockouts.  
  - Document any policy changes carefully to track what triggers loops or conflicts.

---

## Outcome
- Break-glass admin account ensured access even during misconfigurations.  
- Conditional Access policy successfully applied   
- Gained practical experience in troubleshooting MFA issues and understanding Azure AD authentication flows.  
- Prepared the tenant for future exploration of **Azure Sentinel and Log Analytics**, to monitor and visualize authentication events in subsequent projects.
