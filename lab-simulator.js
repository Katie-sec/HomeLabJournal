// Offline demonstration. No Azure, Microsoft 365, Graph or external calls.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  if (!$('labPipeline')) return;
  const hunts = [
    ['TH-001','Entra ID Group Management Activity',7],
    ['TH-002','Privileged Role Assignment Activity',7],
    ['TH-003','Failed Sign-ins Followed by Success',0],
    ['TH-004','Conditional Access Policy Changes',0],
    ['TH-005','Application and Service Principal Changes',2],
    ['TH-006','Suspicious Sign-ins from Multiple IP Addresses',0],
    ['TH-007','Entra ID User Creation by Unauthorised Accounts',0],
    ['TH-008','Non-owner Mailbox Access Activity',0],
    ['TH-009','External Mail Forwarding Destinations',0],
    ['TH-010','Privileged Group Membership Changes',0]
  ];
  const watchlistNotes = {
    "TH-001": "No Entra ID group creation, membership or ownership changes matching the configured hunt criteria were identified during the reporting period.",
    "TH-002": "No matching privileged role assignment events were identified within the configured seven-day reporting period.",
    "TH-003": "No authentication sequences meeting the configured failed sign-in threshold followed by successful authentication were identified.",
    "TH-004": "No successful Conditional Access policy creation, modification or deletion events matching the hunt criteria were identified.",
    "TH-005": "No application or service principal changes matching the configured detection criteria were identified.",
    "TH-006": "No accounts were identified with successful sign-ins from three or more distinct IP addresses within the configured one-hour windows.",
    "TH-007": "No successful Entra ID user creation events initiated by identities outside the configured approved creator list were identified.",
    "TH-008": "No mailbox access events meeting the configured non-owner access criteria were identified in the available Exchange audit telemetry.",
    "TH-009": "No Exchange forwarding configuration changes matching the configured search criteria were identified.",
    "TH-010": "No membership or ownership changes matching the configured sensitive group list were identified."
};
  const reviewTuning = "No tuning indicated by this run - Review Periodically.";
  const stages = [
    ['Recurrence','Weekly schedule initiates the hunting cycle'],
    ['Run query and list results','Azure Monitor Logs · ten aggregated KQL hunts'],
    ['Fetch ThreatHuntingReview Register Data','Sentinel watchlist reference rows'],
    ['Initialize variables','Prepare execution date and result fields'],
    ['For each','Classify ten hunt results sequentially'],
    ['Add a row into a table','Write register formatting / separator'],
    ['Add a row into a table · copy 2','Append the prepared hunt entries'],
    ['Delay','Allow the register update to complete'],
    ['Send an email (V2)','Send completion and review instructions']
  ];
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  let generation = 0, paused = false, running = false, activeStage = -1, activeTab = 'hunts', counts = [], written = 0, runCount = 0, totalWritten = 0, activeLoopStep = -1, loopProgress = -1;
  const clean = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let simulatedDate = '';
  const runHistory = [];
  let selectedRunId = null;
  let activeRunRecord = null;
  function selectRun(id){
    const record=runHistory.find(r=>r.id===Number(id));
    if(!record)return;
    selectedRunId=record.id;
    $('labRunPicker').value=String(record.id);
    document.querySelectorAll('.lab-run-date').forEach(button=>{
      const active=Number(button.dataset.runId)===record.id;
      button.classList.toggle('selected',active);
      button.setAttribute('aria-pressed',String(active));
    });
    if(activeTab==='hunts')drawData();
    $('labMailBody').className=record.emailHtml?'lab-mail-content':'lab-mail-empty';
    $('labMailBody').innerHTML=record.emailHtml||'This run is in progress. Its completion email will appear here when finished.';
    $('labMailState').textContent=record.emailHtml?'Delivered (simulation)':'Pending';
    $('labMailState').classList.toggle('sent',Boolean(record.emailHtml));
    const list=$('labEventLog');list.replaceChildren();
    for(const message of record.logs){const li=document.createElement('li');li.textContent=message;list.appendChild(li);}
    if(!record.logs.length){const li=document.createElement('li');li.textContent='Waiting for execution events…';list.appendChild(li);}
    $('labViewingRun').textContent=`Viewing run ${record.id} · ${record.scenario} · ${record.date}${record.emailHtml?'':' (in progress)'}`;
  }
  function addRunChoice(record){
    const option=document.createElement('option');option.value=String(record.id);
    option.textContent=`Run ${record.id} · ${record.date} · ${record.scenario}`;
    $('labRunPicker').appendChild(option);
  }
  function captureMail(){
    if(!activeRunRecord)return;
    activeRunRecord.emailHtml=$('labMailBody').innerHTML;
    if(selectedRunId===activeRunRecord.id)selectRun(selectedRunId);
  }
  function currentRunDate(){return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}
  function status(value){$('labRunStatus').textContent=value;}
  function log(message){
    if(activeRunRecord)activeRunRecord.logs.push(message);
    if(!activeRunRecord||selectedRunId!==activeRunRecord.id)return;
    const item=document.createElement('li');item.textContent=message;
    const list=$('labEventLog');
    if(list.children.length===1&&list.firstElementChild.textContent==='Waiting for execution events…')list.replaceChildren();
    list.appendChild(item);
  }
  function drawPipeline(){
    $('labPipeline').innerHTML=stages.map((s,i)=>`<div class="lab-pipe-node ${i===activeStage?'processing':i<activeStage?'complete':''}" data-stage="${i}"><span class="lab-node-icon">${i<activeStage?'✓':i===activeStage?'◌':i+1}</span><div><b>${clean(s[0])}</b><small>${clean(s[1])}</small></div><span class="lab-node-state">${i<activeStage?'Succeeded':i===activeStage?'Running':'Waiting'}</span></div>${i===4?`<div class="lab-loop-details ${activeStage===4||activeStage===6?'lab-loop-open':''}"><div class="lab-loop-caption">For each · ${loopProgress>=0?'hunt '+(loopProgress+1)+' of 10':'10 hunt results'}</div>${['Filter array','Add a row into a table - Threat Hunt Results','Set variable'].map((name,j)=>`<div class="lab-loop-step ${activeLoopStep===j?'processing':activeLoopStep>j?'complete':''}"><span>${activeLoopStep>j?'✓':activeLoopStep===j?'◌':'·'}</span><b>${name}</b><small>${activeLoopStep===j?'Running':activeLoopStep>j?'Succeeded':'Waiting'}</small></div>`).join('')}</div>`:''}${i<stages.length-1?'<div class="lab-pipe-arrow">↓</div>':''}`).join('');
  }
  function drawData(){
    document.querySelectorAll('[data-labtab]').forEach(b=>b.classList.toggle('active',b.dataset.labtab===activeTab));
    if(activeTab==='hunts'){
      $('labDataPane').innerHTML=`<div class="lab-data-hint">HomeLab Threat Hunt · 10 configured queries</div><table class="lab-mini-table"><thead><tr><th>Query</th><th>Matches</th></tr></thead><tbody>${hunts.map((h,i)=>`<tr><td>${clean(h[0])}<small>${clean(h[1])}</small></td><td>${(runHistory.find(r=>r.id===selectedRunId)?.counts||[]).length?`<span class="${(runHistory.find(r=>r.id===selectedRunId).counts[i])?'lab-match':''}">${runHistory.find(r=>r.id===selectedRunId).counts[i]}</span>`:'—'}</td></tr>`).join('')}</tbody></table>`;
    } else {
      $('labDataPane').innerHTML=`<div class="lab-data-hint">ThreatHunting-ReviewRegister · reference defaults</div><table class="lab-mini-table"><thead><tr><th>SearchKey</th><th>FinalStatus</th><th>LogicTuning</th><th>Notes</th><th>Reviewed By</th></tr></thead><tbody>${hunts.map(h=>`<tr><td>${clean(h[0]+' - '+h[1])}</td><td>No Findings Detected</td><td>${clean(reviewTuning)}</td><td>${clean(watchlistNotes[h[0]])}</td><td>Automated - Pending Review</td></tr>`).join('')}</tbody></table><p class="lab-data-hint">These are illustrative watchlist fields, not a live export. Zero-result defaults are not analyst validation.</p>`;
    }
    resizeDataTable();
  }

  // Drag the right edge of any simulator table header to resize its column.
  // Widths are kept separately for Hunts, Watchlist and Excel and survive redraws.
  const columnWidths = {hunts:{},watchlist:{},excel:{}};
  function resizeTable(table, key){
    if (!table) return;
    table.classList.add('lab-resizable-table');
    const headers = [...table.querySelectorAll('thead th')];
    const saved = columnWidths[key];
    // Explicit starting widths prevent long text from determining the column layout.
    // The user can still drag any column wider or narrower.
    const defaults = {
      hunts: [440, 110],
      watchlist: [355, 170, 390, 1160],
      excel: [48, 160, 330, 150, 135, 690, 170, 300, 195]
    };
    const widths = headers.map((th,i)=>saved[i] || defaults[key]?.[i] || 160);
    let group = table.querySelector('colgroup');
    if(!group){group=document.createElement('colgroup');table.insertBefore(group,table.firstChild);}
    group.replaceChildren(...widths.map(w=>{const col=document.createElement('col');col.style.width=w+'px';return col;}));
    table.style.width=widths.reduce((a,b)=>a+b,0)+'px';
    headers.forEach((th,i)=>{
      th.style.position='relative';
      th.title='Drag right edge to resize column';
      const grip=document.createElement('span');
      grip.className='lab-col-resizer';
      grip.setAttribute('role','separator');
      grip.setAttribute('aria-label','Resize '+th.textContent.trim()+' column');
      grip.setAttribute('aria-orientation','vertical');
      grip.tabIndex=0;
      const apply = width=>{
        const w=Math.max(68,Math.round(width));
        widths[i]=w;saved[i]=w;
        group.children[i].style.width=w+'px';
        table.style.width=widths.reduce((a,b)=>a+b,0)+'px';
      };
      grip.addEventListener('pointerdown',e=>{
        e.preventDefault();e.stopPropagation();
        const startX=e.clientX,startW=widths[i];
        grip.classList.add('dragging');
        grip.setPointerCapture(e.pointerId);
        const move=ev=>apply(startW+ev.clientX-startX);
        const end=()=>{grip.classList.remove('dragging');grip.removeEventListener('pointermove',move);grip.removeEventListener('pointerup',end);grip.removeEventListener('pointercancel',end);};
        grip.addEventListener('pointermove',move);
        grip.addEventListener('pointerup',end);
        grip.addEventListener('pointercancel',end);
      });
      grip.addEventListener('keydown',e=>{
        if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
          e.preventDefault();apply(widths[i]+(e.key==='ArrowRight'?24:-24));
        }
      });
      th.appendChild(grip);
    });
  }
  function resizeDataTable(){
    const table=$('labDataPane').querySelector('table');
    if(table) resizeTable(table,activeTab==='watchlist'?'watchlist':'hunts');
  }
  function renderRow(index){
    const h=hunts[index], n=counts[index], row=document.createElement('tr');
    row.className='lab-sheet-new';row.dataset.runId=String(runCount);
    const note=n?'Matches identified — inspect underlying Sentinel events and verify authorised changes.':watchlistNotes[h[0]];
    const cells=[String(totalWritten+1),index===0?simulatedDate:'',h[0]+' - '+h[1],String(n),n?'Y':'N',n?'':note,n?'':'No Findings Detected',n?'':reviewTuning,'Automated - Pending Review'];
    cells.forEach((v,i)=>{const td=document.createElement('td');const content=document.createElement('span');content.className='lab-cell-content';content.textContent=v;td.title=v;td.appendChild(content);if(i===3&&n)td.className='lab-alert-cell';if(i===4&&n)td.className='lab-alert-cell';if(i===1&&index===0){
      const button=document.createElement('button');button.type='button';button.className='lab-run-date';
      button.dataset.runId=String(runCount);button.textContent=v;
      button.title='View run '+runCount+' results, email and execution log';
      button.setAttribute('aria-label','View results for run '+runCount+' on '+v);
      button.setAttribute('aria-pressed',String(selectedRunId===runCount));
      button.classList.toggle('selected',selectedRunId===runCount);
      td.replaceChildren(button);
      const rowRunId=runCount;button.addEventListener('click',()=>selectRun(rowRunId));
    }
    row.appendChild(td)});
    $('labExcelRows').appendChild(row);totalWritten++;
    written=index+1;$('labRowCount').textContent=`${totalWritten} rows · ${runCount} run${runCount===1?'':'s'}`;$('labExcelStatus').textContent=`Appending row ${written} of 10`;
    // Do not auto-scroll: visitors must be able to inspect earlier runs while a new run appends.
  }
  function email(){
    const findings=counts.filter(x=>x>0).length;
    $('labMailState').textContent='Delivered (simulation)';$('labMailState').classList.add('sent');
    $('labMailBody').className='lab-mail-content';
    $('labMailBody').innerHTML=`<div class="lab-mail-meta"><b>Subject:</b> HomeLab Threat Hunt - ${simulatedDate}<br><b>From:</b> HomeLab SOC automation (simulated)<br><b>To:</b> The analyst (demonstration)</div><h3>HomeLab Threat Hunt Complete</h3><p>The scheduled Microsoft Sentinel threat-hunting workflow has completed, and the Threat Hunt Register has been updated with the latest query results.</p><p><b>10 hunts processed · ${findings} hunts with matching events · ${10-findings} zero-result hunts</b></p><p><span class="lab-mail-link">See here: Threat Hunt Register ↗</span> <small>(illustrative link)</small></p><b>Next Steps:</b><ul><li>Review hunts that returned findings and investigate potentially suspicious activity.</li><li>Validate automated zero-result entries where required.</li><li>Document investigation outcomes, tuning decisions and analyst review status.</li></ul><p class="lab-mail-note">Automated results do not independently confirm malicious or benign activity.</p><small>Fictional email preview — no email was sent.</small>`;
    captureMail();
  }
  async function wait(ms, token){
    let elapsed=0;
    while(elapsed<ms){if(token!==generation)return false;if(paused){await delay(90);continue;}await delay(60);elapsed+=60;}
    return token===generation;
  }
  async function stage(index, label, token, ms=720){activeStage=index;drawPipeline();status(label);log(label);return wait(ms,token)}
  resizeTable(document.querySelector('.lab-sheet'), 'excel');
  function reset(){window.dispatchEvent(new Event('lab-simulation-reset'));generation++;running=false;paused=false;activeStage=-1;counts=[];written=0;runCount=0;totalWritten=0;runHistory.length=0;selectedRunId=null;activeRunRecord=null;$('labRunPicker').innerHTML='<option value="">No completed runs yet</option>';$('labRunPicker').disabled=true;$('labViewingRun').textContent='Run a scenario to explore its results';activeLoopStep=-1;loopProgress=-1;drawPipeline();drawData();$('labExcelRows').innerHTML='<tr class="lab-placeholder"><td colspan="9">Press Start automation to watch results appear in the register…</td></tr>';$('labRowCount').textContent='0 / 10 rows';$('labExcelStatus').textContent='Waiting for automation';$('labMailState').textContent='Not sent';$('labMailState').classList.remove('sent');$('labMailBody').className='lab-mail-empty';$('labMailBody').textContent='The completion email appears here after all ten hunt rows have been appended.';$('labEventLog').innerHTML='<li>Waiting for a simulated run.</li>';$('labReplay').disabled=false;$('labPause').disabled=true;$('labPause').textContent='Ⅱ Pause';$('labScenario').disabled=false;status('Ready to run');}
  async function run(){
    if(running)return;
    // Each new Start adds another reporting block; only Reset clears the workbook.
    generation++;paused=false;activeStage=-1;activeLoopStep=-1;loopProgress=-1;written=0;counts=[];
    simulatedDate=currentRunDate();runCount++;running=true;const token=generation;
    const scenario=$('labScenario').value;
    const scenarioName=$('labScenario').selectedOptions[0].textContent;
    activeRunRecord={id:runCount,date:simulatedDate,scenario:scenarioName,counts:[],logs:[],emailHtml:''};
    runHistory.push(activeRunRecord);addRunChoice(activeRunRecord);
    $('labRunPicker').disabled=false;
    selectedRunId=runCount;
    $('labRunPicker').value=String(runCount);
    $('labViewingRun').textContent=`Viewing run ${runCount} · ${scenarioName} · ${simulatedDate} (in progress)`;
    if(runCount===1){$('labExcelRows').replaceChildren();$('labEventLog').replaceChildren();}
    else {
      const spacer=document.createElement('tr');spacer.className='lab-run-spacer';
      const cell=document.createElement('td');cell.colSpan=9;cell.textContent='';spacer.appendChild(cell);$('labExcelRows').appendChild(spacer);
      const header=document.createElement('tr');header.className='lab-run-repeat-header';
      document.querySelectorAll('.lab-sheet > thead th').forEach(source=>{const th=document.createElement('th');th.textContent=source.childNodes[0]?.textContent?.trim() || source.textContent.trim();th.scope='col';header.appendChild(th);});
      $('labExcelRows').appendChild(header);
      log('──── New hunting cycle · '+simulatedDate+' ────');
    }
    if(selectedRunId===runCount){
      $('labMailState').textContent='Pending';$('labMailState').classList.remove('sent');
      $('labMailBody').className='lab-mail-empty';$('labMailBody').textContent='Waiting for this run to finish…';
    }
    drawPipeline();
    $('labReplay').disabled=true;$('labPause').disabled=false;$('labScenario').disabled=true;
    const scenarioCounts = {
      mixed: [7,7,0,0,2,0,0,0,0,0],
      signin: [0,0,9,0,0,4,0,0,0,0],
      mail: [0,0,0,0,0,0,0,3,2,0],
      privilege: [0,0,0,2,0,0,0,0,0,5],
      account: [3,0,0,0,0,0,1,0,0,0],
      empty: [0,0,0,0,0,0,0,0,0,0]
    };
    const thisRunCounts = scenarioCounts[scenario] || scenarioCounts.empty;
    log('Scenario: '+$('labScenario').selectedOptions[0].textContent);
    if(!await stage(0,'Trigger fired · '+simulatedDate,token))return;
    if(!await stage(1,'Running ten KQL hunts in Log Analytics…',token,1050))return;
    counts=[...thisRunCounts];activeRunRecord.counts=[...thisRunCounts];if(selectedRunId===runCount)drawData();log('Ten aggregated hunt totals returned.');
    if(!await stage(2,'Retrieving review defaults from Sentinel watchlist…',token,1000))return;
    activeTab='watchlist';drawData();
    if(!await stage(3,'Initialising execution date and variables…',token,650))return;
    if(!await stage(4,'Preparing For each · processing ten hunt results…',token,500))return;
    if(!await stage(5,'Preparing the register for this hunting cycle…',token,750))return;
    activeStage=6;drawPipeline();log('Appending ten hunt records to Excel, one at a time.');
    for(let i=0;i<hunts.length;i++){
      loopProgress=i;
      for(let j=0;j<3;j++){
        activeLoopStep=j;drawPipeline();
        status(`${hunts[i][0]} · ${['Filter array','Add a row into a table - Threat Hunt Results','Set variable'][j]}`);
        if(!await wait(210,token))return;
        if(j===1)renderRow(i);
      }
      activeLoopStep=3;drawPipeline();status(`Excel · row ${i+1} of 10 appended`);
      log(`${hunts[i][0]} · ${counts[i]} matches · ${counts[i]?'review required':'default review note applied'}`);
    }
    activeLoopStep=3;drawPipeline();
    if(!await stage(7,'Waiting for workbook updates…',token,950))return;
    if(!await stage(8,'Preparing completion email for the analyst…',token,1000))return;
    if(selectedRunId===runCount){email();}
    else {
      const oldHTML=$('labMailBody').innerHTML,oldClass=$('labMailBody').className;
      email();$('labMailBody').innerHTML=oldHTML;$('labMailBody').className=oldClass;
      selectRun(selectedRunId);
    }
    log('Completion email preview generated. Analyst review is still required.');
    activeStage=stages.length;drawPipeline();status('✓ Simulated automation completed · run '+runCount);$('labExcelStatus').textContent='Saved (simulation)';$('labReplay').disabled=false;$('labPause').disabled=true;$('labScenario').disabled=false;running=false;
    window.dispatchEvent(new CustomEvent('lab-simulation-completed',{detail:{id:activeRunRecord.id,date:activeRunRecord.date,scenario:activeRunRecord.scenario,counts:[...activeRunRecord.counts]}}));
  }
  $('labRunPicker').addEventListener('change',event=>selectRun(event.target.value));
  $('labExcelRows').addEventListener('click',event=>{
    const row=event.target.closest('tr[data-run-id]');
    if(row&&!event.target.closest('button'))selectRun(row.dataset.runId);
  });
  $('labReplay').addEventListener('click',run);
  $('labPause').addEventListener('click',()=>{if(!running)return;paused=!paused;$('labPause').textContent=paused?'▶ Resume':'Ⅱ Pause';status(paused?'Paused · resume to continue':'Running…');});
  $('labReset').addEventListener('click',reset);
  document.querySelectorAll('[data-labtab]').forEach(button=>button.addEventListener('click',()=>{activeTab=button.dataset.labtab;drawData()}));
  reset();
})();
