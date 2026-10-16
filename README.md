# Project 6 — Editable GitHub Pages Website

This is the **Version 10 design**, reorganised into editable files. It is a public, offline-safe portfolio simulation and does not connect to Sentinel, Excel or Azure.

## Update the site directly on GitHub

1. Open the repository and select the file you want to edit.
2. Click the pencil **Edit this file** button.
3. Make your changes, then choose **Commit changes**.
4. Wait for GitHub Pages to deploy the new commit. Refresh the site.

### What to edit

| File | Purpose |
|---|---|
| `data/site-copy.js` | Landing-page headline and introduction, investigation introduction |
| `data/catalog.js` | Hunt names, descriptions, ATT&CK mappings, priority and simulated counts |
| `data/walkthroughs.js` | Workflow descriptions and zero-result investigation explanations |
| `styles.css` | Colour scheme, layout and typography |
| `app.js` | Website behaviour and more detailed interactive walkthrough content |
| `index.html` | Page structure and static labels |

**Adding a new hunt is not yet a single-click action.** The existing simulation assumes ten hunts in several places, so adding TH-011 will need a further update to the data model. Do not simply add an eleventh row without checking all scenarios and walkthroughs. This is Phase 1: editable existing content.

## Deploying without losing the live site

Your current Pages site uses the repository-root `index.html`. Upload the **contents** of this package to the repository root (not the enclosing directory), replacing the existing `index.html`. The other files and `data` folder must be uploaded too.

**Safer option:** create a branch called `editable-site-preview` and upload there first, then merge after checking the preview or testing locally. Back up your original `index.html` before replacement.

## Privacy and publication

All files in this public repository can be read by anyone. Never add credentials, personal user identifiers, private workbook data, actual incident logs or unapproved KQL. All demo identities and results must remain fictional.

## Future phases

- A structured, extensible catalogue for TH-011 onward
- A review-and-approval publishing workflow from the private register to GitHub
- Full Project 6 architecture and write-up
