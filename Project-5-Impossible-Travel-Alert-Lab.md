# Project 5 – Impossible Travel Alert Lab

**Objective:**  
Simulate a SOC workflow for detecting impossible travel sign-ins, logging alerts to Excel, and triggering notifications via Logic Apps. This lab also demonstrates handling common configuration mistakes in Azure Sentinel.

---

# 1 Lab Setup

- **Analytics Rule:** Impossible Travel  
  - Trigger: Azure AD sign-in anomaly  
  - Condition: NRT detection  

- **Automation Rule:** `NRT_ImpossibleTravel_AutoLog_Excel`  
  - Trigger: Alert created  
  - Action: Run playbook  
  - Order: 1  

- **Playbook:** `Impossible_Travel_Lab_Playbook`  
  - Actions:
    - Add a row to Excel (`Impossible Travel Alerts.xlsx`)  
    - Optional email / Teams notification  

- **Excel Table:** Stored in OneDrive for Business  
  - Columns: UserPrincipalName, Locations, IPs, TravelTimeHours, FailedAttempts, Description, StartTime, EndTime, AlertName

---

# 2️ Steps Completed

1. Created **Impossible Travel Analytics Rule** in Sentinel  
2. Initially attempted to create the Logic Apps playbook, but it was in the wrong resource group  
   - Mistake: Sentinel could not see the playbook, so the automation rule could not attach  
3. Fixed by **recreating the Logic Apps Playbook directly via Sentinel** in the **correct resource group** (`DomainName-Security`)  
4. Enabled **System-assigned Managed Identity** on the playbook  
   - This allowed Sentinel to authenticate to the playbook successfully  
5. Configured **Excel column mapping** and **DateTime formatting**
6. Verified alerts populate Excel rows correctly when test alerts fired  

---

# 3️ Lessons Learned
Resource group matters: Creating a Logic App outside Sentinel may prevent it from appearing in the Playbooks tab.

Managed Identity is critical: Playbooks fail to validate without enabling it.

DateTime formatting is essential for readable Excel logs.

Automation order only matters if multiple rules target the same alert.

Recreating the playbook in the correct RG was a key step to make the lab functional.

---

# 4️ Next Steps / Improvements
Add Teams/Slack integration for analyst notifications

Simulate multiple simultaneous impossible travel alerts to test workflow scalability

Create incident creation step in playbook to automatically generate Sentinel incidents

Expand lab to include other Azure AD anomalies (e.g., risky sign-ins, MFA failures)
