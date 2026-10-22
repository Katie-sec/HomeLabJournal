// Editable real-lab explanatory copy; changes reviewed through GitHub pull requests.
const labCopy = {
  "static": {
    "introTitle": "Inside the threat-hunting programme I built",
    "introDescription": "My home lab uses Microsoft Sentinel, Log Analytics, Azure Logic Apps, Sentinel watchlists and an Excel Threat Hunt Register. Follow how the components work together, then replay an offline, fictional example to see how a scheduled hunt becomes an analyst review task.",
    "workflowTitle": "Explore the actual workflow",
    "workflowDescription": "Choose a component to see its purpose, inputs, outputs and design considerations",
    "replayTitle": "Watch the automation run",
    "replayDescription": "Follow a fictional execution through the real architecture, from Sentinel to the Excel register and completion email.",
    "startHere": "Explore the actual workflow, then run a fictional scenario to watch Sentinel results appear in the Excel register and completion email.",
    "startHereExtra": "Run it again to compare different outcomes."
  },
  "steps": [
    {
      "title": "Scheduled / manual trigger",
      "short": "Start a hunting cycle",
      "purpose": "In both the production environment at work and my personal home lab, I've configured the Logic App to run automatically every Monday at 9:00 AM. This kicks off the weekly threat hunts without anyone needing to start them. I've also kept the option to trigger the workflow manually, which is particularly useful when testing changes or when I need to run the hunts outside of the usual schedule.\n",
      "input": "Recurrence schedule or manual trigger",
      "output": "A new workflow execution",
      "why": "I wanted the threat hunts to run consistently each week without relying on someone remembering to kick them off. Automating the schedule means the team can spend less time on repetitive tasks and more time reviewing the results and investigating anything that needs attention.\n",
      "verify": "The Azure Logic App designer and run history show the configured trigger and successful test executions."
    },
    {
      "title": "Log Analytics: run ten hunts",
      "short": "Execute the master KQL",
      "purpose": "I've individually created and tuned my KQL threat-hunting queries to suit the different environments at work and in my home lab. For this project, I've brought ten of those hunts together into a single master query, which the Logic App runs automatically.\n\nThe master query returns each hunt's name alongside an aggregated total of its findings, allowing me to see the results of all ten hunts in one place.",
      "input": "Workspace telemetry and the configured lookback",
      "output": "Ten hunt-name / match-count pairs",
      "why": "I wanted to keep the automation as straightforward as possible rather than having the Logic App run each query separately. Combining them into one master query also gives me a consistent format for recording the results in Excel.\n\nThe totals help me quickly identify which hunts have returned findings, while the individual queries remain available in Sentinel for more detailed investigation.\n",
      "verify": "The Sentinel hunting workspace contains the individual hunts; the Logic App queries the workspace for scheduled totals."
    },
    {
      "title": "Sentinel review watchlist",
      "short": "Retrieve reference notes",
      "purpose": "The workflow retrieves a Sentinel watchlist containing predefined notes and review statuses for each of the threat hunts. When a hunt returns zero results, the workflow uses the relevant watchlist entry to automatically populate the Threat Hunt Register, rather than requiring me to enter the same information manually each week.\n",
      "input": "ThreatHuntingReview watchlist rows",
      "output": "Reference fields used when preparing results",
      "why": "After a few weeks of running the threat hunts in my production environment at work, I realised I was spending far too much time repeatedly entering the same notes for hunts that returned zero results. Not only that, but I felt it was taking time away from actually investigating the findings.\n\nThat's why to solve the issue, I decided to introduce a Sentinel watchlist containing predefined notes for zero-result hunts. This reduced the amount of manual entry needed and gave both myself and the rest of the security team more time to focus on reviewing results, validating the queries and investigating anything suspicious.",
      "verify": "The lab includes a Sentinel watchlist and a review register with status, notes and tuning fields."
    },
    {
      "title": "Match and classify results",
      "short": "Apply review logic",
      "purpose": "At this stage, the Logic App works through each hunt result and matches it against the corresponding entry in my Sentinel watchlist. If a hunt returns zero results, the workflow automatically retrieves the predefined notes and review status. If findings are returned, they're flagged for further investigation.\n\nThis information is then prepared for the next stage, where it's recorded in my Excel Threat Hunt Register.",
      "input": "QueryName + Total, matching watchlist row",
      "output": "One prepared register row per hunt",
      "why": "I wanted the workflow to handle the repetitive administrative work while making sure anything requiring investigation stood out.\n\nTo help with this, I also configured conditional formatting in Excel to automatically highlight results greater than zero, along with entries marked with a 'Y'. This makes it much easier for myself and the rest of the security team to spot hunts that need attention without having to manually check every row.\n\nThe automation prepares the results, but it's still up to the analyst to review the findings and decide whether further investigation is needed.",
      "verify": "The workflow uses a for-each process, matching logic and a DateWritten variable."
    },
    {
      "title": "Excel Threat Hunt Register",
      "short": "Write the audit trail",
      "purpose": "The Threat Hunt Register is where I've brought everything together, from documenting the individual hunting queries to recording their results and tracking anything that needs further investigation.\n\nRather than using Excel purely to store the results, I've organised the workbook into several tabs, each serving a different purpose:\n\n- Overview & Standards: This explains how the threat-hunting programme works, how the workbook is structured and the procedure analysts should follow when reviewing results.\n- Query Catalogue: Documents each hunting query, including its purpose, data source, common false positives and proposed MITRE ATT&CK tactic and technique mappings.\n- Weekly Hunt Data Log: Automatically populated by the Logic App every Monday, recording the results of each scheduled hunt for analyst review.\n- Monthly Hunt Data Log: Used in my production environment for longer-lookback hunts, helping identify activity that might not be obvious within the weekly hunting windows.\n- Findings & Escalations: Provides a dedicated place to document suspicious findings, further investigations and any necessary escalations.\n\nI've also included a separate area for query amendments and notes, allowing changes and tuning decisions to be documented over time.",
      "input": "Prepared results and execution date",
      "output": "Ten entries awaiting analyst review",
      "why": "When I started developing the threat-hunting programme at work, I wanted somewhere that would do more than simply record how many results each query returned.\n\nI wanted the team to have one central place where they could understand what each hunt was looking for, review the results, document investigations and keep track of any changes made to the queries.\n\nBy bringing everything together in one workbook, I've tried to make the programme easier to manage, more consistent for the team and simpler to maintain as additional hunts are introduced.",
      "verify": "In my home lab, I've recreated the Excel Threat Hunt Register and connected it to my Azure Logic App, allowing the weekly hunt results to be written automatically.\n\nThe workflow records the execution date, query names and aggregated results, with separator rows helping distinguish between scheduled runs.\n\nMy production register at work is more extensive, supporting over 30 weekly hunts alongside 10 monthly hunts, query documentation, tuning records and investigation tracking. I've used the same underlying approach in my home lab to demonstrate how the automation and reporting fit together."
    },
    {
      "title": "Notification and analyst review",
      "short": "Hand over to the analyst",
      "purpose": "After writing the register, the Logic App sends a completion email to the security team, linking the workbook and prompting the reader to investigate findings.\n",
      "input": "Completed register update",
      "output": "Review notification and an analyst action",
      "why": "Automation gathers and records results; the analyst must still validate telemetry, investigate matches and decide whether escalation is warranted.",
      "verify": "In my home lab, I've configured the Logic App to send an email notification once the threat hunts have finished running. This lets me know the results are ready to review without having to keep checking the workflow manually.\n\nI've also implemented a similar process at work, where the automation goes a step further by raising a ticket for the team to review. I wanted to recreate as much of that experience as possible in my own environment, while keeping the lab simple and focused on demonstrating how the different components work together.\n"
    }
  ]
};
