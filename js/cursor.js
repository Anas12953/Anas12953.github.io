export function initCursor({enabled=true}={}){
 const orb=document.querySelector('.cursor-orb'),label=orb.querySelector('span');
 let on=enabled,frame=0,x=-100,y=-100,tx=-100,ty=-100,shown=false,down=false;
 let requested=enabled;
 const eligible=matchMedia('(pointer:fine) and (min-width:601px)');
 function setEnabled(value){requested=value;on=value&&eligible.matches;document.body.classList.toggle('cursor-custom',on);document.body.classList.toggle('cursor-native',!on);if(!on)document.body.classList.remove('cursor-active');}
 eligible.addEventListener('change',()=>setEnabled(requested));
 function render(){x+=(tx-x)*.28;y+=(ty-y)*.28;const dx=tx-x,dy=ty-y;orb.style.transform='translate3d('+(x-orb.offsetWidth/2)+'px,'+(y-orb.offsetHeight/2)+'px,0) perspective(400px) rotateX('+(-dy*.15)+'deg) rotateY('+(dx*.15)+'deg)';if(Math.abs(dx)+Math.abs(dy)>.15)frame=requestAnimationFrame(render);else frame=0;}
 function move(e){
  if(!on||e.pointerType==='touch')return;document.body.dataset.keyboard='false';tx=e.clientX;ty=e.clientY;
  if(!shown){x=tx;y=ty;shown=true;}document.body.classList.add('cursor-active');
  const target=e.target.closest('[data-portrait],a,button,img,input,textarea');
  const state=down?'drag':target?.matches('[data-portrait]')?'drag':target?.matches('img')?'image':target?.matches('button')?'button':target?.matches('a')?'link':'idle';
  orb.dataset.state=state;label.textContent=state==='image'?'VIEW':state==='drag'?'DRAG':state==='link'?'OPEN':'';
  if(!frame)frame=requestAnimationFrame(render);
 }
 const leave=()=>{shown=false;document.body.classList.remove('cursor-active');};
 const press=()=>{down=true;orb.dataset.state='drag';},release=()=>{down=false;};
 window.addEventListener('pointermove',move,{passive:true});document.documentElement.addEventListener('pointerleave',leave);window.addEventListener('blur',leave);window.addEventListener('pointerdown',press,{passive:true});window.addEventListener('pointerup',release,{passive:true});
 setEnabled(on);
 return{setEnabled,dispose(){cancelAnimationFrame(frame);setEnabled(false);window.removeEventListener('pointermove',move);window.removeEventListener('blur',leave);document.documentElement.removeEventListener('pointerleave',leave);window.removeEventListener('pointerdown',press);window.removeEventListener('pointerup',release);}};
}

