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
    if(colon>0 && colon<90 && (bullet || /^(Overview & Standards|Query Catalogue|Weekly Hunt Data Log|Monthly Hunt Data Log|Findings & Escalations|Query Amendments & Notes):/.test(content))){
      const strong=document.createElement('strong');
      strong.textContent=content.slice(0,colon+1);
      p.appendChild(strong);
      p.appendChild(document.createTextNode(content.slice(colon+1)));
    }else{p.textContent=content;}
    wrapper.appendChild(p);
  }
  return wrapper.outerHTML;
}
// Image viewer lives inside the page: keyboard arrows, Escape and backdrop close.
let labGalleryState=null;
function closeLabGallery(){
  if(!labGalleryState)return;
  const {overlay,returnFocus,oldOverflow}=labGalleryState;
  overlay.remove();document.body.style.overflow=oldOverflow;
  labGalleryState=null;
  document.removeEventListener('keydown',onLabGalleryKey);
  if(returnFocus && returnFocus.isConnected)returnFocus.focus();
}
function onLabGalleryKey(event){
  if(!labGalleryState)return;
  if(event.key==='Escape'){event.preventDefault();closeLabGallery();}
  else if(event.key==='ArrowRight'){event.preventDefault();moveLabGallery(1);}
  else if(event.key==='ArrowLeft'){event.preventDefault();moveLabGallery(-1);}
  else if(event.key==='Tab'){
    const buttons=[...labGalleryState.overlay.querySelectorAll('button')];
    const first=buttons[0],last=buttons[buttons.length-1];
    if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus();}
  }
}
function moveLabGallery(delta){
  if(!labGalleryState)return;
  labGalleryState.index=(labGalleryState.index+delta+labGalleryState.shots.length)%labGalleryState.shots.length;
  updateLabGallery();
}
function updateLabGallery(){
  const s=labGalleryState;
  if(!s)return;
  const [src,title]=s.shots[s.index];
  s.overlay.querySelector('.lab-lightbox-image').src=src;
  s.overlay.querySelector('.lab-lightbox-image').alt=title+' screenshot';
  s.overlay.querySelector('.lab-lightbox-title').textContent=title;
  s.overlay.querySelector('.lab-lightbox-count').textContent=(s.index+1)+' of '+s.shots.length;
   setLabGalleryZoom(1);
}
 function setLabGalleryZoom(next){
   const s=labGalleryState;if(!s)return;
   s.zoom=Math.max(1,Math.min(5,Math.round(next*10)/10));
   const viewport=s.overlay.querySelector('.lab-lightbox-viewport');
   const image=s.overlay.querySelector('.lab-lightbox-image');
   image.style.width=(s.zoom*100)+'%';
   image.style.maxWidth='none';
   image.style.maxHeight=s.zoom===1?'76vh':'none';
   image.style.height='auto';
   s.overlay.querySelector('.lab-lightbox-zoom-value').textContent=Math.round(s.zoom*100)+'%';
   if(s.zoom===1){viewport.scrollTop=0;viewport.scrollLeft=0;}
 }
