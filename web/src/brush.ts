import * as THREE from 'three';

/** Soft brush falloff, restricted to surfaces facing the struck surface. */
export function brushWeight(x:number,y:number,z:number,nx:number,ny:number,nz:number,point:THREE.Vector3,normal:THREE.Vector3,radius:number,mirror:boolean):number {
  if(radius<=0)return 0;
  const dy=y-point.y,dz=z-point.z;
  let weight=0;
  if(nx*normal.x+ny*normal.y+nz*normal.z>0.1)weight=Math.max(0,1-Math.hypot(x-point.x,dy,dz)/radius);
  if(mirror&&(-nx*normal.x+ny*normal.y+nz*normal.z)>0.1)weight=Math.max(weight,Math.max(0,1-Math.hypot(x+point.x,dy,dz)/radius));
  return weight*weight*(3-2*weight);
}

const adjacency=new WeakMap<THREE.BufferGeometry,number[][]>();
export function neighborsFor(g:THREE.BufferGeometry):number[][] {
  const cached=adjacency.get(g);if(cached)return cached;
  const p=g.getAttribute('position'),ix=g.getIndex(),result:number[][]=Array.from({length:p.count},()=>[]);
  if(ix)for(let k=0;k<ix.count;k+=3){const a=ix.getX(k),b=ix.getX(k+1),c=ix.getX(k+2);result[a].push(b,c);result[b].push(a,c);result[c].push(a,b)}
  adjacency.set(g,result);return result;
}
