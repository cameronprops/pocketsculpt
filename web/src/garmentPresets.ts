import type {Edge} from './mesh';
import type {Shell} from './garment';
export type GarmentPreset='shirt'|'jacket'|'pants'|'necklace'|'bracelets';
const figureEdges:Edge[]=[[0,1],[1,2],[1,3],[3,4],[1,5],[5,6],[0,7],[7,8],[0,9],[9,10]];
const plans:Record<GarmentPreset,{a:number;b:number;band?:boolean}[]>={shirt:[{a:0,b:1},{a:1,b:3},{a:1,b:5}],jacket:[{a:0,b:1},{a:1,b:3},{a:3,b:4},{a:1,b:5},{a:5,b:6}],pants:[{a:0,b:7},{a:7,b:8},{a:0,b:9},{a:9,b:10}],necklace:[{a:1,b:2,band:true}],bracelets:[{a:3,b:4,band:true},{a:5,b:6,band:true}]};
export function garmentPreset(name:GarmentPreset,edges:Edge[],gap:number,thickness:number):Shell[]|null{
 if(!Object.prototype.hasOwnProperty.call(plans,name))return null;
 const has=(a:number,b:number)=>edges.some(e=>e[0]===a&&e[1]===b);
 const stick=edges.length===figureEdges.length&&figureEdges.every(([a,b])=>has(a,b));
 const maquetteEdges:Edge[]=[[0,1],[1,11],[11,2],[1,3],[3,4],[4,12],[12,13],[1,5],[5,6],[6,14],[14,15],[0,18],[18,7],[7,8],[8,16],[0,19],[19,9],[9,10],[10,17]];
 const maquette=edges.length===maquetteEdges.length&&maquetteEdges.every(([a,b])=>has(a,b));
 if(!stick&&!maquette)return null;
 const plan=maquette&&name==='pants'?[{a:0,b:18},{a:18,b:7},{a:7,b:8},{a:0,b:19},{a:19,b:9},{a:9,b:10}]:maquette&&name==='necklace'?[{a:1,b:11,band:true}]:maquette&&name==='jacket'?[...plans.jacket,{a:4,b:12},{a:6,b:14}]:maquette&&name==='bracelets'?[{a:4,b:12,band:true},{a:6,b:14,band:true}]:plans[name];
 return plan.map(({a,b,band})=>({a,b,band:!!band,gap,thickness}));
}
