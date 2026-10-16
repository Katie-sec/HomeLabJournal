
// Public-safe authored dialogue only. No tenant data or credentials.
function resolveJourneyText(template,h,n,g){
 const z=zeroHuntGuides[h.id]||[];
 const values={hunt:h.id,matches:String(n),name:h.name,check:g.check,cross:g.cross,question:g.question,focus:z[0]||'',source:z[1]||'',filters:z[2]||''};
 return String(template).replace(/\{(hunt|matches|name|check|cross|question|focus|source|filters)\}/g,(_,key)=>values[key]);
}

/* Offline portfolio simulation. No network calls, tokens, credentials or real tenant data. */



const $=id=>document.getElementById(id);
const safe=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const date=()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',day:'numeric',month:'long',year:'numeric'}).format(new Date());
let scenario='baseline',selectedHunt='TH-001',selectedStep=1,done=-1,active=-1,running=false,runVersion=0;
const counts=()=>scenarios[scenario];const total=()=>counts().reduce((a,b)=>a+b,0);const flagged=()=>counts().filter(x=>x>0).length;
function kql(h){const lookback='let Lookback = 7d;'; if(h.table==='SigninLogs')return `// Illustrative detection logic; NOT the original lab KQL\n${lookback}\n${h.table}\n| where TimeGenerated >= ago(Lookback)\n| where isnotempty(${h.term})\n| summarize QueryMatches = count() by UserPrincipalName\n| order by QueryMatches desc`;return `// Illustrative detection logic; NOT the original lab KQL\n${lookback}\n${h.table}\n| where TimeGenerated >= ago(Lookback)\n| where OperationName has '${h.term}'\n| project TimeGenerated, OperationName, Result\n| order by TimeGenerated desc`}
function show(page){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id===page));document.querySelectorAll('.nav').forEach(x=>x.classList.toggle('active',x.dataset.page===page));const names={overview:['Overview','Threat hunting overview','Explore a simulated execution of a real home lab automation workflow.'],workflow:['Automation workflow','Automation workflow','Inspect the sequence of Logic App actions and watch a simulated run.'],explorer:['Hunt explorer','Threat hunt explorer','Inspect illustrative KQL and fictional event-level investigation data.'],coverage:['ATT&CK coverage','MITRE ATT&CK coverage','Explore technique mappings, validation status and potential development opportunities.'],register:['Threat Hunt Register','Threat Hunt Register','Browse the simulated Excel output without accessing the real workbook.']};$('crumbPage').textContent=names[page][0];$('pageTitle').textContent=names[page][1];$('pageSub').textContent=names[page][2];}
function renderBars(){$('bars').innerHTML=hunts.map((h,i)=>`<div class="bar"><span>${h.id}</span><div class="track"><div class="fill ${counts()[i]?'hot':''}" style="width:${counts()[i]?Math.max(6,counts()[i]/Math.max(1,...counts())*100):0}%"></div></div><b>${counts()[i]}</b></div>`).join('')}
function renderSummary(){$('summary').innerHTML=`<table><thead><tr><th>Query</th><th>Detection focus</th><th>Matches</th><th>Review status</th><th></th></tr></thead><tbody>${hunts.map((h,i)=>`<tr class="clickrow" data-hunt="${h.id}"><td><b>${h.id}</b></td><td>${safe(h.name)}</td><td>${counts()[i]}</td><td><span class="tag ${counts()[i]?'warn':'muted'}">${counts()[i]?'Investigation required':'Pending validation'}</span></td><td>↗</td></tr>`).join('')}</tbody></table>`}
function renderSteps(){$('miniSteps').innerHTML=steps.map((s,i)=>`<button class="mini-step ${i<=done?'done':''} ${i===active?'active':''}" data-step="${i}" data-openworkflow="1"><span class="step-mark">${i<=done?'✓':i+1}</span><span><strong>${safe(s.name)}</strong><small>${safe(s.output)}</small></span></button>`).join('');$('flow').innerHTML=steps.map((s,i)=>`${i?'<div class="connector"></div>':''}<button class="node ${i===selectedStep?'selected':''} ${i<=done?'complete':''} ${i===active?'active-run':''}" data-step="${i}"><span class="node-icon">${s.icon}</span><span><strong>${safe(s.name)}</strong><small>${safe(s.output)}</small></span><span class="node-state">${i<=done?'✓':i===active?'◷':'○'}</span></button>`).join('');const s=steps[selectedStep];$('inspector').innerHTML=`<div class="eyebrow">STEP ${String(selectedStep+1).padStart(2,'0')} / ${steps.length}</div><h3>${safe(s.name)}</h3><p>${safe(s.desc)}</p><dl><div><dt>Input</dt><dd>${safe(s.input)}</dd></div><div><dt>Output</dt><dd>${safe(s.output)}</dd></div><div><dt>Run state</dt><dd><span class="tag ${selectedStep<=done?'':'muted'}">${selectedStep<=done?'Completed':selectedStep===active?'Running':'Not executed'}</span></dd></div></dl>`}
function renderExplorer(){$('huntList').innerHTML=hunts.map((h,i)=>`<button class="hunt-item ${h.id===selectedHunt?'active':''}" data-hunt="${h.id}"><span><strong>${h.id}</strong><small>${safe(h.name)}</small></span><span class="count">${counts()[i]}</span></button>`).join('');const h=hunts.find(x=>x.id===selectedHunt);$('huntId').textContent=h.id;$('huntName').textContent=h.name;$('huntDescription').textContent=h.detail;$('query').textContent=kql(h);const n=counts()[hunts.indexOf(h)];$('eventCount').textContent=n+' matches';if(!n){$('events').innerHTML='<div class="empty">No matching sample events in this scenario. This does not establish the absence of malicious activity.</div>';return}const users=['alex.analyst@example.com','casey.admin@example.com','jordan.user@example.com','morgan.test@example.com'];const ips=['192.0.2.45','198.51.100.24','203.0.113.17','192.0.2.82'];$('events').innerHTML=`<table><thead><tr><th>Sample timestamp (UTC)</th><th>Fictional user</th><th>Example IP</th><th>Activity</th><th>Review</th></tr></thead><tbody>${Array.from({length:Math.min(n,8)},(_,i)=>`<tr><td>2026-10-14 ${String(8+i).padStart(2,'0')}:12:00</td><td>${users[i%4]}</td><td>${ips[i%4]}</td><td>${safe(h.detail)}</td><td><span class="tag warn">Unreviewed</span></td></tr>`).join('')}</tbody></table><div class="table-footer">Showing ${Math.min(n,8)} of ${n} simulated matches. Events are entirely fictional.</div>`}
function registerRows(){return hunts.map((h,i)=>{const n=counts()[i];return [i===0?date():'',h.id+' - '+h.name,n,n?'Y':'N',n?'':h.notes,n?'':'No Findings Detected',n?'':'No tuning indicated by this run; review periodically.',n?'':'Automated - Pending Review']})}
function renderRegister(){const filter=$('registerFilter').value;const rows=registerRows().filter(r=>filter==='all'||(filter==='matches'?r[2]>0:r[2]===0));$('registerTable').innerHTML=`<table><thead><tr>${['Execution date','Query name','Total query matches','Action required','Notes','Final status','Logic tuning','Reviewed by'].map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((x,i)=>`<td>${i===2&&x>0?'<span class="tag warn">'+x+'</span>':safe(x)}</td>`).join('')}</tr>`).join('')}</tbody></table>`}
function render(){ $('matches').textContent=total();$('flagged').textContent=flagged();renderBars();renderSummary();renderSteps();renderExplorer();renderRegister() }
function reset(){runVersion++;done=-1;active=-1;running=false;$('run').disabled=false;$('run').textContent='▶ Run simulation';$('executionStatus').textContent='Not run';$('executionStatus').className='status-big';$('executionTime').textContent='Awaiting manual simulation';$('log').innerHTML='<div>Ready to run a simulation.</div>';$('logStatus').textContent='Ready';render()}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function run(){if(running)return;running=true;const version=++runVersion;done=-1;active=-1;$('run').disabled=true;$('run').textContent='Running…';$('executionStatus').textContent='Running';$('executionStatus').className='status-big';$('executionTime').textContent='Processing simulated actions';$('log').innerHTML='';$('logStatus').textContent='In progress';show('workflow');for(let i=0;i<steps.length;i++){if(version!==runVersion)return;active=i;selectedStep=i;renderSteps();$('log').insertAdjacentHTML('beforeend',`<div class="info">[${String(i+1).padStart(2,'0')}/${steps.length}] Starting: ${safe(steps[i].name)}</div>`);$('log').scrollTop=$('log').scrollHeight;await sleep(650);if(version!==runVersion)return;done=i;active=-1;$('log').insertAdjacentHTML('beforeend',`<div class="ok">✓ ${safe(steps[i].output)}</div>`);renderSteps()}running=false;$('run').disabled=false;$('run').textContent='↻ Run again';$('executionStatus').textContent='Complete';$('executionStatus').className='status-big success';$('executionTime').textContent=date()+' · simulated';$('logStatus').textContent='Complete';$('log').insertAdjacentHTML('beforeend',`<div class="ok">Completed: ${total()} matches across ${flagged()} hunts. No external actions performed.</div>`);render()}
document.addEventListener('click',e=>{const p=e.target.closest('[data-page]');if(p){show(p.dataset.page);return}const step=e.target.closest('[data-step]');if(step){selectedStep=Number(step.dataset.step);if(step.dataset.openworkflow)show('workflow');renderSteps();return}const h=e.target.closest('[data-hunt]');if(h){selectedHunt=h.dataset.hunt;show('explorer');renderExplorer()}});
$('scenario').addEventListener('change',e=>{scenario=e.target.value;reset()});$('run').addEventListener('click',run);$('registerFilter').addEventListener('change',renderRegister);
$('copyKql').addEventListener('click',async()=>{const t=kql(hunts.find(x=>x.id===selectedHunt));try{await navigator.clipboard.writeText(t);$('copyKql').textContent='✓ Copied';setTimeout(()=>$('copyKql').textContent='Copy KQL',1400)}catch{$('copyKql').textContent='Select text to copy'}});
$('csv').addEventListener('click',()=>{const header=['Execution date','Query name','Total query matches','Action required','Notes','Final status','Logic tuning','Reviewed by'];const csv=[header,...registerRows()].map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');const u=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='fictional-threat-hunt-register.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),500)});
render();


// Catalogue snapshot transcribed from the user's approved metadata (not from live Azure).



let selectedTechnique='T1098';
function renderCoverage(){
 const filter=$('covFilter').value;
 const shown=attackCatalog.filter(h=>filter==='all'||h.status===filter);
 const techniques=[...new Set(attackCatalog.flatMap(h=>h.techniques))];
 $('covHunts').textContent=attackCatalog.length;
 $('covTechniques').textContent=techniques.length;
 $('covReviewed').textContent=attackCatalog.filter(h=>h.status==='Reviewed').length;
 $('covValidated').textContent=attackCatalog.filter(h=>h.validation==='Validated').length;
 $('coverageMatrix').innerHTML=Object.entries(tacticNames).map(([tid,label])=>{
  const techniqueIds=[...new Set(shown.filter(h=>h.tactics.includes(tid)).flatMap(h=>h.techniques))];
  return `<div class="cov-tactic"><div class="cov-tactic-head"><strong>${safe(label)}</strong><small>${tid} · ${techniqueIds.length} mapped</small></div><div class="cov-chips">${techniqueIds.length?techniqueIds.map(t=>{const matches=shown.filter(h=>h.tactics.includes(tid)&&h.techniques.includes(t));const reviewed=matches.some(h=>h.status==='Reviewed');return `<button class="cov-chip ${reviewed?'reviewed':'candidate'} ${selectedTechnique===t?'selected':''}" data-technique="${safe(t)}" title="${safe(techniqueNames[t]||t)}"><b>${safe(t)}</b><span>${safe(techniqueNames[t]||t)}</span><small>${matches.length} hunt${matches.length===1?'':'s'}</small></button>`}).join(''):'<span class="cov-none">No techniques match the selected filter</span>'}</div></div>`
 }).join('');
 renderTechnique();
}
function renderTechnique(){
 const filter=$('covFilter').value;
 const related=attackCatalog.filter(h=>h.techniques.includes(selectedTechnique)&&(filter==='all'||h.status===filter));
 $('coverageDetail').innerHTML=`<div class="eyebrow">TECHNIQUE</div><h3>${safe(selectedTechnique)}</h3><p>${safe(techniqueNames[selectedTechnique]||'Technique mapping')}</p><p><a href="https://attack.mitre.org/techniques/${selectedTechnique.replace('.','/')}/" target="_blank" rel="noopener noreferrer">View in MITRE ATT&CK ↗</a></p><div class="cov-detail-stat">${related.length} mapped hunt${related.length===1?'':'s'} in this view · 0 validated</div>${related.length?related.map(h=>`<button class="cov-hunt" data-openhunt="${safe(h.id)}"><span><b>${safe(h.id)}</b> · ${safe(h.name)}</span><small>${h.status==='Reviewed'?'Mapping reviewed':'Proposed mapping'} · ${safe(h.priority)} priority · ${safe(h.source)} · Untested</small></button>`).join(''):'<p>No hunts match the selected mapping filter.</p>'}<div class="inspector-note">Proposed mapping means the relationship still needs reviewing. Mapping reviewed means I have assessed the query logic against the technique. Neither status confirms detection effectiveness. It does not establish tested detection coverage. All KQL remains private.</div>`;
}
$('covFilter').addEventListener('change',renderCoverage);
document.addEventListener('click',e=>{const t=e.target.closest('[data-technique]');if(t){selectedTechnique=t.dataset.technique;renderCoverage();return}const h=e.target.closest('[data-openhunt]');if(h){selectedHunt=h.dataset.openhunt;show('explorer');renderExplorer()}});
renderCoverage();

// Persist the visitor's display preference locally; no network requests.
(function(){
  const toggle=document.getElementById('themeToggle');
  const root=document.documentElement;
  let initial='light';
  try{initial=localStorage.getItem('homelab-theme')||'light'}catch(e){}
  function setTheme(mode){
    const dark=mode==='dark';
    root.dataset.theme=dark?'dark':'light';
    toggle.innerHTML=dark?'☀ <span>Light mode</span>':'☾ <span>Dark mode</span>';
    toggle.setAttribute('aria-label',dark?'Switch to light mode':'Switch to dark mode');
    toggle.setAttribute('aria-pressed',String(dark));
    try{localStorage.setItem('homelab-theme',dark?'dark':'light')}catch(e){}
  }
  setTheme(initial);
  toggle.addEventListener('click',()=>setTheme(root.dataset.theme==='dark'?'light':'dark'));
})();

// Enrichment: illustrative analyst methodology and catalogue-driven tactic distribution.
const enterpriseTactics=[['TA0043','Reconnaissance'],['TA0042','Resource Development'],['TA0001','Initial Access'],['TA0002','Execution'],['TA0003','Persistence'],['TA0004','Privilege Escalation'],['TA0005','Defense Evasion'],['TA0006','Credential Access'],['TA0007','Discovery'],['TA0008','Lateral Movement'],['TA0009','Collection'],['TA0011','Command and Control'],['TA0010','Exfiltration'],['TA0040','Impact']];
function renderDonut(){const represented=new Set(attackCatalog.flatMap(x=>x.tactics));const n=represented.size, pct=n/enterpriseTactics.length*100;document.getElementById('tacticLegend').innerHTML=`<button data-tacticview="mapped">Mapped tactics <b>${n}</b></button><button data-tacticview="unmapped">Tactics without mapped hunts <b>${enterpriseTactics.length-n}</b></button><div id="tacticList" style="font-size:11px;line-height:1.8;color:#78889b"></div>`;renderTacticList('mapped')}
function renderTacticList(mode){const mapped=new Set(attackCatalog.flatMap(x=>x.tactics));document.getElementById('tacticList').textContent=enterpriseTactics.filter(x=>mapped.has(x[0])===(mode==='mapped')).map(x=>x[1]).join(' · ')}

// Guided offline investigation. All records are fictional; no Azure calls.
const investigationGuides={
 'TH-001':{focus:'group membership or ownership changes',check:'I compare the group and initiator against expected administration and change records.',cross:'I check the initiating account’s Entra sign-in activity and whether the group is privileged.',question:'Was the successful group change approved?',next:'If an unexpected privileged-group change is confirmed, I preserve the audit evidence and escalate. Otherwise I document the approved change and consider tuning.',field:'GroupManagement'},
 'TH-002':{focus:'privileged role assignments',check:'I inspect the assigned role, actor, assignee and whether the action was a PIM activation.',cross:'I review PIM approval or activation history and the actor’s sign-ins.',question:'Was the role assignment authorised?',next:'Unexpected privilege grants warrant escalation and access review.',field:'RoleManagement'},
 'TH-003':{focus:'failed sign-ins followed by a success',check:'I compare failure reasons, the sequence of attempts and the successful sign-in.',cross:'I review the account’s SigninLogs, IP, location, device and MFA/Conditional Access context.',question:'Does the authentication pattern suggest compromise?',next:'If suspicious, I escalate for account and session review; if expected, I document the cause and tune thresholds.',field:'SigninLogs'},
 'TH-004':{focus:'Conditional Access policy modifications',check:'I inspect the policy name, operation, actor and changed properties.',cross:'I check the change approval and relevant Entra audit and sign-in history.',question:'Was the policy change approved and did it weaken controls?',next:'Unapproved security-weakening changes need urgent escalation and policy restoration assessment.',field:'Policy'},
 'TH-005':{focus:'application and service principal changes',check:'I examine the app ID, changed credentials or permissions, initiator and result.',cross:'I compare with change requests, app owners and relevant audit events.',question:'Was this application change expected?',next:'Unexpected credential or permission additions need investigation and potential escalation.',field:'ApplicationManagement'},
 'TH-006':{focus:'sign-ins from multiple IP addresses',check:'I compare IPs, timestamps, devices, session context and successful sign-ins.',cross:'I look for VPN/proxy use, Conditional Access results and unfamiliar devices.',question:'Is there evidence of an unusual account access pattern?',next:'If the pattern remains suspicious after context checks, I escalate for identity investigation.',field:'SigninLogs'},
 'TH-007':{focus:'account creation by non-approved identities',check:'I identify the account created, initiating identity, operation result and context.',cross:'I check the onboarding request, administrative permissions and actor sign-ins.',question:'Was the new account provisioned through an approved process?',next:'Unapproved account creation warrants access review and escalation.',field:'UserManagement'},
 'TH-008':{focus:'non-owner mailbox access',check:'I identify the mailbox, accessor, access operation and whether delegation exists.',cross:'I verify mailbox permissions, approved delegation and associated sign-in activity.',question:'Is the access consistent with approved mailbox delegation?',next:'Unexpected access may require mailbox investigation and escalation.',field:'OfficeActivity'},
 'TH-009':{focus:'external forwarding rules',check:'I inspect the forwarding destination, rule creator and mailbox.',cross:'I check mailbox configuration, approval records and suspicious sign-in history.',question:'Is the external forwarding destination approved?',next:'Unexpected forwarding may require rule removal, mailbox investigation and escalation.',field:'OfficeActivity'},
 'TH-010':{focus:'nested membership in privileged groups',check:'I inspect the nested group, target privileged group and initiating account.',cross:'I verify group sensitivity, access approval and associated audit history.',question:'Was this privileged group nesting approved?',next:'Unexpected privileged nesting warrants immediate access review and escalation.',field:'GroupManagement'}
};

let journeyStep=-1,journeyOpened=false,journeyChoice='',journeyChecked=false;
const fakeEvents=[
 {id:'EVT-1042',time:'14 Oct 2026 08:29:20',operation:'Add member to group',user:'casey.admin@example.com',ip:'192.0.2.45',target:'SG-Project-Access',result:'failure',note:'Permission check failed; no membership change confirmed.'},
 {id:'EVT-1043',time:'14 Oct 2026 08:29:20',operation:'Add owner to group',user:'casey.admin@example.com',ip:'192.0.2.45',target:'SG-Project-Access',result:'success',note:'Successful change. Approval not yet established.'},
 {id:'EVT-1038',time:'13 Oct 2026 09:51:28',operation:'Add group',user:'alex.analyst@example.com',ip:'198.51.100.24',target:'SG-ThreatHunting-Test',result:'success',note:'Example test group; change record still needs checking.'}
];
const demoActors=['casey.admin@example.com','alex.analyst@example.com','jordan.user@example.com','morgan.operator@example.com','taylor.engineer@example.com','riley.support@example.com','sam.audit@example.com'];
const demoIPs=['192.0.2.45','198.51.100.24','203.0.113.17','192.0.2.82','198.51.100.63','203.0.113.51','192.0.2.121'];
const huntEvidence={
'TH-001':{ops:['Add member to group','Add owner to group','Remove member from group','Add group'],targets:['SG-Project-Access','SG-ThreatHunting-Test','SG-Helpdesk-Readers','SG-App-Operators'],notes:['Membership request needs approval verification','Ownership changed, review initiator and target','Removal attempt, check operation result','Test group creation, verify expected activity']},
'TH-002':{ops:['Add eligible member to role','Add member to role','Remove eligible member from role','Activate privileged role'],targets:['Global Reader','Security Administrator','Privileged Role Administrator','Exchange Administrator'],notes:['Check PIM request and eligibility window','Check whether the assignment was approved','Review removal against the access request','Compare activation with PIM history']},
'TH-003':{ops:['Failed sign-ins followed by success','Repeated authentication failures','Successful sign-in after retries'],targets:['jordan.user@example.com','morgan.operator@example.com','riley.support@example.com'],notes:['Compare failure codes with subsequent successful sign-in','Check IP continuity and MFA details','Check device and session history']},
'TH-004':{ops:['Update conditional access policy','Add conditional access policy','Delete conditional access policy'],targets:['CA-Require-MFA','CA-Block-Legacy-Auth','CA-Admin-Protection'],notes:['Review modified policy controls and change request','Compare the new policy against approved baseline','Check who removed the policy and why']},
'TH-005':{ops:['Add application password','Update service principal','Add application permission'],targets:['App-Reporting-Portal','SPN-Backup-Automation','App-HR-Integration'],notes:['Confirm credential rotation request','Verify service principal owner','Review newly granted permissions']},
'TH-006':{ops:['Sign-in from second IP','Sign-in from third IP','Sign-in from new device'],targets:['jordan.user@example.com','taylor.engineer@example.com','sam.audit@example.com'],notes:['Check VPN or proxy use','Compare device identifiers and timestamps','Check Conditional Access and MFA results']},
'TH-007':{ops:['Add user','Create guest account','Create cloud account'],targets:['new.starter@example.com','guest.vendor@example.com','temp.contractor@example.com'],notes:['Check onboarding ticket and creator permissions','Confirm guest invitation approval','Verify account creation request']},
'TH-008':{ops:['MailItemsAccessed','Mailbox accessed by delegate','Mailbox item access'],targets:['shared.finance@example.com','support.queue@example.com','operations@example.com'],notes:['Check delegate permissions and mailbox audit details','Compare access with approved shared mailbox use','Review accessor identity and mailbox owner']},
'TH-009':{ops:['New-InboxRule','Set-InboxRule','Set-Mailbox forwarding'],targets:['reports@external.example.com','alerts@partner.example.com','archive@vendor.example.com'],notes:['Confirm external forwarding destination approval','Review the rule creator and conditions','Check mailbox-level forwarding settings']},
'TH-010':{ops:['Add group to privileged group','Update privileged group membership','Add nested group'],targets:['SG-Tier0-Admins','SG-Identity-Operators','SG-Privileged-Access'],notes:['Check nested group membership and approval','Review privileged group sensitivity','Confirm whether the nested group grants elevated access']}
};
function sampleEvents(h,n){
 if(n<=0)return [];
 const cfg=huntEvidence[h.id]||huntEvidence['TH-001'];
 return Array.from({length:n},(_,i)=>{
   const ix=i%cfg.ops.length;
   const result=(i%4===0)?'failure':'success';
   return {id:`SIM-${h.id}-${String(i+1).padStart(3,'0')}`,time:`14 Oct 2026 ${String(8+Math.floor(i/6)).padStart(2,'0')}:${String((i*7+3)%60).padStart(2,'0')}:20`,operation:cfg.ops[ix],user:demoActors[i%demoActors.length],ip:demoIPs[(i+2)%demoIPs.length],target:cfg.targets[ix%cfg.targets.length],result,note:cfg.notes[ix]+(result==='failure'?'. Operation failed, confirm whether any change occurred.':'. Successful operation, authorisation not yet confirmed.'),device:['LAB-WIN11-01','LAB-VM-02','LAB-TEST-CLIENT','LAB-ADMIN-WS'][i%4],correlation:['Sample change request: pending verification','Sample sign-in context: needs review','Sample approval: not supplied','Sample PIM/audit record: requires correlation'][i%4]};
 });
}
let journeyEventIndex=0;
function journeyContext(){const h=hunts.find(x=>x.id===selectedHunt);const n=counts()[hunts.indexOf(h)];$('journeyHuntTitle').textContent=h.id+' · '+h.name;$('journeyHuntContext').textContent=`${n} simulated matches in this scenario · ${h.table} · select Start to follow my investigation.`}
function jButton(label,fn,primary=false){return `<button type="button" class="${primary?'primary':''}" data-jact="${fn}">${label}</button>`}
function renderJourney(){journeyContext();if(journeyStep<0){$('journeyApp').innerHTML='<div class="journey-empty">Select <b>Start investigation</b> to work through the finding with me, one action at a time.</div>';return}
const h=hunts.find(x=>x.id===selectedHunt),n=counts()[hunts.indexOf(h)],g=investigationGuides[h.id],one=h.id==='TH-001';const labels=n===0?['Review the zero result','Check the KQL scope','Verify the data source','Record the outcome']:['Review the hunt result','Open the KQL','Inspect matching events','Expand an event','Cross-check the evidence','Decide next steps','Document the outcome'];let body='';
if(n===0){
const [subject,source,filters,approach,note]=zeroHuntGuides[h.id];
const stages=[
`<p>My scheduled <b>${safe(h.id)}</b> hunt looks for <b>${safe(subject)}</b>. This simulated run returned <b>zero matches</b>. I would first check whether that makes sense for this type of activity.</p><div class="journey-result"><b>Register:</b> ${safe(h.id)} · 0 matches · Review pending</div><div class="journey-hint">Next: Look at what this specific hunt is designed to find.</div>`,
`<p>I open the KQL for <b>${safe(h.id)}</b> and work backwards from the final count. In this case I'm particularly interested in <b>${safe(filters)}</b>.</p><div class="journey-detail"><b>What I'm checking</b><dl><dt>Hunt objective</dt><dd>${safe(subject)}</dd><dt>Filters to review</dt><dd>${safe(filters)}</dd><dt>What I'd do</dt><dd>${safe(approach)}</dd></dl></div><div class="journey-hint">Next: Verify the underlying data before interpreting the zero.</div>`,
`<p>Now I'd check <b>${safe(source)}</b> for recent activity. I would start broadly, then reapply the hunt's filters to see whether a condition or threshold excluded the events.</p><div class="journey-code">${safe(`// Illustrative telemetry check, not the original ${h.id} query\n${h.table}\n| where TimeGenerated > ago(7d)\n| summarize Rows=count(), Latest=max(TimeGenerated)`)}</div><div class="journey-detail"><b>My next check</b><dl><dt>Telemetry</dt><dd>${safe(source)}</dd><dt>Query-specific check</dt><dd>${safe(approach)}</dd><dt>What zero means</dt><dd>Although this query returned 0 results, I still need to check whether it's been tuned correctly and whether any relevant events are being missed.</dd></dl></div><div class="journey-hint">No matching event is displayed because the selected hunt returned zero.</div>`,
`<p>I would record the outcome against <b>${safe(h.id)}</b>, including any filter or ingestion checks still outstanding. I wouldn't mark the detection as validated just because the query returned nothing.</p><div class="journey-result success"><b>Example note for my register:</b> ${safe(note)}</div><div class="journey-actions">${jButton('Restart walkthrough','restart',true)}${jButton('Choose another hunt','browse')}</div>`
];const step=Math.min(journeyStep,3);if(typeof journeyDialogue!=='undefined' && journeyDialogue[h.id]?.zero?.[step]){const copy=journeyDialogue[h.id].zero[step];stages[step]=stages[step].replace(/<p>[\s\S]*?<\/p>/,`<p>${safe(resolveJourneyText(copy,h,n,g))}</p>`)}$('journeyApp').innerHTML=`<div class="journey-progress" aria-label="Investigation step ${step+1} of 4">${labels.map((x,i)=>`<span class="${i<step?'passed':i===step?'current':''}" title="${x}"></span>`).join('')}</div><div class="journey-stage"><div class="journey-kicker">Step ${step+1} of 4 · ${safe(h.id)} review</div><h3>${labels[step]}</h3>${stages[step]}${step<3?`<div class="journey-actions">${jButton('Continue →','next',true)}</div>`:''}${step>0?`<div class="journey-actions">${jButton('← Back one step','back')}</div>`:''}</div>`;return;
}

