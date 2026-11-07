export function createMotion(context){
 let enabled=context.isMotion(),target=scrollY,current=scrollY,frame=0,last=0;
 const fine=matchMedia('(pointer:fine)'),animations=new Set();
 const clamp=y=>Math.max(0,Math.min(y,Math.max(0,document.documentElement.scrollHeight-innerHeight)));
 function tick(now){
  const dt=Math.min(40,now-(last||now-16));last=now;
  current+=(target-current)*(1-Math.exp(-dt/220));
  window.scrollTo(0,current);
  if(Math.abs(target-current)>.4)frame=requestAnimationFrame(tick);
  else{window.scrollTo(0,target);frame=0;last=0;}
 }
 function to(y){target=clamp(y);if(!enabled){window.scrollTo(0,target);return;}if(!frame){current=scrollY;last=0;frame=requestAnimationFrame(tick);}}
 function cancel(){cancelAnimationFrame(frame);frame=0;last=0;current=target=scrollY;}
 function wheel(e){
  if(!enabled||!fine.matches||document.body.classList.contains('is-opening')||document.querySelector('dialog[open]')||e.ctrlKey||e.metaKey||e.shiftKey||Math.abs(e.deltaX)>Math.abs(e.deltaY)||e.target.closest('textarea,select,input,[data-native-scroll]'))return;
  const delta=e.deltaY*(e.deltaMode===1?18:e.deltaMode===2?innerHeight:1);
  if(!frame)target=scrollY;const next=clamp(target+delta);
  if(next===target)return;e.preventDefault();to(next);
 }
 function nativeScroll(){if(!frame)current=target=scrollY;}
 function key(e){if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))cancel();}
 window.addEventListener('wheel',wheel,{passive:false});window.addEventListener('scroll',nativeScroll,{passive:true});window.addEventListener('keydown',key);
 const elements=[...document.querySelectorAll('.header,.footer-top,.footer-bottom,main h1,main h2,main h3,main p,main dl,main .button,main .portrait-scene,main .project-image-link,main .case-cover,main .breadcrumbs')];
 const seen=new WeakSet();
 const observer=new IntersectionObserver(entries=>{
  let index=0;
  entries.forEach(entry=>{if(!entry.isIntersecting||seen.has(entry.target))return;seen.add(entry.target);observer.unobserve(entry.target);if(!enabled)return;
   const element=entry.target;
   if(element.closest('[data-portrait]')&&!element.matches('[data-portrait]'))return;
   const animation=element.animate([{opacity:0,translate:'0 18px'},{opacity:1,translate:'0 0'}],{duration:650,delay:Math.min(index++*45,180),easing:'cubic-bezier(.22,1,.36,1)',fill:'both'});
   animations.add(animation);animation.finished.then(()=>{animations.delete(animation);animation.cancel();}).catch(()=>animations.delete(animation));
  });
 },{threshold:.08,rootMargin:'0px 0px -15px 0px'});
 elements.forEach(el=>observer.observe(el));
 const depth=[...document.querySelectorAll('[data-scroll-depth]')];let depthFrame=0;
 function depthScroll(){if(depthFrame)return;depthFrame=requestAnimationFrame(()=>{depthFrame=0;if(!enabled)return;depth.forEach(el=>{const r=el.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;const amount=Math.max(-1,Math.min(1,(r.top+r.height/2-innerHeight/2)/innerHeight));el.style.transform='perspective(1200px) rotateX('+(-amount*1.8)+'deg) translateY('+(amount*6)+'px)';});});}
 window.addEventListener('scroll',depthScroll,{passive:true});
 function setEnabled(value){enabled=value;cancel();if(!enabled){animations.forEach(a=>a.cancel());animations.clear();depth.forEach(el=>el.style.removeProperty('transform'));}else depthScroll();}
 return{to,setEnabled,stop:cancel,dispose(){cancel();cancelAnimationFrame(depthFrame);observer.disconnect();animations.forEach(a=>a.cancel());window.removeEventListener('wheel',wheel);window.removeEventListener('scroll',nativeScroll);window.removeEventListener('scroll',depthScroll);window.removeEventListener('keydown',key);}};
}

