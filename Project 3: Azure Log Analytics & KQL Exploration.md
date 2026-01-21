## Projects / Labs

# Project 3: Azure Log Analytics & KQL Exploration

## Objective
Explore **Azure Log Analytics** and **Kusto Query Language (KQL)** to monitor Microsoft 365 tenant activity. Learn to visualize failed sign-ins and other authentication events using **workbooks** for actionable insights.

This project focuses on building queries, interpreting raw logs, and creating visualizations to support SOC-style monitoring scenarios.

---

## Background / Context
After completing Project 2, my tenant had **Conditional Access and MFA policies** in place. I wanted to take the next step: using **Azure Sentinel and Log Analytics** to monitor tenant activity, detect failed sign-ins, and visualize patterns that a security operations team might look for.  

This project taught me:
- How Azure AD, Log Analytics, and Sentinel interact  
- How to use **KQL** to extract meaningful insights from raw log data  
- How to visualize and interpret authentication trends using **workbooks**

---

## What I Did

### 1️⃣ Log Analytics Workspace Setup
- Created a dedicated **resource group** for the project.  
- Provisioned a **Log Analytics workspace** in Azure.  
- Connected **Azure Active Directory** and **Azure Monitor** to centralize tenant logs.  
- Encountered **licensing issues** when trying to enable some data connectors (e.g., **Microsoft Defender for Office Purview**).  
  - Learned that some Defender features require specific license tiers.  

---

### 2️⃣ Initial KQL Exploration
Before creating visualizations, I ran some **basic KQL queries** to get a sense of the raw log data:

<details>
<summary>Sample KQL Queries (click to expand)</summary>

```kql
// Latest 20 activities in Azure subscription
AzureActivity
| top 20 by TimeGenerated desc

// Last 20 Azure AD sign-ins
SigninLogs
| top 20 by TimeGenerated desc

// User and admin changes in Azure AD
AuditLogs
| top 20 by TimeGenerated desc
These queries returned raw log entries, including successful and failed sign-ins, administrative changes, and role assignments.

Interpreting trends directly from raw logs was challenging due to the volume and structure of the data.

</details>
3️⃣ Workbook for Visualization
To better understand the data, I created a workbook in Azure Sentinel:

Built visualizations to track sign-in attempts, focusing on failed and risky logins.

Created a bar chart showing failed sign-ins per user over time.

Used the following KQL query to highlight failed logins in the past 72 hours:

<details> <summary>Failed Sign-ins Query (click to expand)</summary>
kql
Copy code
SigninLogs
| where TimeGenerated >= ago(72h)
| where ResultType != 0  // Failed logins
| summarize FailedSignins = count() by bin(TimeGenerated, 1h), UserPrincipalName
| order by TimeGenerated asc
markdown
Copy code

- The query:
  - Filters for **failed sign-ins** only  
  - Summarizes results **hourly** and by **user principal name**  
  - Orders results chronologically for trend analysis

- This visualization made it **much easier to spot patterns and spikes** in failed sign-ins.  

<details>
<summary>Screenshot Example (click to expand)</summary>

![Failed Sign-ins over last 72 hours](./images/project3_failed_signins.png)

</details>

---


### 4️⃣ Lessons Learned
- **Raw logs are overwhelming**: Workbooks and KQL summaries are essential for extracting insights.  
- **Summarization and binning** make trends much more visible.  
- Understanding how **Azure AD sign-ins, audit logs, and activity logs** interact is key to building useful dashboards.  
- **Licensing matters**: some data connectors in Azure Sentinel require specific Microsoft 365 or Defender licenses.  
- Real-world tenant monitoring requires **iteration**: queries often need refinement as new patterns or edge cases appear.

---

### 5️⃣ Next Steps / Improvements
- Create an **Analytics rule in Microsoft Defender** to trigger a playbook for failed or suspicious sign-ins.  
- Integrate **playbooks** to automatically respond to alerts (e.g., send emails, lock accounts, or notify admins).  
- Expand **workbook visualizations** to track trends like:
  - Role changes and privilege escalations  
  - MFA failures across user groups  
  - Sign-in anomalies or risky locations  
- Refine **KQL queries** to reduce noise and highlight actionable events.

