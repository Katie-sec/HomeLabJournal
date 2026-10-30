# Project 6 — Microsoft Sentinel Threat Hunting & Automation Lab

From developing my first threat-hunting programme in a professional SOC environment to recreating the architecture in my personal home lab and building an interactive simulation for others to explore.

**Technologies**: Microsoft Sentinel | Microsoft Azure | Log Analytics | Microsoft Entra ID | KQL | Azure Logic Apps | Sentinel Watchlists | Microsoft Excel | MITRE ATT&CK

## 1. Introduction — My Journey into Cybersecurity

It's been several months since I last worked on a project within my home lab, and there's a very good reason why.

In March 2026, I finally achieved something I'd been working towards for several years: becoming a Cybersecurity Analyst!

My interest in cybersecurity originally developed during my time working in IT support. I remember my former Service Desk Manager introducing me to the ISC2 Certified in Cybersecurity (CC) certification, explaining that it had been designed to help 
introduce hundreds of thousands of people to the cybersecurity industry.

That conversation helped shape the direction I wanted to take my career.

Over time, I began working towards industry certifications, including ISC2 CC, CompTIA Security+, Microsoft Security, Compliance and Identity Fundamentals (SC-900), and Azure Fundamentals (AZ-900). Alongside these qualifications, I started building my own Microsoft 365 and Azure home lab to develop practical experience beyond my day-to-day responsibilities.

Eventually, that work paid off.

I joined Kyocera Document Solutions as a Second Line Cyber Security Analyst back in March 2026, moving from a role combining IT support and security responsibilities into a position dedicated to cybersecurity operations.

The transition has been an incredible learning experience.

Since joining, I've gained hands-on experience investigating security alerts using CrowdStrike, analysing incidents within SIEM platforms, examining threat intelligence and creating security advisories both internal and external to send to our customers. Not to mention, utilising Crowdstrike telemetry to perform identity protection reviews further enhancing my vulnerability management skills.

However, one of the most significant developments in my career so far has been something I hadn't originally expected to take ownership of.

Developing my organisation's structured threat-hunting programme.

This project is the story of how that happened, what I learned along the way and why I decided to recreate the process within my home lab.

## 2. How My Threat-Hunting Journey Began

When I first joined the SOC team, threat hunting was an area I had virtually no practical experience in.

Like many security operations teams, we hold a daily SOC meeting to discuss ongoing investigations, emerging threats, operational priorities and planned security activities.

One of the recurring questions during these meetings was whether any proactive threat hunting would be conducted that day.

For several weeks, the answer was often no.

This wasn't because threat hunting wasn't considered important. There were simply other operational priorities that the team had in mind.

However, I began wondering whether there was something I could do to help. I had heard about threat hunting previously and knew it was definitely a field I wanted to develop in.

So eventually, I volunteered.

At that point,  I had never written a proper threat-hunting query, developed a hunting programme or used Microsoft Sentinel's Hunting interface extensively. However, I saw it as an opportunity to contribute to the team while developing a new technical skill. 

One of my colleagues gave me a brief introduction to Microsoft Sentinel's Hunting interface. They showed me where the existing Microsoft-provided hunting queries could be found and explained that the queries would likely require tuning to suit our environment.

That was my starting point.

### Learning KQL

My first challenge was understanding Kusto Query Language (KQL).

Although I was familiar with the purpose of a SIEM, I hadn't previously spent much time writing queries to investigate specific patterns of activity.

I started by examining existing Microsoft hunting queries and trying to understand what they were looking for.

I also used Microsoft Copilot as a learning aid to help explain unfamiliar syntax and assist with developing queries.

This is something I want to be transparent about because it was an important part of my learning process.

Also, I wasn't suddenly proficient in KQL overnight, and I certainly wouldn't describe myself as an expert today.

However, working through these queries helped me understand how different log sources could be investigated and how detection logic needed to be adapted to the environment being monitored.

Over time, I became more comfortable interpreting query results and making adjustments to improve their relevance.

