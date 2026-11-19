import * as THREE from 'three';
import {makeBodyField,type Joint,type Edge} from './mesh';

/** Project nearby surface vertices onto the skeleton's continuous field. */
export function projectToBody(g:THREE.BufferGeometry,joints:Joint[],edges:Edge[],iterations=2):void{
 const p=g.getAttribute('position') as THREE.BufferAttribute;if(!p||!joints.length)return;
 const field=makeBodyField(joints,edges),epsilon=.001,maxMove=Math.min(.08,Math.min(...joints.map(j=>j.r))*.5);
 for(let i=0;i<p.count;i++){
  let x=p.getX(i),y=p.getY(i),z=p.getZ(i);
  for(let k=0;k<Math.min(3,iterations);k++){
   const f=field(x,y,z),gx=(field(x+epsilon,y,z)-field(x-epsilon,y,z))/(2*epsilon),gy=(field(x,y+epsilon,z)-field(x,y-epsilon,z))/(2*epsilon),gz=(field(x,y,z+epsilon)-field(x,y,z-epsilon))/(2*epsilon),g2=gx*gx+gy*gy+gz*gz;
   if(!Number.isFinite(f)||!Number.isFinite(g2)||g2<1e-10)break;
   let t=f/g2;const distance=Math.abs(t)*Math.sqrt(g2);if(distance>maxMove)t*=maxMove/distance;
   x-=t*gx;y-=t*gy;z-=t*gz;
  }
  if(Number.isFinite(x)&&Number.isFinite(y)&&Number.isFinite(z))p.setXYZ(i,x,y,z);
 }
 p.needsUpdate=true;g.computeVertexNormals();g.computeBoundingSphere();
}
