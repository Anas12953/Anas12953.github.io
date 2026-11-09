export const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
export function moveRover(position,dx,dy){return {x:clamp(position.x+dx,0,100),y:clamp(position.y+dy,0,100)};}
export function nearestStop(position,stops,radius=16){let best=null,distance=radius;for(const stop of stops){const d=Math.hypot(position.x-stop.x,position.y-stop.y);if(d<=distance){best=stop;distance=d;}}return best;}
export const walls=new Set(['1,1','2,1','4,1','4,2','1,3','2,3','4,4']);
export function puzzleMove(position,dx,dy){const x=position.x+dx,y=position.y+dy;return x<0||y<0||x>5||y>5||walls.has(`${x},${y}`)?position:{x,y};}