I still have plenty to learn, particularly around advanced query optimisation, but this project gave me a practical foundation to build upon.

### From Ad-Hoc Queries to a Repeatable Process

Initially, I was running queries manually within Sentinel's Hunting interface.

This allowed me to identify activity matching the configured criteria, but there was a limitation.
I didn't have a structured way of recording the results.

Queries could be executed and investigated, but there wasn't a central record documenting which hunts had been completed, what they were designed to detect, whether the results required investigation or whether the query itself needed tuning.

This is when a senior third-line engineer suggested creating an Excel spreadsheet to document the hunting activity.
At first, I wasn't entirely sure what such a register should contain.

So I started researching how I could turn a simple spreadsheet into something more useful.

I wanted a repeatable process that could support investigation and make it easier to understand what had already been checked.

## 3. Designing the Threat-Hunting Register

Rather than creating a basic spreadsheet containing query names and results, I wanted to build something that could support the entire threat-hunting lifecycle.

I eventually developed a workbook with several dedicated sections.

### Overview and Standards

This section explains the purpose of the register and how it should be used.

I wanted the process to be understandable to other analysts rather than dependent on one person knowing how everything worked.

### Query Catalogue

The query catalogue became one of the most important parts of the programme.

Each query was documented with information about its purpose, the activity it was designed to identify and the data sources it required.

I also recorded potential false positives and recommended execution frequencies.

As the catalogue developed, I incorporated mappings to the **MITRE ATT&CK framework.**

This was particularly important to me because I wanted to understand how each query related to real-world adversary behaviour.

Rather than simply running queries because they were available, I wanted to understand what techniques they were designed to detect.

The mappings also provided a starting point for identifying potential gaps in hunting coverage.

Of course, mapping a query to an ATT&CK technique doesn't mean that the technique is comprehensively covered. 

Nevertheless, it helped me think more critically about the purpose of each hunt.

### Weekly and Monthly Hunting Logs

I created separate sections for weekly and monthly hunting activities.

Weekly hunts focused on recurring checks for suspicious activity, while the monthly schedule was intended to accommodate broader investigations and patterns that might benefit from longer reporting periods.

I was particularly interested in the possibility of identifying slower-moving activity that might not be obvious during a short investigation window.

### Query Amendment Log

As I became more familiar with KQL, I realised that the queries would need to evolve.

Some produced results that weren't particularly useful, while others required additional filtering.

I therefore created an amendment log to document changes to the query logic.

This made it possible to understand why adjustments had been made and refer back to earlier versions where necessary.

### Findings and Escalations

Finally, I added a section for activity requiring further investigation.

The intention was to distinguish between routine hunting execution and findings that might warrant additional analysis or escalation.

By this stage, the register had become much more than somewhere to record numbers.

It was beginning to resemble a structured threat-hunting process.

However, another challenge was becoming increasingly apparent.

The amount of manual work involved was growing.

## 4. Introducing Automation

As the programme developed, the number of hunting queries increased.

Each hunting cycle involved executing the queries and manually entering their results into Excel.

Even when a query returned no findings, I still needed to document the outcome.

With an expanding query catalogue, this was becoming repetitive.

During a conversation with another second-line analyst though, the possibility of automating the process came up.

That got me thinking.

What if the queries could execute automatically, with their results recorded in the register without requiring someone to manually copy everything across?

I began researching Microsoft's automation capabilities and eventually focused on Azure Logic Apps.

After discussing the approach with my line manager, obtaining approval and receiving the necessary permissions, I began developing the workflow.

### Building My First Logic App

I had zero previous experience building this type of automated threat-hunting workflow and there was a considerable amount of trial and error.

I needed to understand how to execute KQL queries through Azure Monitor and pass the results into the appropriate Excel fields.

I also needed to make sure the workflow could complete successfully.

There were numerous tests and adjustments along the way.

But eventually, I had a functioning automation.

The Logic App could execute the configured queries on a schedule and populate the Threat Hunt Register with the results.

