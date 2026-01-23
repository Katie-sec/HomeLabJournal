# Project 4: Sentinel Analytics Rule Triggering an Automation Playbook

## Objective
To create a Microsoft Sentinel **Analytics Rule** that detects failed sign-in attempts and triggers an **Automation Playbook** to send an email notification. This project focused on understanding how alerts, incidents, analytics rules, and playbooks interact within Sentinel.

---

## Background
As part of my home lab, I wanted to move beyond log querying and visualisation and begin experimenting with **basic detection and response workflows**. The goal was to simulate a simple incident response scenario where suspicious activity (failed sign-ins) resulted in an automated action.

---

## What I Attempted
1. Identify failed sign-in events using **Azure Log Analytics / KQL**
2. Create an **Analytics Rule** in Microsoft Sentinel based on those logs
3. Configure the rule to generate incidents
4. Attach an **Automation Playbook** that sends an email when the rule is triggered

---

## Implementation Steps

### 1. Log Exploration
- Used the `SigninLogs` table in Log Analytics
- Queried failed sign-in attempts by filtering on non-zero `ResultType`
- Confirmed logs were being ingested and visible within Sentinel

Example logic explored:
- Failed authentication attempts
- Time-bounded queries (e.g. last 24–72 hours)
- Grouping by user and time to identify patterns

---

### 2. Analytics Rule Creation
- Created a **Scheduled Analytics Rule** in Microsoft Sentinel
- Used a KQL query targeting failed sign-ins
- Configured the rule to:
  - Run on a schedule
  - Generate alerts
  - Create incidents automatically

At this stage, the rule appeared to work, but behaviour was not immediately clear.

---

### 3. Playbook Configuration
- Created a Logic App–based **Automation Playbook**
- Intended behaviour:
  - Trigger when an incident is created
  - Send an email notification to my address
- Assigned appropriate permissions to allow Sentinel to trigger the playbook

![Sentinel automation playbook configuration](screenshots/project-4/playbook.png)

---

## Issues Encountered (and Lessons Learned)

### Alerts vs Incidents Confusion
- I observed multiple **alerts** being generated but **no incidents**
- Initially believed Sentinel was misconfigured
- Learned that:
  - Alerts do not always automatically create incidents
  - Incident creation depends on analytics rule settings
  - Some detections may only surface as alerts unless explicitly configured

This clarified the **relationship between logs → alerts → incidents → automation**, which was a key learning outcome.

---

### Playbook Not Triggering
- Because incidents were not being created as expected, the playbook never fired
- This reinforced the importance of:
  - Correct incident creation
  - Proper automation rule attachment
  - Understanding Sentinel’s detection pipeline end-to-end

---

## Outcome
- Successfully created and tested:
  - KQL queries for failed sign-ins
  - A Sentinel analytics rule
  - An automation playbook structure

    
- Gained a clearer understanding of:
  - Sentinel detection logic
  - Alert vs incident behaviour
  - Why automation depends on incident generation

Although the full workflow did not trigger as intended initially, the troubleshooting process itself was the most valuable part of the exercise.

---

## Key Takeaways
- Security monitoring is not just about writing queries
- Understanding how detections escalate is critical for incident response
- Automation only works when detections are correctly configured
- Small misconfigurations can silently break response workflows

---![Sentinel analytics rule for failed sign-ins](screenshots/project-4/analytics-rule.png)

## Next Steps
- Refine the analytics rule to reliably generate incidents
- Implement alert grouping and suppression logic
- Expand playbooks to include additional response actions
- Continue building toward more realistic incident response scenarios

---

## Reflection
This project highlighted how **real-world security tooling often behaves differently than expected** and reinforced the importance of methodical troubleshooting. Even failed or incomplete implementations provided valuable insight into how Microsoft Sentinel operates in practice.