if(journeyStep===0)body=`<p>My Logic App runs the scheduled hunts and writes the totals to the register. For <b>${safe(h.id)}</b>, it reports <b>${n} matches</b> in this fictional scenario.</p><div class="journey-result"><b>What I know:</b> The query matched ${n} ${n===1?'row':'rows'}. I don't yet know whether the activity was successful, expected or malicious.</div><div class="journey-hint">Next step: Open the query behind this number. First I check what the query actually returned.</div><div class="journey-actions">${jButton('Open the KQL →','next',true)}</div>`;
if(journeyStep===1)body=`<p>In my scheduled master query, the last stages reduce the events to a count. To investigate, I remove the final <code>summarize</code> and <code>extend QueryName</code> stages and return the event-level fields.</p><div class="journey-code">${safe(one?`// TH-001 — aggregation used by my automation
let TH001 = AuditLogs
| where TimeGenerated > ago(7d)
| where Category == "GroupManagement"
| where OperationName in~ ("Add group", "Delete group", "Update group", "Add member to group", "Remove member from group", "Add owner to group", "Remove owner from group")
| summarize Total = count()
| extend QueryName = "TH-001 - Entra ID Group Management Activity";`:`// Illustrative structure, not my original ${h.id} KQL
${h.table}
| where TimeGenerated > ago(7d)
// Apply hunt-specific filters for ${g.focus}
| summarize Total = count()
| extend QueryName = "${h.id} - ${h.name}"`)}</div><div class="journey-hint">Next step: Remove the aggregation so I can see individual events rather than just the total.</div><div class="journey-actions">${jButton('Remove summarize and show events →','next',true)}</div>`;
if(journeyStep===2){let code=one?`// TH-001 — event-level KQL based on my Sentinel investigation
AuditLogs
| where TimeGenerated > ago(7d)
| where Category == "GroupManagement"
| where OperationName has_any ("Add group", "Add member to group", "Remove member from group", "Add owner to group")
| extend InitiatingUser = tostring(InitiatedBy.user.userPrincipalName)
| extend SourceIP = tostring(InitiatedBy.user.ipAddress)
| mv-expand TargetResources
| extend TargetName = tostring(TargetResources.displayName)
| project TimeGenerated, OperationName, InitiatingUser, SourceIP, TargetName, Result
| order by TimeGenerated desc`:`// Illustrative investigation template — not original KQL
${h.table}
| where TimeGenerated > ago(7d)
// Apply the original ${h.id} detection conditions
| project TimeGenerated, *
| order by TimeGenerated desc`;
body=`<p>Now I can inspect the underlying activity. ${one?'My actual TH-001 investigation uses <code>mv-expand TargetResources</code> and projects the actor, IP, target and result.':'For this hunt, I would adapt the projection to the available event fields.'} The sample rows below are <b>fictional</b>, with different accounts, assets and outcomes. Select any row to inspect its details.</p><div class="journey-code">${safe(code)}</div><div class="journey-hint">Next step: Select <b>View event details</b> on a row. Look closely at the result — not every matched operation succeeded.</div><div style="overflow-x:auto"><table class="journey-table"><thead><tr><th>Time (UTC)</th><th>Operation</th><th>User</th><th>Target / asset</th><th>Result</th><th>Evidence</th></tr></thead><tbody>${sampleEvents(h,n).slice(0,12).map((r,i)=>`<tr class="sample-event-row" data-jact="inspect:${i}" tabindex="0" title="Open full event details"><td>${r.time}</td><td>${safe(r.operation)}</td><td>${safe(r.user)}</td><td>${safe(r.target)}</td><td>${r.result}</td><td><button data-jact="inspect:${i}">View event details ↗</button></td></tr>`).join('')||'<tr><td colspan="6">No matching simulated events. I would still verify ingestion and the query scope.</td></tr>'}</tbody></table></div>${journeyOpened?detailHTML():''}<div class="journey-actions">${jButton('Continue to evidence review →','next',true)}</div>`}
if(journeyStep===3)body=`<p>Before deciding what this means, I examine the actor, target, timestamp, result and any expanded properties. ${safe(g.check)}</p>${detailHTML()}<div class="journey-hint">Next step: Compare the result and target with what the scheduled count told you. A failed attempt and a successful change are not the same finding.</div><div class="journey-actions">${jButton('Check related sign-ins / approvals →','next',true)}</div>`;
if(journeyStep===4)body=`<p>${safe(g.cross)}</p><div class="journey-result"><b>Fictional correlation:</b> A related sign-in could help establish the account's activity around the event, but a successful authentication doesn't prove an administrative change was authorised. The actual correlation would need to be checked in Sentinel.</div><div class="journey-detail"><b>My next checks</b><dl><dt>Identity</dt><dd>Actor's sign-in timeline, MFA and Conditional Access context where available</dd><dt>Authorisation</dt><dd>Change request, access approval or PIM activity as applicable</dd><dt>Scope</dt><dd>Whether the target is privileged or sensitive</dd><dt>Audit reliability</dt><dd>Check the original event ID: <code>mv-expand</code> may create multiple rows per audit operation</dd></dl></div><div class="journey-hint">Next step: Decide what the available evidence supports. A successful sign-in isn't the same as an authorised administrative change.</div><div class="journey-actions">${jButton('Assess the finding →','next',true)}</div>`;
if(journeyStep===5)body=`<p><b>${safe(g.question)}</b> I use the surrounding evidence to decide what to do next.</p><div class="journey-choice"><button data-jact="choice:approved">I found an approved change / expected activity</button><button data-jact="choice:suspicious">I found an unexpected successful change</button><button data-jact="choice:unclear">The evidence is incomplete; I need further checks</button></div>${journeyChoice?`<div class="journey-result ${journeyChoice==='approved'?'success':''}"><b>My decision:</b> ${journeyChoice==='approved'?'I would record this as expected activity, reference the approval and consider tuning if it creates repeat noise.':journeyChoice==='suspicious'?safe(g.next):'I would keep the finding open, gather additional audit and sign-in evidence and escalate if the risk or urgency warrants it.'}</div><div class="journey-actions">${jButton('Document my outcome →','next',true)}</div>`:''}`;
if(journeyStep===6)body=`<p>I finish by recording what I found, which evidence I checked and why I reached my conclusion. I also consider whether the hunt needs refining.</p><div class="journey-detail"><b>Example register notes — fictional</b><dl><dt>Hunt</dt><dd>${safe(h.id)} · ${safe(h.name)}</dd><dt>Result</dt><dd>${n} simulated query matches; not ${n} confirmed incidents</dd><dt>Evidence</dt><dd>Sample event records explored and correlation checks outlined</dd><dt>Disposition</dt><dd>${journeyChoice==='approved'?'Expected activity / documented':journeyChoice==='suspicious'?'Potential incident / escalate':'Further validation required'}</dd><dt>Follow-up</dt><dd>${safe(g.next)}</dd><dt>Query improvement</dt><dd>Consider more specific filters, success-only conditions where appropriate, deduplication and reducing known benign activity</dd></dl></div><div class="journey-result success"><b>Walkthrough complete.</b> This walkthrough shows how I would review the evidence and document a decision. </div><div class="journey-actions">${jButton('Restart this walkthrough','restart',true)}${jButton('Explore another hunt','browse')}</div>`;
if(typeof journeyDialogue!=='undefined' && journeyDialogue[h.id]?.positive?.[journeyStep]){body=body.replace(/<p>[\s\S]*?<\/p>/,`<p>${safe(resolveJourneyText(journeyDialogue[h.id].positive[journeyStep],h,n,g))}</p>`)}$('journeyApp').innerHTML=`<div class="journey-progress" aria-label="Investigation step ${journeyStep+1} of 7">${labels.map((x,i)=>`<span class="${i<journeyStep?'passed':i===journeyStep?'current':''}" title="${x}"></span>`).join('')}</div><div class="journey-stage"><div class="journey-kicker">Step ${journeyStep+1} of 7</div><h3>${labels[journeyStep]}</h3>${body}${journeyStep>0?`<div class="journey-actions">${jButton("← Back one step","back")}</div>`:""}</div>`}
function detailHTML(){const h=hunts.find(x=>x.id===selectedHunt);const n=counts()[hunts.indexOf(h)];const r=sampleEvents(h,n)[journeyEventIndex]||sampleEvents(h,n)[0];if(!r)return '<div class="journey-result">No matching event to expand.</div>'; return `<div class="journey-detail"><b>Expanded event — fictional</b><dl><dt>Event ID</dt><dd>${r.id}</dd><dt>Initiating user</dt><dd>${r.user}</dd><dt>Source IP</dt><dd>${r.ip}</dd><dt>Device / asset</dt><dd>${r.device||"LAB-TEST-CLIENT"}</dd><dt>Related evidence</dt><dd>${r.correlation||"Not yet correlated"}</dd><dt>Target resource</dt><dd>${r.target}</dd><dt>Operation</dt><dd>${r.operation}</dd><dt>Result</dt><dd><b>${r.result}</b></dd><dt>My observation</dt><dd>${r.note}</dd></dl></div>`}
$('journeyStart').onclick=()=>{journeyStep=0;journeyOpened=false;journeyChoice='';renderJourney();$('journeyApp').scrollIntoView({behavior:'smooth',block:'nearest'})};
document.addEventListener('click',e=>{const b=e.target.closest('[data-jact]');if(!b)return;const action=b.dataset.jact;if(action==='back'){journeyStep=Math.max(0,journeyStep-1)}else if(action==='next')journeyStep=Math.min(counts()[hunts.findIndex(x=>x.id===selectedHunt)]===0?3:6,journeyStep+1);else if(action.startsWith('inspect:')){journeyEventIndex=Number(action.split(':')[1]);journeyOpened=true}else if(action.startsWith('open:')){journeyEventIndex=Number(action.split(':')[1]);journeyOpened=true;journeyStep=3}else if(action.startsWith('choice:'))journeyChoice=action.split(':')[1];else if(action==='restart'){journeyStep=0;journeyChoice='';journeyOpened=false}else if(action==='browse'){journeyStep=-1;document.getElementById('huntList').scrollIntoView({behavior:'smooth'})}renderJourney()});
const oldRenderExplorer=renderExplorer;renderExplorer=function(){oldRenderExplorer();journeyContext()};
document.addEventListener('click',e=>{const hunt=e.target.closest('[data-hunt]');if(hunt){journeyStep=-1;journeyChoice='';journeyOpened=false;renderJourney()}const t=e.target.closest('[data-tacticview]');if(t)renderTacticList(t.dataset.tacticview)});
renderDonut();renderJourney();
document.addEventListener('click',e=>{const b=e.target.closest('[data-hero-page]');if(b){show(b.dataset.heroPage);window.scrollTo({top:0,behavior:'smooth'})}});
// Punctuation preference for displayed prose only. Never touch executable code or KQL.
(function(){
 const excluded='SCRIPT,STYLE,PRE,CODE,TEXTAREA';
 function tidy(root){
  if(root.nodeType===3){if(root.parentElement && !root.parentElement.closest(excluded) && root.nodeValue.includes(';'))root.nodeValue=root.nodeValue.replace(/;/g,',');return}
  if(root.nodeType!==1 || root.matches(excluded))return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
  nodes.forEach(n=>{if(n.parentElement&&!n.parentElement.closest(excluded)&&n.nodeValue.includes(';'))n.nodeValue=n.nodeValue.replace(/;/g,',')});
 }
 tidy(document.body);
 new MutationObserver(mutations=>mutations.forEach(m=>{
  if(m.type==='characterData')tidy(m.target);
  else m.addedNodes.forEach(n=>tidy(n));
 })).observe(document.body,{childList:true,subtree:true,characterData:true});
})();


applySiteCopy();
