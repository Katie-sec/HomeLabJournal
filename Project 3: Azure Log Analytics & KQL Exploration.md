# Project 3: Azure Log Analytics & KQL Exploration 🎯

## Objective
- Explore Azure Log Analytics and Kusto Query Language (KQL) to monitor Microsoft 365 tenant activity.  
- Learn to visualize failed sign-ins and authentication events using Azure Workbooks for actionable insights.  

Focus areas:  
- Building KQL queries  
- Interpreting raw logs  
- Creating meaningful visualizations for SOC-style monitoring  

## 🧠 Background / Context
- After completing Project 2, my tenant had Conditional Access and MFA policies fully configured.  
- Next goal: begin monitoring the environment using Azure Sentinel (Microsoft Defender for Cloud) and Log Analytics.  

Key learnings:  
- How Azure AD, Log Analytics, and Sentinel work together  
- How to use KQL to extract meaningful insights  
- How to visualize data to detect authentication patterns and anomalies  

## 🛠️ What I Did

### 1️⃣ Log Analytics Workspace Setup
- Created a dedicated resource group for the project  
- Provisioned a Log Analytics workspace  
- Connected:  
  - Azure Active Directory  
  - Azure Monitor  
- Ran into licensing limitations when enabling some connectors (e.g., Defender for Office Purview)  
- Learned that certain Defender connectors require higher-tier licenses  

### 2️⃣ Initial KQL Exploration
- Ran basic queries to understand log structure and available data:

```kql
// Latest 20 activities in Azure subscription
AzureActivity
| top 20 by TimeGenerated desc

// Last 20 Azure AD sign-ins
SigninLogs
| top 20 by TimeGenerated desc

// User and admin changes in Azure AD
ADAuditLogs
| top 20 by TimeGenerated desc
3️⃣ Workbook for Visualization
Created visualizations to monitor sign-in attempts, focusing on failed and risky authentications.

Failed Sign-ins Query:

kql
Copy code
SigninLogs
| where TimeGenerated >= ago(72h)
| where ResultType != 0 // Failed logins
| summarize FailedSignins = count() by bin(TimeGenerated, 1h), UserPrincipalName
| order by TimeGenerated asc
Produced a bar chart showing failed sign-ins per user over time, making spikes and patterns easy to identify.

4️⃣ Lessons Learned
Raw logs are overwhelming — Workbooks + queries bring clarity

Summarization and binning make trends visible

Understanding relationships between:

Sign-in logs

Audit logs

Azure Activity logs
is essential for effective monitoring

Licensing matters — several connectors require specific Defender / M365 plans

Monitoring is iterative: KQL queries evolve as new scenarios emerge

5️⃣ Next Steps / Improvements
Create an Analytics rule in Defender to trigger alerts for suspicious sign-ins

Integrate automation playbooks to:

Email admins

Lock risky accounts

Take automatic remediation steps

Expand workbook visualizations to track:

Role changes / privilege escalations

MFA failures by user or group

Risky sign-in locations

Refine KQL queries to reduce noise and highlight actionable events

Screenshot
