import * as THREE from 'three';
import {brushRegion,brushWeight} from './brush';
export type GrabState={positions:Float32Array;primary:Float32Array;mirrored:Float32Array};
/** Capture one connected brush region at the start of the drag. */
export function beginGrab(g:THREE.BufferGeometry,face:{a:number;b:number;c:number},point:THREE.Vector3,normal:THREE.Vector3,radius:number,mirror:boolean):GrabState{
 const p=g.getAttribute('position'),n=g.getAttribute('normal'),region=brushRegion(g,face,point,normal,radius,mirror),positions=Float32Array.from(p.array as ArrayLike<number>),primary=new Float32Array(p.count),mirrored=new Float32Array(p.count),other=new THREE.Vector3(-point.x,point.y,point.z),otherNormal=new THREE.Vector3(-normal.x,normal.y,normal.z);
 for(let i=0;i<p.count;i++){if(!region[i])continue;const x=p.getX(i),y=p.getY(i),z=p.getZ(i),nx=n.getX(i),ny=n.getY(i),nz=n.getZ(i);const a=brushWeight(x,y,z,nx,ny,nz,point,normal,radius,false),b=mirror?brushWeight(x,y,z,nx,ny,nz,other,otherNormal,radius,false):0;if(a>=b)primary[i]=a;else mirrored[i]=b}
 return {positions,primary,mirrored};
}
/** Deform from the captured starting state, so result is independent of event rate. */
export function applyGrab(g:THREE.BufferGeometry,state:GrabState,delta:THREE.Vector3,strength:number):boolean{
 const p=g.getAttribute('position') as THREE.BufferAttribute;let changed=false;const factor=Math.max(0,Math.min(1,strength));
 for(let i=0;i<p.count;i++){const a=state.primary[i]*factor,b=state.mirrored[i]*factor;if(!a&&!b)continue;const o=i*3;p.setXYZ(i,state.positions[o]+delta.x*(a-b),state.positions[o+1]+delta.y*(a+b),state.positions[o+2]+delta.z*(a+b));changed=true}
 if(changed)p.needsUpdate=true;return changed;
}
