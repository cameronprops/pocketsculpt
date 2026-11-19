import * as THREE from 'three';
import type {Joint} from './mesh';
export type Shell={a:number;b:number;band:boolean;gap:number;thickness:number};
export function shellGeometry(a:Joint,b:Joint,s:Shell){
 const p=new THREE.Vector3(a.x,a.y,a.z),q=new THREE.Vector3(b.x,b.y,b.z),axis=q.clone().sub(p);if(axis.lengthSq()<1e-8)return new THREE.BufferGeometry();axis.normalize();const u=new THREE.Vector3().crossVectors(axis,Math.abs(axis.y)<.9?new THREE.Vector3(0,1,0):new THREE.Vector3(1,0,0)).normalize(),v=new THREE.Vector3().crossVectors(axis,u);const n=40,rows=12,layer=n*(rows+1),positions:number[]=[],indices:number[]=[];
 for(let wall=0;wall<2;wall++)for(let r=0;r<=rows;r++){const t=(s.band?.35:0)+(s.band?.3:1)*r/rows,c=p.clone().lerp(q,t),rad=a.r+(b.r-a.r)*t+s.gap+(wall===0?s.thickness:0);for(let i=0;i<n;i++){const x=c.clone().addScaledVector(u,Math.cos(i*2*Math.PI/n)*rad).addScaledVector(v,Math.sin(i*2*Math.PI/n)*rad);positions.push(x.x,x.y,x.z)}}
 for(let wall=0;wall<2;wall++)for(let r=0;r<rows;r++)for(let i=0;i<n;i++){const x=wall*layer+r*n+i,y=wall*layer+r*n+(i+1)%n,z=x+n,w=y+n;if(wall===0)indices.push(x,y,z,y,w,z);else indices.push(x,z,y,y,z,w)}for(const r of [0,rows])for(let i=0;i<n;i++){const x=r*n+i,y=r*n+(i+1)%n,z=x+layer,w=y+layer;if(!r)indices.push(x,z,y,y,z,w);else indices.push(x,y,z,y,w,z)}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function validShell(x:unknown,edges:number[][]):x is Shell{if(!x||typeof x!=='object')return false;const s=x as Shell;return edges.some(e=>e[0]===s.a&&e[1]===s.b)&&typeof s.band==='boolean'&&Number.isFinite(s.gap)&&s.gap>=.005&&s.gap<=.35&&Number.isFinite(s.thickness)&&s.thickness>=.01&&s.thickness<=.15}
