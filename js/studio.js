import {cordDistance,shouldSwitch,formatClock,shouldActivateClick} from './studio-state.js';
export function init(context){
 const $=s=>document.querySelector(s),all=s=>[...document.querySelectorAll(s)];
 const intro=$('[data-opening]');let introTimer=0,exitTimer=0,opening=false,introFocus=null;
 const regions=all('header.header,main,footer.footer');let previousInert=[];
 const remember=()=>{try{sessionStorage.setItem('anas-studio-opened','yes')}catch{}};
 function finishIntro(){if(!opening)return;opening=false;clearTimeout(introTimer);remember();intro.classList.add('opening-exit');document.body.classList.remove('is-opening');regions.forEach((el,i)=>el.inert=previousInert[i]||false);if(intro.contains(document.activeElement)){const target=introFocus?.isConnected&&introFocus!==document.body?introFocus:$('main');target?.focus({preventScroll:true})}exitTimer=setTimeout(()=>{intro.hidden=true;intro.classList.remove('opening-exit');},context.isMotion()?650:0);}
 async function openIntro(force=false){
  if(!intro||opening||!context.isMotion())return;try{if(!force&&sessionStorage.getItem('anas-studio-opened'))return}catch{}
  clearTimeout(exitTimer);context.stopScroll?.();opening=true;introFocus=document.activeElement;previousInert=regions.map(el=>el.inert);regions.forEach(el=>el.inert=true);intro.hidden=false;intro.classList.remove('opening-exit');document.body.classList.add('is-opening');$('[data-skip-opening]')?.focus({preventScroll:true});
  const status=$('[data-opening-status]'),count=$('[data-opening-count]'),bar=$('[data-opening-progress]');let done=0;count.textContent='00';bar.style.scale='0 1';status.textContent='Preparing the studio';
  introTimer=setTimeout(finishIntro,3200);
  const portrait=document.querySelector('.portrait-cutout'),jobs=[document.fonts?.ready||Promise.resolve(),typeof portrait?.decode==='function'?portrait.decode():Promise.resolve()];
  await Promise.allSettled(jobs.map(async job=>{try{await job}catch{}if(!opening)return;done++;const progress=Math.round(done/jobs.length*100);count.textContent=String(progress).padStart(2,'0');bar.style.scale=(progress/100)+' 1';status.textContent=done===jobs.length?'A little curiosity goes a long way.':'Gathering a few ideas';}));
  if(opening){clearTimeout(introTimer);introTimer=setTimeout(finishIntro,480);}
 }
 $('[data-skip-opening]')?.addEventListener('click',finishIntro);
 all('[data-replay-opening]').forEach(b=>b.addEventListener('click',()=>{context.play?.('intro');openIntro(true)}));
 openIntro();
 const clocks=all('[data-studio-clock]');const updateClock=()=>clocks.forEach(el=>el.textContent=formatClock(new Date())+' GST');if(clocks.length)updateClock();let clockTimer=clocks.length?setInterval(updateClock,30000):0;
 const lamp=$('[data-lamp-control]'),path=$('[data-cord-path]'),handle=$('[data-cord-handle]');let lit=false,drag=null,suppressClick=false,returnAnimation=null;
 function drawCord(distance,x=0){if(!path)return;path.setAttribute('d',`M65 34Q${69+x*.65} ${80+distance*.5} ${65+x} ${137+distance}`);handle.setAttribute('transform',`translate(${x} ${distance})`);}
 function switchLight(){lit=!lit;document.body.dataset.lamp=lit?'on':'off';lamp.setAttribute('aria-checked',String(lit));context.play?.('switch');}
 lamp?.addEventListener('click',e=>{const activate=shouldActivateClick({suppressed:suppressClick,detail:e.detail});suppressClick=false;if(activate)switchLight();});
 lamp?.addEventListener('pointerdown',e=>{if(e.button!==0)return;suppressClick=false;returnAnimation?.cancel();drag={pointer:e.pointerId,y:e.clientY,x:e.clientX,distance:0,move:0};lamp.setPointerCapture(e.pointerId);lamp.classList.add('is-pulling');});
 lamp?.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.pointer)return;drag.move=Math.hypot(e.clientX-drag.x,e.clientY-drag.y);drag.distance=cordDistance(e.clientY-drag.y);drawCord(drag.distance,Math.max(-18,Math.min(18,(e.clientX-drag.x)*.25)));});
 function release(e,cancelled){if(!drag||e.pointerId!==drag.pointer)return;const state=drag;drag=null;lamp.classList.remove('is-pulling');suppressClick=cancelled||state.move>5;if(shouldSwitch({distance:state.distance,cancelled}))switchLight();drawCord(0);if(context.isMotion())returnAnimation=handle.animate([{transform:`translateY(${state.distance}px)`},{transform:'translateY(-9px)',offset:.55},{transform:'translateY(3px)',offset:.8},{transform:'translateY(0)'}],{duration:600,easing:'cubic-bezier(.22,1,.36,1)'});}
 lamp?.addEventListener('pointerup',e=>release(e,false));lamp?.addEventListener('pointercancel',e=>release(e,true));lamp?.addEventListener('lostpointercapture',e=>{if(drag)release(e,true)});
 const dialog=$('#ability-dialog'),card=$('[data-ability-object]'),stage=$('[data-ability-tilt]'),flip=$('[data-flip-ability]');let opener=null,flipped=false,tiltFrame=0;
 function resetTilt(){cancelAnimationFrame(tiltFrame);tiltFrame=0;stage?.style.setProperty('--card-rx','0deg');stage?.style.setProperty('--card-ry','0deg');}
 function setFlipped(value){flipped=value;card?.classList.toggle('is-flipped',value);flip?.setAttribute('aria-pressed',String(value));$('[data-card-front]')?.setAttribute('aria-hidden',String(value));$('[data-card-back]')?.setAttribute('aria-hidden',String(!value));if($('[data-card-front]'))$('[data-card-front]').inert=value;if($('[data-card-back]'))$('[data-card-back]').inert=!value;context.play?.('card');}
 all('[data-open-ability]').forEach(button=>button.addEventListener('click',()=>{if(!dialog)return;context.stopScroll?.();opener=button;setFlipped(false);dialog.showModal();document.body.classList.add('ability-open');context.play?.('card')}));
 function close(){dialog?.close();}
 $('[data-close-ability]')?.addEventListener('click',close);
 dialog?.addEventListener('click',e=>{if(e.target===dialog)close()});
 dialog?.addEventListener('close',()=>{document.body.classList.remove('ability-open');resetTilt();if(opener?.isConnected)opener.focus({preventScroll:true})});
 flip?.addEventListener('click',()=>setFlipped(!flipped));stage?.addEventListener('click',()=>setFlipped(!flipped));
 stage?.addEventListener('pointermove',e=>{if(!context.isMotion()||e.pointerType==='touch')return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;cancelAnimationFrame(tiltFrame);tiltFrame=requestAnimationFrame(()=>{stage.style.setProperty('--card-rx',(-y*12)+'deg');stage.style.setProperty('--card-ry',(x*16)+'deg');stage.style.setProperty('--shine-x',(50+x*75)+'%');stage.style.setProperty('--shine-y',(50+y*75)+'%')})});stage?.addEventListener('pointerleave',resetTilt);
 const unsubscribe=context.onMotion?.(enabled=>{if(!enabled){finishIntro();returnAnimation?.cancel();resetTilt();drawCord(0);}});
 window.addEventListener('pagehide',e=>{finishIntro();if(e.persisted)return;clearInterval(clockTimer);clearTimeout(exitTimer);unsubscribe?.();resetTilt();returnAnimation?.cancel();});
}
