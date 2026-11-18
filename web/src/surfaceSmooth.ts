import * as THREE from 'three';

/** Apply bounded Taubin smoothing in place. Connectivity and paint remain intact. */
export function smoothSurface(g:THREE.BufferGeometry,iterations=6):void{
 const position=g.getAttribute('position') as THREE.BufferAttribute,index=g.getIndex();
 if(!position||!index||iterations<=0)return;
 const neighbors=Array.from({length:position.count},()=>new Set<number>());
 for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2);neighbors[a].add(b).add(c);neighbors[b].add(a).add(c);neighbors[c].add(a).add(b)}
 let current=Float64Array.from(position.array as ArrayLike<number>),next=new Float64Array(current.length);
 function pass(amount:number){for(let i=0;i<neighbors.length;i++){const ns=neighbors[i],offset=i*3;if(!ns.size){next[offset]=current[offset];next[offset+1]=current[offset+1];next[offset+2]=current[offset+2];continue}let x=0,y=0,z=0;for(const j of ns){x+=current[j*3];y+=current[j*3+1];z+=current[j*3+2]}next[offset]=current[offset]+amount*(x/ns.size-current[offset]);next[offset+1]=current[offset+1]+amount*(y/ns.size-current[offset+1]);next[offset+2]=current[offset+2]+amount*(z/ns.size-current[offset+2])}const old=current;current=next;next=old}
 for(let i=0;i<Math.min(12,iterations);i++){pass(.4);pass(-.42)}
 for(let i=0;i<position.count;i++)position.setXYZ(i,current[3*i],current[3*i+1],current[3*i+2]);
 position.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
}