Initially, however, the automation only populated these three fields:

	• Week Commencing
	• Query Name
	• Total Findings Identified
This was a significant improvement, but it wasn't the finished solution.

I was still manually completing several other fields, including Action Required, Notes, Final Status and Logic Tuning.

In some cases, those fields took longer to complete than recording the original query results.

I wanted to take the automation further.

## 5. Using Sentinel Watchlists to Improve Reporting

The next challenge was finding a way to populate standardised review information without removing the analyst's responsibility to investigate suspicious results.

I began exploring Microsoft Sentinel Watchlists.

I realised that I could use a watchlist to store predefined information associated with each hunting query.

The Logic App could then retrieve that information and use it when updating the register.

For queries returning zero matches, the workflow could insert predefined notes and status information.

For queries returning one or more matches, the relevant fields would remain available for an analyst to investigate and document the outcome.

The following distinction was important however.

**A query returning zero results does not prove that an environment is secure. Equally, a query returning results does not automatically mean malicious activity has occurred.**

The automation was designed to reduce administrative work, not replace security analysis.

### How the Process Worked

The completed workflow followed this sequence:

	1. The scheduled Logic App executed the configured KQL hunting queries.
	2. Query results were collected and processed.
	3. The workflow retrieved predefined reporting information from the Sentinel Watchlist.
	4. The Threat Hunt Register was updated.
	5. Queries returning matches were flagged for analyst review.
	6. Completion notifications were generated.
	
The production implementation also incorporated several notification mechanisms.

Microsoft Teams: A message was posted to the SOC team's group chat, including a link to the updated register.

Outlook: An automated email confirmed that the hunting process had completed.

Ticket Generation: The email was also sent to the organisation's IT support address, allowing a ticket to be generated through the existing service management process.

This meant the results became part of the team's normal operational workflow rather than simply sitting in a spreadsheet.

### The Result

Within approximately four months of joining the organisation, I had developed and implemented a structured threat-hunting programme despite having no previous hands-on experience in threat hunting.

The programme eventually expanded to more than 40 KQL queries, supported by a query catalogue, reporting register, MITRE ATT&CK mappings, documented tuning processes and automated execution.

What began as volunteering to run a few queries had developed into an operational process that could support the wider SOC team.

I was particularly pleased that I had managed to accomplish this before completing my probationary period.

More importantly, the experience taught me how much can be achieved by identifying a problem, taking ownership of it and being willing to learn as you go.

## 6. Bringing the Programme into My Home Lab

After developing the programme at work, I decided I wanted to recreate it within my personal home lab.

There were two main reasons for this.

Firstly, I wanted to reinforce my understanding.

The original programme had been developed gradually over several months. Rebuilding the architecture from scratch would allow me to revisit those decisions and understand how everything fitted together.

Secondly, I wanted to document the project as part of my cybersecurity portfolio.

This was something I had invested a considerable amount of time into, and I wanted to demonstrate the work involved.

However, I needed to ensure that the personal implementation was completely separate from my employer's environment.

The home-lab version therefore uses my own Azure resources and Microsoft 365 tenant.

It recreates the general architecture and workflow of the programme without exposing my employer's queries or internal systems.

### Home Lab Scope

I deliberately reduced the scope of the implementation.

Rather than recreating all 40-plus production hunting queries, I developed ten structured hunting scenarios covering identity and Microsoft 365 security activity.

| Query | Hunting scenario |
|---|:---|
| TH-001 | Entra ID Group Management Activity |
| TH-002 | Privileged Role Assignment Activity |
| TH-003 | Failed Sign-ins Followed by Success |
| TH-004 | Conditional Access Policy Changes |
| TH-005 | Application and Service Principal Changes |
| TH-006 | Suspicious Sign-ins from multiple IP addresses |
| TH-007 | User Creation by an Unauthorised Account |
| TH-008 | Non-owner Mailbox Login Activity |
| TH-009 | External Mail Forwarding Destinations |
| TH-010 | Privileged Group Membership Changes |

