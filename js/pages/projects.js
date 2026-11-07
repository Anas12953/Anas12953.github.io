export function init(){
 const buttons=[...document.querySelectorAll('[data-filter]')],cards=[...document.querySelectorAll('.project-card')],status=document.querySelector('[data-filter-status]');
 function apply(button,save=false){buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;cards.forEach(card=>{card.hidden=button.dataset.filter!=='all'&&button.dataset.filter!==card.dataset.category;if(!card.hidden)count++;});status.textContent=count+' project'+(count===1?'':'s')+' shown.';if(save){const u=new URL(location.href);if(button.dataset.filter==='all')u.searchParams.delete('category');else u.searchParams.set('category',button.dataset.filter);history.replaceState(null,'',u);}}
 buttons.forEach(button=>button.addEventListener('click',()=>apply(button,true)));
 const initial=new URLSearchParams(location.search).get('category');apply(buttons.find(b=>b.dataset.filter===initial)||buttons[0]);
}

