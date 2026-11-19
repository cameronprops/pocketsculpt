import type {Joint,Edge} from './mesh';
export type Silhouette='balanced'|'broad'|'curved';
/** Editable artist's mannequin proportions, with neck, limb joints, hands and feet. */
export function maquette(shape:Silhouette,arms:boolean):{joints:Joint[];edges:Edge[]}{
 const shoulder=shape==='broad'?.49:shape==='curved'?.38:.43,hip=shape==='curved'?.27:shape==='broad'?.21:.24;
 const pts=[[0,0,0,.25],[0,.66,0,shape==='broad'?.30:.27],[0,1.30,0,.19],[-shoulder,.61,0,.12],[-shoulder-.16,.20,0,.105],[shoulder,.61,0,.12],[shoulder+.16,.20,0,.105],[-hip,-.67,0,.145],[-hip,-1.30,0,.095],[hip,-.67,0,.145],[hip,-1.30,0,.095],[0,1.02,0,.10],[-shoulder-.27,-.18,0,.075],[-shoulder-.30,-.34,.025,.095],[shoulder+.27,-.18,0,.075],[shoulder+.30,-.34,.025,.095],[-hip,-1.37,.18,.09],[hip,-1.37,.18,.09],[-hip,-.14,0,.15],[hip,-.14,0,.15]];
 const edges:Edge[]=[[0,1],[1,11],[11,2],[1,3],[3,4],[4,12],[12,13],[1,5],[5,6],[6,14],[14,15],[0,18],[18,7],[7,8],[8,16],[0,19],[19,9],[9,10],[10,17]];
 const omitted=new Set(arms?[]:[3,4,5,6,12,13,14,15]);return {joints:pts.map(([x,y,z,r],id)=>({id,x,y,z,r})).filter(j=>!omitted.has(j.id)),edges:edges.filter(([a,b])=>!omitted.has(a)&&!omitted.has(b))};
}