Each query was designed to investigate a particular category of potentially suspicious activity.

I also documented the queries within Sentinel's Hunting interface and mapped them to relevant MITRE ATT&CK tactics and techniques where applicable.

The objective wasn't to create the largest possible query library.

It was to demonstrate how a manageable set of queries could be incorporated into a repeatable and automated threat-hunting process.

## 7. Configuring the Azure Environment

**Creating the Log Analytics Workspace**

The first stage involved creating a dedicated Azure resource group and Log Analytics workspace.

I created the resource group **rg-threat-hunting-lab** and deployed a workspace to collect the telemetry required for the project.

Once the deployment completed, I validated that the workspace was operational by executing a basic KQL query.

[Screenshot 1 — Log Analytics workspace overview]
Figure 1: The dedicated Log Analytics workspace created for the threat-hunting lab.

<img width="1863" height="844" alt="image" src="https://github.com/user-attachments/assets/de20bbf4-b7a0-4d78-97b6-7d270f040ea7" />

[Screenshot 2 — KQL validation query]
Figure 2: Testing the Log Analytics workspace with a basic KQL query before configuring the hunting environment.

<img width="711" height="438" alt="image" src="https://github.com/user-attachments/assets/fd6756c8-b096-4dd6-b102-afd41ad84e5d" />

### Configuring Entra ID Diagnostic Settings

Next, I configured Microsoft Entra ID diagnostic settings to send relevant identity telemetry to the workspace.

For this project, I focused primarily on:

	• AuditLogs: Administrative changes, including group management and application activity.
	• SigninLogs: Authentication activity, including successful and failed sign-in attempts.
	
These log sources supported several of the identity-focused hunting scenarios I wanted to investigate.

[Screenshot 3 — Microsoft Entra ID diagnostic settings]
Figure 3: Configuring Entra ID AuditLogs and SigninLogs to be sent to the Log Analytics workspace.

<img width="1361" height="913" alt="image" src="https://github.com/user-attachments/assets/25b12efa-6fea-4ac3-81a0-b3e5fd590c7a" />

### Enabling Microsoft Sentinel

With the workspace configured, I enabled Microsoft Sentinel and explored the available security content.

I also reviewed the available data connectors and the Microsoft Entra ID solution in Content Hub.

This allowed me to begin working with Sentinel's hunting capabilities and the telemetry collected from my tenant.

[Screenshot 4 — Sentinel data connectors]
Figure 4: Reviewing the Microsoft Sentinel data connectors and available security telemetry.

## 8. Developing the Hunting Queries

Once the environment was configured, I began recreating the hunting queries.

Each scenario was developed around a particular security concern, such as unexpected privileged role assignments or suspicious authentication patterns.

I used KQL to query the relevant log tables and return activity matching the configured conditions.

I also documented the queries within Sentinel's Hunting interface so they could be executed manually.

This was important because I wanted to retain two methods of execution.

Scheduled hunting: The Logic App executes queries automatically and records the results.

Ad-hoc hunting: An analyst can manually execute the queries within Sentinel when investigating a particular concern.

Both approaches use the same underlying hunting objectives.

## MITRE ATT&CK Mapping

I mapped the queries to relevant MITRE ATT&CK techniques to provide context for the behaviours being investigated.

For example, monitoring unexpected account creation can support investigations into account-based persistence.

These mappings helped me understand how the hunting scenarios related to attacker behaviour.

However, I also recognised that a MITRE mapping represents the intended detection objective rather than proof that a technique is fully covered.

[Screenshot 5 — Sentinel Hunting interface]
Figure 5: The ten home-lab hunting queries organised within Microsoft Sentinel, including their associated MITRE ATT&CK mappings.

<img width="1915" height="865" alt="image" src="https://github.com/user-attachments/assets/6f9048b8-7e5f-4049-a949-a20b64dffdf2" />

## 9. Recreating the Watchlist and Automated Register

After configuring the hunting queries, I recreated the reporting components.

I developed a CSV file containing predefined information for each hunting scenario.

