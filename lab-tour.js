// Public, offline-only implementation tour. No tenant data, secrets or APIs.
(()=>{'use strict';
const steps=labCopy.steps;
let selected=0;const $=id=>document.getElementById(id);const list=$('labSteps');if(!list)return;
function escapeLab(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function draw(){list.innerHTML='';steps.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.className='lab-step'+(i===selected?' active':'');b.innerHTML='<span class="number">'+String(i+1).padStart(2,'0')+'</span><span><b>'+escapeLab(s.title)+'</b><small>'+escapeLab(s.short)+'</small></span>';b.addEventListener('click',()=>{selected=i;draw()});list.appendChild(b)});const s=steps[selected];$('labTitle').textContent=s.title;$('labSubtitle').textContent='Component '+(selected+1)+' of '+steps.length;$('labDetail').innerHTML='<div class="eyebrow">WHAT IT DOES</div><p data-lab-step="purpose">'+escapeLab(s.purpose)+'</p><div class="eyebrow">INPUT → OUTPUT</div><p><strong data-lab-step="input">'+escapeLab(s.input)+'</strong> → <span data-lab-step="output">'+escapeLab(s.output)+'</span></p><div class="eyebrow">WHY I BUILT IT THIS WAY</div><p data-lab-step="why">'+escapeLab(s.why)+'</p><div class="eyebrow">IMPLEMENTATION EVIDENCE</div><p data-lab-step="verify">'+escapeLab(s.verify)+'</p>';$('labPrev').disabled=selected===0;$('labNext').textContent=selected===steps.length-1?'Back to start ↺':'Next component →'}
$('labPrev').addEventListener('click',()=>{selected=Math.max(0,selected-1);draw()});$('labNext').addEventListener('click',()=>{selected=(selected+1)%steps.length;draw()});
for(const [key,value] of Object.entries(labCopy.static)){const el=document.querySelector('[data-lab-copy="'+key+'"]');if(el)el.textContent=value;}
draw();
})();
