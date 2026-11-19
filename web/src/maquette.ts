import type {Joint,Edge} from './mesh';
export type Silhouette='balanced'|'broad'|'curved';
/** A proportioned armature, intentionally editable and not a representation of gender. */
export function maquette(shape:Silhouette,arms:boolean):{joints:Joint[];edges:Edge[]}{
 const shoulder=shape==='broad'?.54:shape==='curved'?.39:.46,hip=shape==='curved'?.31:shape==='broad'?.23:.27;
 const pts=[[0,0,0,.28],[0,.68,0,shape==='broad'?.31:.27],[0,1.27,0,.22],[-shoulder,.62,0,.13],[-shoulder-.37,.03,0,.105],[shoulder,.62,0,.13],[shoulder+.37,.03,0,.105],[-hip,-.68,0,.17],[-hip,-1.35,0,.115],[hip,-.68,0,.17],[hip,-1.35,0,.115]];
 const edges:Edge[]=[[0,1],[1,2],[1,3],[3,4],[1,5],[5,6],[0,7],[7,8],[0,9],[9,10]];
 const omitted=new Set(arms?[]:[3,4,5,6]);return {joints:pts.map(([x,y,z,r],id)=>({id,x,y,z,r})).filter(j=>!omitted.has(j.id)),edges:edges.filter(([a,b])=>!omitted.has(a)&&!omitted.has(b))};
}
