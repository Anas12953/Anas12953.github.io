export function createSound(){
 const Audio=window.AudioContext||window.webkitAudioContext;
 if(!Audio)throw new Error('Audio unavailable');
 const context=new Audio(),master=context.createGain();master.gain.value=.22;master.connect(context.destination);let last=0;
 const voices={hover:[1200,.035,.025],click:[550,.075,.07],switch:[240,.12,.08],card:[660,.14,.055],transition:[320,.18,.045],intro:[440,.24,.045]};
 function voice(frequency,duration,volume,delay=0){const t=context.currentTime+delay,o=context.createOscillator(),g=context.createGain();o.type='sine';o.frequency.setValueAtTime(frequency,t);o.frequency.exponentialRampToValueAtTime(frequency*.7,t+duration);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(volume,t+.006);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(master);o.start(t);o.stop(t+duration+.025);o.onended=()=>{o.disconnect();g.disconnect()};}
 return{
  async resume(){if(context.state==='suspended')await context.resume();master.gain.setTargetAtTime(.22,context.currentTime,.015);},
  mute(){master.gain.setTargetAtTime(0,context.currentTime,.02);},
  play(type){if(context.state!=='running'||performance.now()-last<60)return;last=performance.now();const [f,d,v]=voices[type]||voices.click;voice(f,d,v);if(type==='card'||type==='intro')voice(f*1.5,d*.9,v*.45,.045);if(type==='switch')voice(110,.035,.035,.055)}
 };
}

