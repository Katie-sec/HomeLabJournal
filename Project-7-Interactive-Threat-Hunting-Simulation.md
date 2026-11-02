
# Project 7 — Interactive Threat Hunting Simulation & Analytics Platform

**Building an interactive website to demonstrate my Microsoft Sentinel threat-hunting workflow without exposing my Azure environment.**

**Technologies:** HTML | CSS | JavaScript | Cloudflare Workers | Cloudflare D1 | Cloudflare Access | Telegram Bot API | AI-assisted development

**Live demonstration:** https://threathunting.homelab-sec.com/

**Related project:** [Project 6 — Microsoft Sentinel Threat Hunting & Automation Lab](Project-6-Microsoft-Sentinel-Threat-Hunting.md)

---

## 1. Introduction — Why I Built the Simulation

After completing my Microsoft Sentinel threat-hunting lab, I began thinking about how I wanted to present the project on GitHub.

My original plan was fairly straightforward.

I'd write up the process, include screenshots of the different Azure components and explain how the automation worked.

However, the more I thought about it, the more I felt that screenshots alone weren't going to do the project justice.

The hunting queries were in Microsoft Sentinel, the automation lived in Azure Logic Apps, and the results were recorded in an Excel workbook.

Everything worked together, but someone viewing my GitHub would have to piece the process together from a collection of screenshots.

I wanted to find a better way to demonstrate it.

At one point, I considered whether visitors could interact directly with my Azure environment.

However, I quickly decided that providing public access to my tenant wasn't a sensible approach.

I didn't want to introduce unnecessary security risks simply to demonstrate a portfolio project.

Instead, I wondered whether I could recreate the experience through an interactive website.

Something that would allow visitors to see how the hunting process worked without needing access to Microsoft Sentinel.

That idea eventually became **my Interactive Threat Hunting Simulation**.

---

## 2. Planning the Simulation

The main objective was to demonstrate the end-to-end hunting workflow developed in Project 6.

I wanted visitors to understand what happened when a scheduled hunt was executed and how the results were processed.

Rather than presenting each Azure component separately, the website would bring the process together in one interface.

The simulation follows the general architecture of my home-lab implementation.

It demonstrates the progression from executing hunting queries through to recording their results and generating a completion notification.

However, the website doesn't execute live KQL queries or connect visitors to my Azure tenant.

Instead, it uses simulated results to demonstrate how the workflow behaves.

**The simulation represents a real architecture, but the activity displayed on the website is illustrative rather than live security telemetry.**

This approach allowed me to make the project publicly accessible without exposing the underlying environment.

---

## 3. Building the Interactive Website

The website was developed as a browser-based simulation.

Visitors can start a simulated hunting run and follow its progress through the different stages of the workflow.

The interface demonstrates how the process moves from query execution to reporting, including how findings are handled differently depending on the results.

For example, a query returning no matches can be associated with predefined reporting information.

A query returning matches is instead presented as requiring analyst attention.

This reflects an important part of my original project.

**Automation should make the analyst's job easier, not replace the investigation itself.**

I wanted that principle to remain visible throughout the simulation.

### Using AI to Help Develop the Website

There is something I want to be transparent about however : I didn't develop this website entirely by myself.

Unlike my previous home-lab projects, I had very little experience with web development. HTML, CSS and JavaScript weren't technologies I was particularly familiar with.
Because of this, I used ChatGPT to help build the website.

I explained what I wanted the simulation to demonstrate, how the original threat-hunting workflow operated and what I wanted visitors to experience.

ChatGPT assisted with generating the code and implementing the functionality, while I focused on defining the requirements, testing the website and identifying changes I wanted to make.

There was plenty of back and forth as I refined the simulation and added new features.

I don't claim to have developed the underlying code independently, nor would I pretend to have a detailed understanding of every part of it.

However, the project gave me an opportunity to explore technologies I wouldn't normally work with and see how they could be used to demonstrate something I'd built within my own area of expertise.

For me, the achievement wasn't learning to become a web developer. It was taking the threat-hunting process I'd developed and finding a way to make it accessible to others.

### Designing the User Experience

One of the main challenges was deciding how much technical information to display.

I wanted the website to be understandable to someone unfamiliar with Microsoft Sentinel, while still being useful to someone with a cybersecurity background.

I also wanted it to feel like an actual demonstration rather than a static diagram.

This meant thinking about how the different stages should be presented and how the interface could explain what was happening.

The website went through several iterations as I refined the layout and the way the workflow was represented.

<img width="1717" height="1270" alt="project7-overview png" src="https://github.com/user-attachments/assets/93d7b991-fbc9-4e88-9a39-86f7dff95e51" />

### Simulating Hunting Results

The simulation uses example hunting results rather than information collected from my tenant.

This means visitors can explore the process without needing a Microsoft account or access to any Azure resources.

The simulated results demonstrate how the reporting process handles different outcomes.

For example, the website can show how a hunting query returning matches would be flagged for investigation.

It can also demonstrate how predefined information supports reporting when a query returns zero results.

The purpose isn't to convince visitors that they're interacting with a live SOC environment.

It's to help them understand how the underlying process works.

<img width="1719" height="1267" alt="interactive simulation png" src="https://github.com/user-attachments/assets/52731f6d-9f20-4442-b4a9-3b06718ba797" />

<img width="1717" height="1267" alt="investigation walkthrough png" src="https://github.com/user-attachments/assets/b76fb7da-379c-4d3e-a3ca-5b151907eecb" />

## 4. Introducing Cloudflare Analytics

Once the interactive website was working, I started wondering whether anyone would actually use it.

After spending so much time building the simulation, I was curious to see whether visitors were interacting with it.

I could have left it there, but I decided this was another opportunity to learn something new.

