// Change the text between quotes, save, and commit to GitHub.
// Do not change the keys on the left. This file contains PUBLIC website copy only.
const siteCopy = {
  heroTitle: 'From KQL hunts to investigation-ready results.',
  heroDescription: 'I built an automated threat hunting workflow in Microsoft Sentinel, using Logic Apps to run scheduled queries, record findings and give me a starting point for investigation. Explore the workflow, review the ATT&CK mappings and work through how I investigate the results.',
  investigationTitle: 'From a hunt match to an evidence-based decision',
  investigationIntro: 'When a hunt returns matches, I open the underlying logs to see what actually happened. I work backwards from the scheduled KQL, examine the underlying activity, cross-check the evidence and record my decision.'
};

function applySiteCopy() {
  const selectors = {
    heroTitle: '.hero-copy h2',
    heroDescription: '.hero-copy > p',
    investigationTitle: '.journey-panel .panelhead h2',
    investigationIntro: '.journey-panel .panelhead p'
  };
  for (const [key, selector] of Object.entries(selectors)) {
    const el = document.querySelector(selector);
    if (el && typeof siteCopy[key] === 'string') el.textContent = siteCopy[key];
  }
}
