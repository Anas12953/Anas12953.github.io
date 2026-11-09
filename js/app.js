import {createMotion} from './motion.js';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const storage={get(k){try{return localStorage.getItem('anas-v2-'+k);}catch{return null;}},set(k,v){try{localStorage.setItem('anas-v2-'+k,v);}catch{}}};
const system=matchMedia('(prefers-reduced-motion: reduce)');
let motion=storage.get('motion')!=='off'&&!system.matches;
let cursor=null,customCursor=storage.get('cursor')!=='native',audio=null,sound=false,soundLoading=null;
const subscribers=new Set();
const context={isMotion:()=>motion,onMotion(fn){subscribers.add(fn);return()=>subscribers.delete(fn);},notify,play(type){if(sound)audio?.play(type)},stopScroll(){scrolling.stop()}};
document.documentElement.dataset.motion=motion?'on':'off';
const scrolling=createMotion(context);
let toastTimer;
function notify(message){const el=$('.toast');if(!el)return;el.textContent=message;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),4200);}
function syncControls(){
 $$('button[data-motion]').forEach(b=>{b.setAttribute('aria-pressed',String(motion));b.querySelector('span').textContent=motion?'on':'off';});
 $$('[data-cursor]').forEach(b=>{const active=customCursor&&motion&&matchMedia('(pointer:fine) and (min-width:601px)').matches;b.setAttribute('aria-pressed',String(active));b.querySelector('span').textContent=active?'custom':'native';});
 $$('[data-sound]').forEach(b=>{b.setAttribute('aria-pressed',String(sound));b.querySelector('span').textContent=sound?'on':'off';});
}
function setMotion(enabled){motion=enabled&&!system.matches;document.documentElement.dataset.motion=motion?'on':'off';scrolling.setEnabled(motion);cursor?.setEnabled(customCursor&&motion);subscribers.forEach(fn=>fn(motion));syncControls();}
$$('button[data-motion]').forEach(b=>b.addEventListener('click',()=>{storage.set('motion',motion?'off':'on');setMotion(!motion);if(system.matches)notify('Your device’s reduced-motion setting is active.');}));
system.addEventListener('change',()=>setMotion(storage.get('motion')!=='off'));
async function loadCursor(){
 if(!matchMedia('(pointer:fine)').matches||system.matches)return;
 const {initCursor}=await import('./cursor.js');cursor=initCursor({enabled:customCursor&&motion});
}
loadCursor().catch(()=>{$$(' [data-cursor]').forEach(b=>{b.querySelector('span').textContent='native';});});
$$('[data-cursor]').forEach(b=>b.addEventListener('click',()=>{customCursor=!customCursor;storage.set('cursor',customCursor?'custom':'native');cursor?.setEnabled(customCursor&&motion);syncControls();}));
async function enableSound(){
 soundLoading??=import('./sound.js');
 const mod=await soundLoading;
 audio??=mod.createSound();await audio.resume();return audio;
}
$$('[data-sound]').forEach(b=>b.addEventListener('click',async()=>{
 if(sound){sound=false;audio?.mute();syncControls();return;}
 try{await enableSound();sound=true;audio.play('click');syncControls();}catch{sound=false;syncControls();notify('Sound is unavailable in this browser.');}
}));
let hovered=null;
document.addEventListener('pointerover',e=>{const target=e.target.closest('a,button');if(target&&target!==hovered&&sound)audio?.play('hover');hovered=target;},{passive:true});
document.addEventListener('click',e=>{if(sound&&!e.target.closest('[data-sound]')&&e.target.closest('a,button'))audio?.play('click');});
const menu=$('.menu-button'),mobile=$('#mobile-nav');
function closeMenu(){if(!menu)return;mobile.hidden=true;menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');}
menu?.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';mobile.hidden=!open;menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
document.addEventListener('keydown',e=>{if(e.key==='Tab')document.body.dataset.keyboard='true';if(e.key==='Escape'&&menu?.getAttribute('aria-expanded')==='true'){closeMenu();menu.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
matchMedia('(min-width:601px)').addEventListener('change',e=>{if(e.matches)closeMenu();syncControls();});
document.querySelectorAll('img[data-fallback]').forEach(img=>{
 const fail=()=>{if(img.dataset.fallbackUsed){img.hidden=true;const replacement=document.createElement('span');replacement.className='portrait-missing';replacement.textContent='Anas Yasser';replacement.setAttribute('role','img');replacement.setAttribute('aria-label','Anas Yasser portrait unavailable');img.after(replacement);return;}img.dataset.fallbackUsed='true';img.src=img.dataset.fallback;img.closest('[data-portrait]')?.classList.add('portrait-fallback-mode');};
 img.addEventListener('error',fail);if(img.complete&&img.naturalWidth===0)fail();
});
$$('[data-copy-email]').forEach(b=>b.addEventListener('click',async()=>{
 const email='cardecarprivate123@gmail.com';
 try{await navigator.clipboard.writeText(email);notify('Email copied.');}catch{notify('Copy this email: '+email);}
}));
document.addEventListener('click',e=>{
 const link=e.target.closest('a[href]');
 if(!link||e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||link.target||link.hasAttribute('download'))return;
 const target=new URL(link.href,location.href);
 if(target.origin!==location.origin||!/^https?:$/.test(target.protocol))return;
 if(target.pathname===location.pathname&&target.hash){
  const section=document.getElementById(decodeURIComponent(target.hash.slice(1)));
  if(section&&motion){e.preventDefault();history.pushState(null,'',target.hash);scrolling.to(section.getBoundingClientRect().top+scrollY-105);section.setAttribute('tabindex','-1');section.focus({preventScroll:true});}
  return;
 }
 if(target.pathname===location.pathname&&target.search===location.search)return;
 if(!motion||document.body.dataset.keyboard==='true')return;
 e.preventDefault();if(sound)audio?.play('transition');document.body.classList.add('route-leaving');
 setTimeout(()=>location.assign(target.href),170);
});
window.addEventListener('pageshow',e=>{document.body.classList.remove('route-leaving');if(e.persisted){scrolling.setEnabled(motion);cursor?.setEnabled(customCursor&&motion);syncControls();}});
const pages={home:()=>import('./pages/home.js'),about:()=>import('./pages/about.js'),projects:()=>import('./pages/projects.js'),contact:()=>import('./pages/contact.js'),play:()=>import('./pages/play.js'),notfound:()=>import('./pages/notfound.js')};
const pageLoader=pages[document.body.dataset.page];
if(pageLoader)pageLoader().then(m=>m.init(context)).catch(()=>notify('An optional interaction could not load. All page links remain available.'));
syncControls();
if(document.querySelector('[data-opening]'))import('./studio.js').then(m=>m.init(context)).catch(()=>{});
window.addEventListener('pagehide',e=>{if(e.persisted){scrolling.stop();return;}scrolling.dispose();cursor?.dispose();audio?.mute();});



import('./premium.js').then(m=>m.init(context)).catch(()=>{});