I began exploring how to record simulation activity.

Eventually, I chose to use Cloudflare Workers and Cloudflare D1.

### Cloudflare Worker

I configured a Cloudflare Worker to receive selected events generated by the website.

The Worker provides a backend component for handling the analytics functionality without requiring the browser to connect directly to the database.

### Cloudflare D1 Database

I used Cloudflare D1 to store the recorded simulation events.

This allows me to review activity such as simulation starts and completions.

It also gave me some practical experience working with a database-backed web application, which was outside the original scope of my cybersecurity home lab.

I found this particularly interesting because the project was gradually introducing me to technologies I wouldn't normally use in my day-to-day security role.

---

## 5. Building a Private Analytics Dashboard

Once the website was recording events, I wanted a way to view the information without manually querying the database.

I developed a separate analytics dashboard to display the collected data.

The dashboard provides an overview of activity recorded by the simulation.

However, I didn't want the analytics interface to be publicly accessible.

Although the public website is designed for anyone to use, the analytics dashboard is intended for my own administration.

I therefore configured **Cloudflare Access** to protect it.

This allows me to restrict access to the dashboard while leaving the simulation itself publicly available.

It also gave me an opportunity to apply access-control principles to a project I'd developed myself.

<img width="1720" height="1264" alt="Cloudflare analytics dashboard png" src="https://github.com/user-attachments/assets/9b8f58ca-cef7-4bea-bb30-d0220a4dcad3" />

## 6. Adding Telegram Notifications

After introducing the analytics dashboard, I had another idea.

What if I could receive a notification whenever someone completed a simulation?

I didn't particularly want to keep checking the dashboard to see whether anything had happened.

So I explored the possibility of integrating Telegram.

Using the Telegram Bot API, I configured the Cloudflare Worker to send a notification when a simulation completion event was successfully recorded.

This meant I could receive updates without needing to manually check the analytics dashboard.

It's a relatively small feature, but it was enjoyable to implement.

It also helped me understand how a web application can interact with an external messaging service.

Of course, a recorded completion doesn't necessarily represent a unique visitor, and the analytics shouldn't be interpreted as an exact count of individual people.

Nevertheless, it provides a useful indication of how the simulation is being used.

<img width="1080" height="786" alt="Telegram Notifications png" src="https://github.com/user-attachments/assets/fa4f01b2-fcb7-4282-b5d0-8843b9404561" />

## 7. Challenges and Lessons Learned

This project was quite different from my previous home-lab work.

Most of my earlier projects had focused on Microsoft 365, Azure administration or cybersecurity operations.

Building an interactive website introduced a different set of challenges.

I had to think about how visitors would experience the project rather than simply whether the underlying technical components worked.

I also needed to consider the separation between the public-facing simulation and the private analytics functionality.

### Keeping the Simulation Separate from Azure

One of the most important design decisions was not providing direct public access to my Azure environment.

Although connecting the website to live telemetry might have made the demonstration feel more realistic, it would also have introduced unnecessary complexity and security considerations.

Using simulated data allowed me to demonstrate the workflow without those risks.

### Learning New Technologies

Cloudflare Workers and D1 were unfamiliar to me when I started exploring the analytics functionality.

I had to learn how the different components worked together and how events could be recorded.

The Telegram integration introduced another new area to explore.

Much like my original threat-hunting project, the website developed through experimentation.

I didn't have every feature planned from the beginning.

New ideas emerged as I became more comfortable with what I was building.

### Thinking Beyond the Technical Implementation

Perhaps the most interesting lesson was realising that building something functional is only part of the challenge.

Being able to explain it clearly is important too.

The original threat-hunting lab worked, but its architecture wasn't particularly easy to demonstrate through screenshots alone.

Building the simulation forced me to think about the workflow from someone else's perspective.

I think that's a useful skill to develop, particularly in cybersecurity, where technical findings often need to be communicated to people with different levels of experience.

---

## 8. Future Improvements

There are several ways I'd like to continue developing the website.

**Expanding the simulation:** I'd like to introduce additional scenarios as I develop more hunting queries within my home lab.

**Improving the interface:** As I gain more experience with web development, I'd like to continue refining how the workflow is presented.

**Developing the analytics functionality:** There may be opportunities to improve how simulation activity is recorded and displayed.

**Keeping the demonstration aligned with Project 6:** As the underlying home-lab architecture evolves, I want the simulation to continue reflecting the process accurately.

---

## 9. Final Thoughts

When I first started documenting my Microsoft Sentinel threat-hunting lab, I was defintely not expecting to end up building an entirely separate website.

My original intention was simply to make the project easier to understand.

However, that idea gradually developed into an interactive simulation with its own analytics system.

It's been a useful reminder that a project doesn't always have to stay within the boundaries of the original plan.

Sometimes the most interesting learning opportunities come from following an idea a little further than you initially intended.

I'm pleased that the finished website allows me to demonstrate the architecture of my threat-hunting programme without exposing my Azure environment.

It also provides a more engaging way for someone visiting my GitHub to understand what I built.

And while this project is quite different from the security operations work that inspired it, I think it complements Project 6 nicely.

**Project 6 demonstrates the threat-hunting process I developed. Project 7 demonstrates how I chose to share it.**

---

## Project Resources

| Resource | Details |
|:---|:---|
| **Live interactive simulation** | https://threathunting.homelab-sec.com/ |
| **Related project** | [Project 6 — Microsoft Sentinel Threat Hunting & Automation Lab](Project-6-Microsoft-Sentinel-Threat-Hunting.md) |
| **GitHub portfolio** | https://github.com/Katie-sec/HomeLabJournal |
| **Important** | The public website is a simulation. It does not execute live queries against my Microsoft Sentinel environment or expose real security telemetry. |