function openLabGallery(shots,index,returnFocus){
  closeLabGallery();
  const overlay=document.createElement('div');
  overlay.className='lab-lightbox';overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Workbook screenshot viewer');
  overlay.innerHTML='<div class="lab-lightbox-panel"><div class="lab-lightbox-bar"><strong class="lab-lightbox-title"></strong><span class="lab-lightbox-count"></span><div class="lab-lightbox-zoom-controls"><button type="button" class="lab-lightbox-zoom-out" aria-label="Zoom out">−</button><span class="lab-lightbox-zoom-value">100%</span><button type="button" class="lab-lightbox-zoom-in" aria-label="Zoom in">+</button><button type="button" class="lab-lightbox-zoom-reset" aria-label="Reset zoom">Reset</button></div><button class="lab-lightbox-close" type="button" aria-label="Close image viewer">✕</button></div><div class="lab-lightbox-stage"><button class="lab-lightbox-arrow lab-lightbox-prev" type="button" aria-label="Previous screenshot">‹</button><div class="lab-lightbox-viewport" tabindex="0" aria-label="Zoomed screenshot, scroll to explore"><img class="lab-lightbox-image" alt=""></div><button class="lab-lightbox-arrow lab-lightbox-next" type="button" aria-label="Next screenshot">›</button></div><div class="lab-lightbox-hint">Use + / − to zoom, drag to pan · ← / → to browse · Esc to close</div></div>';
  overlay.addEventListener('click',event=>{if(event.target===overlay)closeLabGallery();});
  overlay.querySelector('.lab-lightbox-close').addEventListener('click',closeLabGallery);
  overlay.querySelector('.lab-lightbox-prev').addEventListener('click',()=>moveLabGallery(-1));
  overlay.querySelector('.lab-lightbox-next').addEventListener('click',()=>moveLabGallery(1));
   overlay.querySelector('.lab-lightbox-zoom-in').addEventListener('click',()=>setLabGalleryZoom(labGalleryState.zoom+0.5));
   overlay.querySelector('.lab-lightbox-zoom-out').addEventListener('click',()=>setLabGalleryZoom(labGalleryState.zoom-0.5));
   overlay.querySelector('.lab-lightbox-zoom-reset').addEventListener('click',()=>setLabGalleryZoom(1));
   const viewport=overlay.querySelector('.lab-lightbox-viewport');
   viewport.addEventListener('wheel',e=>{if(e.ctrlKey||e.metaKey){e.preventDefault();setLabGalleryZoom(labGalleryState.zoom+(e.deltaY<0?0.25:-0.25));}},{passive:false});
   let dragging=false,startX=0,startY=0,left=0,top=0;
   viewport.addEventListener('pointerdown',e=>{if(!labGalleryState||labGalleryState.zoom===1)return;dragging=true;startX=e.clientX;startY=e.clientY;left=viewport.scrollLeft;top=viewport.scrollTop;viewport.setPointerCapture(e.pointerId);viewport.style.cursor='grabbing';});
   viewport.addEventListener('pointermove',e=>{if(dragging){viewport.scrollLeft=left-(e.clientX-startX);viewport.scrollTop=top-(e.clientY-startY);}});
   const endDrag=()=>{dragging=false;viewport.style.cursor='grab';};viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);
  const oldOverflow=document.body.style.overflow;
  document.body.appendChild(overlay);document.body.style.overflow='hidden';
  labGalleryState={overlay,shots,index,returnFocus,oldOverflow,zoom:1};
  updateLabGallery();document.addEventListener('keydown',onLabGalleryKey);
  overlay.querySelector('.lab-lightbox-close').focus();
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
    const button=document.createElement('button');button.type='button';button.className='lab-gallery-item lab-gallery-open';
    button.setAttribute('aria-label','View '+title+' screenshot');
    const img=document.createElement('img');img.src=src;img.alt=title+' screenshot';img.loading='lazy';
    const label=document.createElement('strong');label.textContent=title;
    const note=document.createElement('small');note.textContent=desc;
    button.append(img,label,note);button.addEventListener('click',()=>openLabGallery(shots,shots.findIndex(s=>s[0]===src),button));grid.appendChild(button);
  }
  section.appendChild(grid);target.appendChild(section);
}
function draw(){list.innerHTML='';steps.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='lab-step'+(i===selected?' active':'');b.innerHTML='<span class="number">'+String(i+1).padStart(2,'0')+'</span><span><b>'+escapeLab(s.title)+'</b><small>'+escapeLab(s.short)+'</small></span>';b.addEventListener('click',()=>{selected=i;draw()});list.appendChild(b)});const s=steps[selected];$('labTitle').textContent=s.title;$('labSubtitle').textContent='Component '+(selected+1)+' of '+steps.length;$('labDetail').innerHTML='<div class="eyebrow">WHAT IT DOES</div><div data-lab-step="purpose">'+richLabText(s.purpose)+'</div><div class="eyebrow">INPUT → OUTPUT</div><p><strong data-lab-step="input">'+escapeLab(s.input)+'</strong> → <span data-lab-step="output">'+escapeLab(s.output)+'</span></p><div class="eyebrow">WHY I BUILT IT THIS WAY</div><div data-lab-step="why">'+richLabText(s.why)+'</div><div class="eyebrow">IMPLEMENTATION EVIDENCE</div><div data-lab-step="verify">'+richLabText(s.verify)+'</div>';if(selected===4)showRegisterGallery();$('labPrev').disabled=selected===0;$('labNext').textContent=selected===steps.length-1?'Back to start ↺':'Next component →'}
function navigateComponent(index){selected=index;draw();const tour=list.closest('.lab-grid');if(tour)tour.scrollIntoView({block:'start',behavior:'instant'});}
$('labPrev').addEventListener('click',()=>navigateComponent(Math.max(0,selected-1)));$('labNext').addEventListener('click',()=>navigateComponent((selected+1)%steps.length));
for(const [key,value] of Object.entries(labCopy.static)){const el=document.querySelector('[data-lab-copy="'+key+'"]');if(el)el.textContent=value;}
draw();
})();
