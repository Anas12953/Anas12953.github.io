export function init(context){
 const form=document.querySelector('[data-contact-form]'),status=document.querySelector('#form-status');
 const project=new URLSearchParams(location.search).get('project');
 const labels={"desert-knights":"Desert Knights — Parents","monthly-grades":"Al Ebtehal KG Monthly Grades Tracker","events-calendar":"Al Ebtehal Events Calendar","baseline-assessment":"Al Ebtehal Baseline Assessment","falconbot":"FalconBot V2","grandmaster":"Anas Chess","al-qanas":"Al Qanas Photography","desert-knights-teacher":"Desert Knights — Teacher Dashboard","rl-dropwatch":"RL DropWatch","science-studio":"Science Studio","arabic-revision":"Grade 8 Arabic Revision"};
 if(Object.hasOwn(labels,project))form.elements.message.value='Hi Anas, I would like to ask about '+labels[project]+'.\n\n';
 form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const name=form.elements.name.value.trim(),email=form.elements.email.value.trim(),message=form.elements.message.value.trim();if(!name||!message){status.textContent='Please enter your name and message.';return;}const subject='Portfolio message from '+name,body=message+'\n\nFrom: '+name+'\nReply to: '+email;const link='mailto:cardecarprivate123@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);status.textContent='Opening your email app. Review the draft there before sending.';location.href=link;context.notify('Your email app will open a draft.');});
}

