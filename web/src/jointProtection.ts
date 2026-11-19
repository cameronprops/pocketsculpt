import type {Joint} from './mesh';
/** Zero within connector region, smooth transition outside, one beyond feather. */
export function jointEditWeight(x:number,y:number,z:number,joints:Joint[]):number{
 let weight=1;for(const j of joints){if(!j.connector)continue;const sx=j.scaleX??1,sy=j.scaleY??1,sz=j.scaleZ??j.flatten??1;const distance=Math.hypot((x-j.x)/sx,(y-j.y)/sy,(z-j.z)/sz),inner=j.r+.10,feather=Math.max(.12,j.r*.55),t=Math.max(0,Math.min(1,(distance-inner)/feather)),w=t*t*(3-2*t);weight=Math.min(weight,w);if(weight===0)break}return weight;
}
