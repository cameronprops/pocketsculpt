import * as THREE from 'three';
/** Backtrack a candidate deformation until no affected triangle flips or collapses. */
export function guardDeformation(g:THREE.BufferGeometry,before:Float32Array,region:Uint8Array):boolean{
 const p=g.getAttribute('position') as THREE.BufferAttribute,ix=g.getIndex();if(!ix)return false;const candidate=Float32Array.from(p.array as ArrayLike<number>),affected:number[]=[];for(let i=0;i<ix.count;i+=3){const a=ix.getX(i),b=ix.getX(i+1),c=ix.getX(i+2);if(region[a]||region[b]||region[c])affected.push(a,b,c)}
 function cross(arr:Float32Array,a:number,b:number,c:number){a*=3;b*=3;c*=3;const ux=arr[b]-arr[a],uy=arr[b+1]-arr[a+1],uz=arr[b+2]-arr[a+2],vx=arr[c]-arr[a],vy=arr[c+1]-arr[a+1],vz=arr[c+2]-arr[a+2];return [uy*vz-uz*vy,uz*vx-ux*vz,ux*vy-uy*vx]}
 const temp=new Float32Array(candidate.length);for(let attempt=0;attempt<9;attempt++){const factor=2**-attempt;for(let i=0;i<before.length;i++)temp[i]=before[i]+(candidate[i]-before[i])*factor;let valid=true;for(let i=0;i<affected.length;i+=3){const a=affected[i],b=affected[i+1],c=affected[i+2],u=cross(before,a,b,c),v=cross(temp,a,b,c),area=u[0]*u[0]+u[1]*u[1]+u[2]*u[2];if(area>1e-18&&(u[0]*v[0]+u[1]*v[1]+u[2]*v[2])<area*.2){valid=false;break}}if(valid){for(let i=0;i<p.count;i++)if(region[i])p.setXYZ(i,temp[3*i],temp[3*i+1],temp[3*i+2]);p.needsUpdate=true;return true}}
 for(let i=0;i<p.count;i++)if(region[i])p.setXYZ(i,before[3*i],before[3*i+1],before[3*i+2]);p.needsUpdate=true;return false;
}
