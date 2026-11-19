import type {Joint,Edge} from './mesh';
import type {JointTag} from './jointTags';
export type Silhouette='balanced'|'broad'|'curved';
/** Editable artist's mannequin proportions, with neck, limb joints, hands and feet. */
export function maquette(shape:Silhouette,arms:boolean,fingers=false):{joints:Joint[];edges:Edge[]}{
 const shoulder=shape==='broad'?.49:shape==='curved'?.38:.43,hip=shape==='curved'?.27:shape==='broad'?.21:.24;
 const pts=[[0,0,0,.22],[0,.64,0,shape==='broad'?.26:.23],[0,1.28,0,.155],[-shoulder,.61,0,.12],[-shoulder-.16,.20,0,.105],[shoulder,.61,0,.12],[shoulder+.16,.20,0,.105],[-hip,-.67,0,.145],[-hip,-1.30,0,.095],[hip,-.67,0,.145],[hip,-1.30,0,.095],[0,.99,0,.075],[-shoulder-.27,-.18,0,.075],[-shoulder-.30,-.34,.025,.095],[shoulder+.27,-.18,0,.075],[shoulder+.30,-.34,.025,.095],[-hip,-1.37,.18,.09],[hip,-1.37,.18,.09],[-hip,-.14,0,.15],[hip,-.14,0,.14],[0,1.46,0,.14],[0,.28,0,.19]];
 const edges:Edge[]=[[0,21],[21,1],[1,11],[11,2],[2,20],[1,3],[3,4],[4,12],[12,13],[1,5],[5,6],[6,14],[14,15],[0,18],[18,7],[7,8],[8,16],[0,19],[19,9],[9,10],[10,17]];
 const tags:JointTag[]=[
  {role:'root',side:'center',part:'torso',direction:'+y'},{role:'torso',side:'center',part:'torso',direction:'+y'},{role:'head',side:'center',part:'head',direction:'+y'},
  {role:'shoulder',side:'left',part:'arm',direction:'-x'},{role:'elbow',side:'left',part:'arm',direction:'-x'},
  {role:'shoulder',side:'right',part:'arm',direction:'+x'},{role:'elbow',side:'right',part:'arm',direction:'+x'},
  {role:'knee',side:'left',part:'leg',direction:'-y'},{role:'ankle',side:'left',part:'leg',direction:'-y'},
  {role:'knee',side:'right',part:'leg',direction:'-y'},{role:'ankle',side:'right',part:'leg',direction:'-y'},
  {role:'neck',side:'center',part:'head',direction:'+y'},
  {role:'wrist',side:'left',part:'arm',direction:'-x'},{role:'hand',side:'left',part:'arm',direction:'-x'},
  {role:'wrist',side:'right',part:'arm',direction:'+x'},{role:'hand',side:'right',part:'arm',direction:'+x'},
  {role:'foot',side:'left',part:'leg',direction:'+z'},{role:'foot',side:'right',part:'leg',direction:'+z'},
  {role:'hip',side:'left',part:'leg',direction:'-y'},{role:'hip',side:'right',part:'leg',direction:'-y'},{role:'head',side:'center',part:'head',direction:'+y'},{role:'torso',side:'center',part:'torso',direction:'+y'}];
 const omitted=new Set(arms?[]:[3,4,5,6,12,13,14,15]);const joints=pts.map(([x,y,z,r],id)=>({id,x,y,z,r,tag:tags[id]})).filter(j=>!omitted.has(j.id));const connections=edges.filter(([a,b])=>!omitted.has(a)&&!omitted.has(b));
 if(arms&&fingers)for(const [hand,side,sign] of [[13,'left',-1],[15,'right',1]] as const){const base=joints.find(j=>j.id===hand)!;for(let f=0;f<5;f++){const id=22+(side==='right'?10:0)+f*2,offset=(f-2)*.105;const tag:JointTag={role:'finger',side,part:'arm',direction:sign<0?'-x':'+x'};joints.push({id,x:base.x+offset,y:base.y-.16,z:base.z,r:.06,tag},{id:id+1,x:base.x+offset*1.35,y:base.y-.30+(f===0?.08:0),z:base.z,r:.05,tag});connections.push([hand,id],[id,id+1])}}
 return {joints,edges:connections};
}
