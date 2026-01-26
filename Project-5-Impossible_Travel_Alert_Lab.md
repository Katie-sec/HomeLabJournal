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

# 2 Steps Completed

1. Created **Impossible Travel Analytics Rule** in Sentinel  
2. Initially created **Logic Apps Playbook** in the **wrong resource group** (`Impossible_Travel_Lab_Playbook_group`)  
   - Mistake: Sentinel could not see the playbook  
   - Result: Playbook didn’t appear in Sentinel → automation rule could not attach  
3. Fixed by **recreating the Logic Apps Playbook directly via Sentinel** in the **correct resource group** (`Domainname-Security`)  
4. Enabled **System-assigned Managed Identity** on the playbook  
   - Mistake: Without this, workflow validation failed (`WorkflowManagedIdentityConfigurationInvalid`)  
5. Assigned **Microsoft Sentinel Automation Contributor** to the managed identity  
6. Configured **Excel column mapping** and **DateTime formatting**:

@formatDateTime(convertFromUtc(triggerOutputs()?['body']?['StartTime'],'GMT Standard Time'),'yyyy-MM-dd HH:mm:ss')
Verified alerts populate Excel rows correctly when test alerts fired

---

# 3️ Lessons Learned
Resource group matters: Creating a Logic App outside Sentinel may prevent it from appearing in the Playbooks tab.

Managed Identity is critical: Playbooks fail to validate without enabling it.

RBAC permissions must be correct: Sentinel needs access to the playbook’s managed identity.

DateTime formatting is essential for readable Excel logs.

Automation order only matters if multiple rules target the same alert.

Mistakes are part of learning: Recreating the playbook in the correct RG was a key step to make the lab functional.

---

# 4️ Next Steps / Improvements
Add Teams/Slack integration for analyst notifications

Simulate multiple simultaneous impossible travel alerts to test workflow scalability

Create incident creation step in playbook to automatically generate Sentinel incidents

Expand lab to include other Azure AD anomalies (e.g., risky sign-ins, MFA failures)
