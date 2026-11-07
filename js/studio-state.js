export const cordDistance=delta=>Math.max(0,Math.min(90,delta*.7));
export const shouldSwitch=({distance,cancelled=false})=>!cancelled&&distance>=32;
export const shouldActivateClick=({suppressed,detail})=>!suppressed||detail===0;
const clock=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'2-digit'});
export const formatClock=date=>clock.format(date);
