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

/** Move a point toward the hit plane, including its mirrored counterpart. */
export function flattenPoint(x:number,y:number,z:number,point:THREE.Vector3,normal:THREE.Vector3,mirror:boolean,amount:number):[number,number,number]{
 const mirrored=mirror&&Math.hypot(x+point.x,y-point.y,z-point.z)<Math.hypot(x-point.x,y-point.y,z-point.z);
 const px=mirrored?-point.x:point.x,nx=mirrored?-normal.x:normal.x;
 const distance=(x-px)*nx+(y-point.y)*normal.y+(z-point.z)*normal.z;
 const t=Math.max(0,Math.min(1,amount))*distance;
 return [x-t*nx,y-t*normal.y,z-t*normal.z];
}

/** Follow connected triangles around the hit rather than jumping to nearby shells. */
export function brushRegion(g:THREE.BufferGeometry,face:{a:number;b:number;c:number},point:THREE.Vector3,normal:THREE.Vector3,radius:number,mirror:boolean):Uint8Array{
 const p=g.getAttribute('position'),n=g.getAttribute('normal'),neighbors=neighborsFor(g),mask=new Uint8Array(p.count),queue:number[]=[];
 function visit(seed:number){if(!mask[seed]){mask[seed]=1;queue.push(seed)}}
 for(const v of [face.a,face.b,face.c])visit(v);
 if(mirror&&Math.abs(point.x)>.001){let best=-1,dist=radius*radius;for(let i=0;i<p.count;i++){const dx=p.getX(i)+point.x,dy=p.getY(i)-point.y,dz=p.getZ(i)-point.z,d=dx*dx+dy*dy+dz*dz;if(d<dist&&-n.getX(i)*normal.x+n.getY(i)*normal.y+n.getZ(i)*normal.z>.1){best=i;dist=d}}if(best>=0)visit(best)}
 for(let head=0;head<queue.length;head++){const i=queue[head];for(const v of neighbors[i]){if(mask[v])continue;const dy=p.getY(v)-point.y,dz=p.getZ(v)-point.z,dx=p.getX(v)-point.x,mdx=p.getX(v)+point.x;if(dx*dx+dy*dy+dz*dz<=radius*radius||(mirror&&mdx*mdx+dy*dy+dz*dz<=radius*radius))visit(v)}}
 return mask;
}
