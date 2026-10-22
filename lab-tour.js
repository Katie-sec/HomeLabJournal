// Public, offline-only implementation tour. No tenant data, secrets or APIs.
(()=>{'use strict';
const steps=labCopy.steps;
let selected=0;const $=id=>document.getElementById(id);const list=$('labSteps');if(!list)return;
function escapeLab(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function richLabText(value){
  const wrapper=document.createElement('div');
  wrapper.className='lab-formatted-copy';
  const lines=String(value||'').replace(/\r\n?/g,'\n').split('\n');
  for(const raw of lines){
    const line=raw.trim();
    if(!line) continue;
    const bullet=line.match(/^(?:[-*•]\s+|\d+[.)]\s+)(.*)$/);
    const content=bullet?bullet[1]:line;
    const p=document.createElement('p');
    p.className=bullet?'lab-formatted-entry':'lab-formatted-paragraph';
    const colon=content.indexOf(':');
    if(bullet && colon>0 && colon<90){
      const strong=document.createElement('strong');
      strong.textContent=content.slice(0,colon+1);
      p.appendChild(strong);
      p.appendChild(document.createTextNode(content.slice(colon+1)));
    }else{p.textContent=content;}
    wrapper.appendChild(p);
  }
  return wrapper.outerHTML;
}
function showRegisterGallery(){
  const target=document.getElementById('labDetail');
  const section=document.createElement('section');
  section.className='lab-register-gallery';
  section.innerHTML='<div class="eyebrow">REAL HOME-LAB WORKBOOK SCREENSHOTS</div><p class="lab-gallery-intro">Selected screenshots from my home-lab Threat Hunt Register. Click an image to view it at full size.</p>';
  const shots=[
    ['assets/threat-hunt-register/overview-1.png','Workbook Architecture & Analyst Procedures','Workbook structure, automation and review procedure'],
    ['assets/threat-hunt-register/overview-2.png','Query Maintenance & Operational Standards','Query maintenance, triage and analyst responsibilities'],
    ['assets/threat-hunt-register/catalogue.png','Query Catalogue','Hunt definitions, data sources and proposed ATT&CK mappings'],
    ['assets/threat-hunt-register/weekly-log.png','Weekly Hunt Data Log','Automated results, zero-match notes and highlighted findings']
  ];
  const grid=document.createElement('div');grid.className='lab-gallery-grid';
  for(const [src,title,desc] of shots){
    const a=document.createElement('a');a.href=src;a.target='_blank';a.rel='noopener noreferrer';a.className='lab-gallery-item';
    const img=document.createElement('img');img.src=src;img.alt=title+' screenshot';img.loading='lazy';
    const label=document.createElement('strong');label.textContent=title;
    const note=document.createElement('small');note.textContent=desc;
    a.append(img,label,note);grid.appendChild(a);
  }
  section.appendChild(grid);target.appendChild(section);
}
function draw(){list.innerHTML='';steps.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='lab-step'+(i===selected?' active':'');b.innerHTML='<span class="number">'+String(i+1).padStart(2,'0')+'</span><span><b>'+escapeLab(s.title)+'</b><small>'+escapeLab(s.short)+'</small></span>';b.addEventListener('click',()=>{selected=i;draw()});list.appendChild(b)});const s=steps[selected];$('labTitle').textContent=s.title;$('labSubtitle').textContent='Component '+(selected+1)+' of '+steps.length;$('labDetail').innerHTML='<div class="eyebrow">WHAT IT DOES</div><div data-lab-step="purpose">'+richLabText(s.purpose)+'</div><div class="eyebrow">INPUT → OUTPUT</div><p><strong data-lab-step="input">'+escapeLab(s.input)+'</strong> → <span data-lab-step="output">'+escapeLab(s.output)+'</span></p><div class="eyebrow">WHY I BUILT IT THIS WAY</div><div data-lab-step="why">'+richLabText(s.why)+'</div><div class="eyebrow">IMPLEMENTATION EVIDENCE</div><div data-lab-step="verify">'+richLabText(s.verify)+'</div>';if(selected===4)showRegisterGallery();$('labPrev').disabled=selected===0;$('labNext').textContent=selected===steps.length-1?'Back to start ↺':'Next component →'}
function navigateComponent(index){selected=index;draw();const tour=list.closest('.lab-grid');if(tour)tour.scrollIntoView({block:'start',behavior:'instant'});}
$('labPrev').addEventListener('click',()=>navigateComponent(Math.max(0,selected-1)));$('labNext').addEventListener('click',()=>navigateComponent((selected+1)%steps.length));
for(const [key,value] of Object.entries(labCopy.static)){const el=document.querySelector('[data-lab-copy="'+key+'"]');if(el)el.textContent=value;}
draw();
})();
