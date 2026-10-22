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
      "purpose": "In both the production environment at work and my personal home lab, I've configured the Logic App to run automatically every Monday at 9:00 AM. This kicks off the weekly threat hunts without anyone needing to start them manually.",
      "input": "Recurrence schedule or manual trigger",
      "output": "A new workflow execution",
      "why": "A repeatable schedule helps prevent hunts from relying on an analyst remembering to run each query.",
      "verify": "The Azure Logic App designer and run history show the configured trigger and successful test executions."
    },
    {
      "title": "Log Analytics: run ten hunts",
      "short": "Execute the master KQL",
      "purpose": "The workflow queries the Log Analytics workspace. Its master query produces a QueryName and aggregated Total for each of ten hunts.",
      "input": "Workspace telemetry and the configured lookback",
      "output": "Ten hunt-name / match-count pairs",
      "why": "Aggregated counts are useful for a weekly register; event-level records are inspected separately during investigation.",
      "verify": "The Sentinel hunting workspace contains the individual hunts; the Logic App queries the workspace for scheduled totals."
    },
    {
      "title": "Sentinel review watchlist",
      "short": "Retrieve reference notes",
      "purpose": "The workflow retrieves a Sentinel watchlist containing review defaults and supporting notes for the configured hunts.",
      "input": "ThreatHuntingReview watchlist rows",
      "output": "Reference fields used when preparing results",
      "why": "Consistent zero-match notes reduce repetitive manual entry, without implying that a zero count proves a detection works.",
      "verify": "The lab includes a Sentinel watchlist and a review register with status, notes and tuning fields."
    },
    {
      "title": "Match and classify results",
      "short": "Apply review logic",
      "purpose": "For each query result, the Logic App matches the corresponding watchlist entry. Positive matches are flagged for analyst review; zero matches receive predefined context.",
      "input": "QueryName + Total, matching watchlist row",
      "output": "One prepared register row per hunt",
      "why": "The loop is sequential to avoid shared-variable races. A zero-result default is not an analyst verdict.",
      "verify": "The workflow uses a for-each process, matching logic and a DateWritten variable."
    },
    {
      "title": "Excel Threat Hunt Register",
      "short": "Write the audit trail",
      "purpose": "The Logic App appends hunt results to an Excel workbook. The run date appears on the first row of the batch, and separator rows make runs easier to read.",
      "input": "Prepared results and execution date",
      "output": "Ten entries awaiting analyst review",
      "why": "The workbook makes results visible and provides space for review, notes, tuning and final status. It is a lab-oriented choice, not a production SIEM database.",
      "verify": "The real workbook includes findings, action requirements, review status, notes and tuning fields."
    },
    {
      "title": "Notification and analyst review",
      "short": "Hand over to the analyst",
      "purpose": "After writing the register, the Logic App sends a completion email linking to the workbook and prompting the analyst to investigate findings.",
      "input": "Completed register update",
      "output": "Review notification and an analyst action",
      "why": "Automation gathers and records results; the analyst must still validate telemetry, investigate matches and decide whether escalation is warranted.",
      "verify": "The lab has a working email notification. This implementation does not claim automatic ticket creation."
    }
  ]
};
