import * as THREE from 'three';
import {brushWeight} from './brush';
/** Blend a soft, optionally mirrored color stroke into the front-facing surface. */
export function paintMesh(geometry:THREE.BufferGeometry,point:THREE.Vector3,normal:THREE.Vector3,color:THREE.Color,radius:number,opacity:number,mirror:boolean,region?:Uint8Array,protect?:(x:number,y:number,z:number)=>number):boolean {
 const positions=geometry.getAttribute('position'),normals=geometry.getAttribute('normal'),colors=geometry.getAttribute('color') as THREE.BufferAttribute;
 if(!positions||!normals||!colors||radius<=0||opacity<=0)return false;
 let changed=false;
 for(let i=0;i<positions.count;i++){
  if(region&&!region[i])continue;
  const w=brushWeight(positions.getX(i),positions.getY(i),positions.getZ(i),normals.getX(i),normals.getY(i),normals.getZ(i),point,normal,radius,mirror)*Math.min(1,opacity)*(protect?protect(positions.getX(i),positions.getY(i),positions.getZ(i)):1);
  if(!w)continue;
  colors.setXYZ(i,colors.getX(i)+(color.r-colors.getX(i))*w,colors.getY(i)+(color.g-colors.getY(i))*w,colors.getZ(i)+(color.b-colors.getZ(i))*w);changed=true;
 }
 if(changed)colors.needsUpdate=true;return changed;
}
