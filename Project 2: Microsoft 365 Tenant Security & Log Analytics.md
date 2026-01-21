Projects / Labs
Project 2: Microsoft 365 Tenant Security & Log Analytics
Objective

Build a secure Microsoft 365 tenant environment, implement Conditional Access (CA) and Multi-Factor Authentication (MFA) policies, and explore Azure Sentinel log analytics for monitoring sign-in activity.


---


Background / Context

While configuring MFA via a Conditional Access policy, I encountered issues that could have locked me out of my tenant. This experience highlighted the importance of creating a break-glass admin account for emergencies and provided hands-on experience troubleshooting authentication conflicts.

I also wanted to explore Azure Sentinel for tenant activity monitoring. This project gave me practical insight into the interplay between security policies, Azure AD, licensing, and SIEM tools.


---


What I Did
1️⃣ Break-Glass Admin Account

Created an emergency global admin account to prevent tenant lockouts.

While troubleshooting an MFA lockout, I selected “require re-register multifactor authentication”. After signing out, I encountered a sign-in loop: the system repeatedly prompted for MFA, but completing the steps returned an error.

Attempted to use a secondary global admin account to revert the change, but it was also blocked. This demonstrated why the break-glass account is essential for tenant safety.

Realized the need to adjust authentication settings in Entra ID, including disabling software OATH tokens and Microsoft Authenticator conflicts, to allow my Conditional Access policy to work correctly.


---


2️⃣ Conditional Access & MFA Policy

Configured Conditional Access policies to enforce MFA across the tenant.

Encountered conflicts with pre-existing Microsoft MFA policies, which caused sign-in loops.

Discovered that global admins cannot bypass MFA, even with PIM enabled, whereas standard users could bypass MFA via exclusion groups.

Created an MFA exclusion group for test users and verified that standard accounts could bypass MFA as expected.

This process reinforced best practices for tenant security:

Always create a break-glass account.

Test CA policies on standard users before enforcing tenant-wide.

Understand how pre-existing MFA configurations can interact with new policies.


---


Azure Log Analytics & SIEM Exploration

Created a Log Analytics workspace and a dedicated resource group.

Connected Azure Active Directory and Azure Monitor to centralize logs.

Ran into several licensing issues that prevented adding some data connectors (e.g., Microsoft Defender for Office Purview). This highlighted that certain Defender features require specific license tiers.

Initial KQL Exploration
To start exploring tenant activity, I ran basic KQL queries to understand recent events:

// Latest 20 activities in Azure subscription
AzureActivityLogs -AuditLogs
| top 20 by TimeGenerated desc

// Last 20 Azure AD sign-ins
SigninLogs
| top 20 by TimeGenerated desc

// User and admin changes in Azure AD
AuditLogs
| top 20 by TimeGenerated desc


These queries returned raw log entries including successful and failed sign-ins, role assignments, and administrative changes. However, interpreting the data was difficult due to the volume and structure of the logs.

Workbook Exploration for Better Understanding
To make the data more digestible, I created a workbook to visualize key metrics:

Built charts to track sign-in attempts, including failed and risky logins.

Used the following query to focus specifically on failed sign-ins over the past 72 hours:

SigninLogs
| where TimeGenerated >= ago(72h)
| where ResultType != 0  // Failed logins
| summarize FailedSignins = count() by bin(TimeGenerated, 1h), UserPrincipalName
| order by TimeGenerated asc


Rendered the results as a bar chart, grouping failed sign-ins by hour and user, which helped identify patterns and spikes in login failures.

Screenshot example below illustrates how failed sign-ins were visualized:


---



Challenges Encountered

Raw query results were initially overwhelming, making it difficult to see trends.

Worked through formatting in the workbook to create charts that were easier to read and interpret.

Learned how to summarize and bin data effectively for hourly trends across multiple users.
