import * as THREE from 'three';
import type {Joint,Edge} from './mesh';
/** Rotate a joint and its descendants around its parent, keeping bone lengths. */
export function poseBranch(source:Joint[],edges:Edge[],jointId:number,target:THREE.Vector3):Joint[]|null{
 const joint=source.find(j=>j.id===jointId),parents=edges.filter(([,child])=>child===jointId);
 if(!joint||parents.length!==1)return null;
 const parent=source.find(j=>j.id===parents[0][0]);if(!parent)return null;
 const pivot=new THREE.Vector3(parent.x,parent.y,parent.z),from=new THREE.Vector3(joint.x,joint.y,joint.z).sub(pivot),to=target.clone().sub(pivot);
 if(from.lengthSq()<1e-12||to.lengthSq()<1e-12)return null;
 const q=new THREE.Quaternion().setFromUnitVectors(from.normalize(),to.normalize()),ids=new Set([jointId]);let changed=true;
 while(changed){changed=false;for(const [a,b] of edges)if(ids.has(a)&&!ids.has(b)){ids.add(b);changed=true}}
 if(ids.has(parent.id))return null;
 return source.map(j=>{if(!ids.has(j.id))return {...j};const p=new THREE.Vector3(j.x,j.y,j.z).sub(pivot).applyQuaternion(q).add(pivot);return {...j,x:p.x,y:p.y,z:p.z}});
}
