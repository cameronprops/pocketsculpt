import {validNodeMetadata,copyNodeMetadata} from './nodeMetadata';
import type {Joint,Edge} from './mesh';
import {validTag} from './jointTags';
export type Armature={joints:Joint[];edges:Edge[]};
/** Read the armature from a saved web project, without importing sculpt geometry. */
export function readArmature(text:string):Armature{
 const d:unknown=JSON.parse(text);if(!d||typeof d!=='object')throw Error('Invalid project');
 const v=d as {joints?:unknown;edges?:unknown};if(!Array.isArray(v.joints)||!Array.isArray(v.edges)||!v.joints.length||v.joints.length>500||v.edges.length>1000)throw Error('Invalid project size');
 const joints:Joint[]=v.joints.map((j:unknown)=>{if(!j||typeof j!=='object')throw Error('Invalid joint');const x=j as Joint;if(!Number.isSafeInteger(x.id)||x.id<0||![x.x,x.y,x.z,x.r].every(Number.isFinite)||x.r<.01||x.r>10||[x.x,x.y,x.z].some(n=>Math.abs(n)>100)||(x.shape!==undefined&&x.shape!=='sphere'&&x.shape!=='box')||(x.tag!==undefined&&!validTag(x.tag))||(x.metadata!==undefined&&!validNodeMetadata(x.metadata)))throw Error('Invalid joint data');return {...x,metadata:copyNodeMetadata(x.metadata),tag:x.tag?{...x.tag}:undefined}});
 const ids=new Set(joints.map(j=>j.id));if(ids.size!==joints.length)throw Error('Duplicate joint IDs');
 const edges:Edge[]=v.edges.map((e:unknown)=>{if(!Array.isArray(e)||e.length!==2||!e.every(n=>Number.isSafeInteger(n)&&ids.has(n))||e[0]===e[1])throw Error('Invalid bone');return [e[0],e[1]]});
 const parent=new Map<number,number>();for(const [a,b] of edges){if(parent.has(b))throw Error('A joint has multiple parent bones');parent.set(b,a)}
 for(const j of joints){const seen=new Set<number>();let id:number|undefined=j.id;while(id!==undefined){if(seen.has(id))throw Error('Cyclic skeleton');seen.add(id);id=parent.get(id)}}
 return {joints,edges};
}
/** Copy descendants of sourceRoot, joining their first bones to targetId. */
export function attachBranch(target:Armature,targetId:number,source:Armature,sourceRoot:number):Armature{
 const anchor=target.joints.find(j=>j.id===targetId),root=source.joints.find(j=>j.id===sourceRoot);if(!anchor||!root)throw Error('Choose valid attachment joints');
 const descendants=new Set([sourceRoot]);let changed=true;while(changed){changed=false;for(const [a,b] of source.edges)if(descendants.has(a)&&!descendants.has(b)){descendants.add(b);changed=true}}
 if(descendants.size===1)throw Error('Choose a source joint with a branch extending from it');
 if(target.joints.length+descendants.size-1>500)throw Error('Combined creature exceeds 500 joints');
 let next=Math.max(-1,...target.joints.map(j=>j.id))+1;const idMap=new Map<number,number>([[sourceRoot,targetId]]);const resultJoints=target.joints.map(j=>({...j,metadata:copyNodeMetadata(j.metadata),tag:j.tag?{...j.tag}:undefined}));
 for(const j of source.joints)if(descendants.has(j.id)&&j.id!==sourceRoot){const id=next++;idMap.set(j.id,id);resultJoints.push({...j,metadata:copyNodeMetadata(j.metadata),id,x:j.x-root.x+anchor.x,y:j.y-root.y+anchor.y,z:j.z-root.z+anchor.z,tag:j.tag?{...j.tag}:undefined})}
 const resultEdges:Edge[]=target.edges.map(([a,b])=>[a,b]);for(const [a,b] of source.edges)if(descendants.has(a)&&descendants.has(b))resultEdges.push([idMap.get(a)!,idMap.get(b)!]);
 if(resultEdges.length>1000)throw Error('Combined creature exceeds 1,000 bones');return {joints:resultJoints,edges:resultEdges};
}