The watchlist included fields such as:

	• QueryName
	• ResultCount
	• RequiresReview
	• Notes
	• FinalStatus
	• LogicTuning
	• ReviewedBy
	
I then uploaded the file to Microsoft Sentinel as a watchlist, using QueryName as the search key.

This allowed the automation to retrieve the appropriate reporting information for each query.

[Screenshot 6 — Watchlist CSV]
Figure 6: The CSV containing standardised review information and predefined notes for the ten hunting scenarios.

<img width="1553" height="364" alt="image" src="https://github.com/user-attachments/assets/af44d060-7cc8-46c0-a58e-1fda75b5fb96" />

[Screenshot 7 — Completed Sentinel Watchlist]
Figure 7: The watchlist successfully imported into Microsoft Sentinel.

<img width="1899" height="875" alt="image" src="https://github.com/user-attachments/assets/141b093e-e19d-4559-9fb6-798400df9a57" />

### Building the Threat Hunt Register

I also recreated the Excel reporting register.

The register records information such as the execution date, query name, total matches, whether action is required, investigation notes, final status, tuning information and reviewer status.

I incorporated conditional formatting to highlight queries returning findings.

For example, a query returning two matching events can be marked for review, while a query returning zero matches can have its predefined reporting information populated automatically.

Importantly, the register preserves the distinction between an automated result and a completed analyst investigation.

Entries awaiting investigation are not automatically marked as benign simply because the workflow has completed.

[Screenshot 8 — Automated Threat Hunt Register]
Figure 8: The Excel Threat Hunt Register showing multiple hunting runs, highlighted findings and entries awaiting analyst review.

## 10. Building the Logic App Automation

With the queries, watchlist and register configured, I began recreating the automation.

The Logic App was designed to execute the hunting process on a schedule and update the reporting register without requiring manual data entry for every query.

The workflow included:
	
	1. A recurrence trigger to start the scheduled execution.
	2. An Azure Monitor Logs action to execute the configured KQL queries.
	3. A step to retrieve the relevant watchlist information.
	4. Variables and processing actions to prepare the query results.
	5. An iteration step to process the returned records.
	6. Excel actions to populate the reporting register.
	7. A delay to support the completion of the workflow.
	8. An automated email notification confirming the hunting cycle had finished.

As with the production programme, getting the workflow right involved testing and troubleshooting.

One of the more useful lessons was understanding how data is passed between different Logic App actions.

I needed to ensure that the query results and predefined review information were correctly associated with the appropriate register entries.

I also encountered issues with Excel formatting and unwanted table rows.

Resolving these problems helped me become more comfortable with Logic Apps and the importance of validating an automated process from beginning to end.

[Screenshot 9 — Logic App designer]
Figure 9: The scheduled Logic App workflow, showing query execution, watchlist retrieval, result processing, Excel updates and email notification.

<img width="410" height="722" alt="image" src="https://github.com/user-attachments/assets/7fded673-fad8-4c93-840c-d9321da14f8f" />

### Automated Email Notification

The final stage of the home-lab workflow sends an email confirming that the scheduled hunting process has completed.
The notification includes a link to the Threat Hunt Register and outlines the next steps for reviewing results.

These steps include investigating queries returning matches, validating zero-result entries where necessary, reviewing potential false positives and documenting investigation outcomes.

I also included a reminder that automated query results do not independently confirm the presence or absence of malicious activity.

This was an important part of the design because the automation is intended to support an analyst's work, not make security decisions on their behalf.

[Screenshot 10 — Automated email notification]
Figure 10: The automated completion email generated by Azure Logic Apps, including a link to the register and guidance for analyst review.

<img width="1622" height="970" alt="image" src="https://github.com/user-attachments/assets/a506cecc-7577-4018-b51f-a3ada61468fc" />

## 11. Challenges and Lessons Learned

This project has involved far more than simply configuring Microsoft Sentinel.

One of the biggest lessons has been understanding how an idea can develop through several iterations.

