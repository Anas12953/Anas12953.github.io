export function initPortraits(context){
 const scenes=[...document.querySelectorAll('[data-portrait]')],cleanups=[];
 const fine=matchMedia('(pointer:fine)');
 scenes.forEach(scene=>{
  let visible=false,frame=0,x=0,y=0,tx=0,ty=0;
  const reset=()=>{tx=ty=x=y=0;scene.style.setProperty('--rx','0deg');scene.style.setProperty('--ry','0deg');scene.style.setProperty('--py','0px');cancelAnimationFrame(frame);frame=0;};
  function render(){x+=(tx-x)*.12;y+=(ty-y)*.12;scene.style.setProperty('--rx',(-y*3.6).toFixed(3)+'deg');scene.style.setProperty('--ry',(x*4.6).toFixed(3)+'deg');if(Math.abs(x-tx)+Math.abs(y-ty)>.002)frame=requestAnimationFrame(render);else frame=0;}
  function move(e){if(!context.isMotion()||!fine.matches)return;const r=scene.getBoundingClientRect();tx=(e.clientX-r.left)/r.width*2-1;ty=(e.clientY-r.top)/r.height*2-1;if(!frame)frame=requestAnimationFrame(render);}
  function leave(){tx=ty=0;if(!frame&&context.isMotion())frame=requestAnimationFrame(render);}
  let scrollFrame=0;
  function scroll(){if(!visible||!context.isMotion()||scrollFrame)return;scrollFrame=requestAnimationFrame(()=>{scrollFrame=0;const r=scene.getBoundingClientRect();const progress=Math.max(-1,Math.min(1,(r.top+r.height/2-innerHeight/2)/innerHeight));scene.style.setProperty('--py',(progress*9).toFixed(2)+'px');});}
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)reset();else scroll();},{threshold:.03});observer.observe(scene);
  scene.addEventListener('pointermove',move);scene.addEventListener('pointerleave',leave);scene.addEventListener('dragstart',e=>e.preventDefault());window.addEventListener('scroll',scroll,{passive:true});
  const unsub=context.onMotion(value=>{if(!value)reset();else scroll();});
  cleanups.push(()=>{reset();cancelAnimationFrame(scrollFrame);observer.disconnect();unsub();window.removeEventListener('scroll',scroll);scene.removeEventListener('pointermove',move);scene.removeEventListener('pointerleave',leave);});
 });
 return()=>cleanups.forEach(fn=>fn());
}