When I first volunteered to conduct threat hunting at work, I had no intention of developing a full automation programme.
I simply wanted to help my team and learn something new.

The need for a reporting register came later.

The query catalogue developed as I realised I needed to document the hunting logic.

MITRE ATT&CK mappings became important as I tried to understand the coverage of the queries.

Automation followed when the manual workload became difficult to maintain.

Watchlists were introduced when I realised that automating query execution alone wasn't enough.

Each stage introduced new challenges and opportunities to learn.

### Learning Through Trial and Error

There were plenty of occasions when I didn't know how to implement something.

I spent time researching different approaches and testing configurations until the workflow behaved as expected.

Some of the most useful learning came from problems that initially seemed quite minor, such as incorrect Excel formatting or data not being passed between actions as expected.

These issues reinforced the importance of testing individual components as well as the complete workflow.

### Understanding the Limitations of Automation

Another important lesson was recognising that automation doesn't remove the need for human judgement.

A query returning results requires interpretation.

A query returning zero results doesn't necessarily mean no suspicious activity occurred.

Detection logic may have limitations, telemetry may be incomplete and legitimate administrative activity may resemble suspicious behaviour.

For that reason, I deliberately retained analyst review and investigation as part of the process.

### Developing My Technical Confidence

Perhaps the biggest personal takeaway has been how much my confidence has grown.

I began this journey without practical threat-hunting experience.

Through building the programme, I've gained experience with KQL, Microsoft Sentinel, the MITRE ATT&CK Framework, Azure Logic Apps, watchlists, security reporting and workflow automation.

I also learned that I enjoy the investigative and engineering aspects of cybersecurity, particularly the process of identifying suspicious behaviours and developing ways to detect them.

## 12. Future Improvements

Although the home-lab implementation is functional, there are still several areas I'd like to develop further.

**Strengthening my KQL knowledge:** I want to become more confident writing complex queries independently and optimising their performance.

**Expanding hunting coverage:** The current lab contains ten scenarios. I'd like to introduce additional queries covering other attack techniques and, where practical, broader telemetry sources.

**Improving testing:** I'd like to develop more controlled test scenarios so that I can validate whether queries identify the behaviours they're designed to detect.

**Developing the MITRE ATT&CK coverage model:** I want to make greater use of ATT&CK mappings to identify potential gaps and guide future query development.

**Refining automation and reporting:** There may be opportunities to improve the workflow further, particularly around error handling and analyst review.

These improvements will be approached gradually as I continue developing my technical knowledge.

## 13. Final Thoughts

Looking back, this project represents much more than another addition to my home lab.

It's a reflection of how far I've progressed since first deciding I wanted to work in cybersecurity.

I went from working in IT support and studying for foundational security certifications to becoming a dedicated Cybersecurity Analyst.

Within months of joining my current organisation, I had volunteered to take ownership of an area I knew very little about and developed a structured threat-hunting programme that could support my team.

I then challenged myself to recreate that architecture independently and document the process.

There is still a huge amount I want to learn.

I'm continuing to develop my incident response and investigation skills, and I know that becoming a genuinely capable threat hunter requires much more than simply knowing how to run KQL queries.

However, this project has reinforced something I've increasingly come to realise.

**Threat hunting is an area of cybersecurity that I genuinely enjoy, and one I'd love to explore further as my career develops.**

For now, I'm proud of what I've built, what I've learned and how a relatively simple decision to volunteer for something new turned into one of my most significant technical projects so far.

However… as I began thinking about how to share this project, I realised that screenshots alone didn't quite capture how everything worked together.

That led me to my next project.

**Project 7 — Interactive Threat Hunting Simulation & Analytics Platform.**

## Project Resources
**Interactive demonstration:** https://threathunting.homelab-sec.com/
**GitHub portfolio:** https://github.com/Katie-sec/HomeLabJournal
**Environment:** Personal Microsoft Azure and Microsoft 365 home lab
**Important:** The home-lab implementation is separate from my employer's production environment. No employer or customer security data is included.
