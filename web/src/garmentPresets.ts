import type {Edge} from './mesh';
import type {Shell} from './garment';
export type GarmentPreset='shirt'|'jacket'|'pants'|'necklace'|'bracelets';
const figureEdges:Edge[]=[[0,1],[1,2],[1,3],[3,4],[1,5],[5,6],[0,7],[7,8],[0,9],[9,10]];
const plans:Record<GarmentPreset,{a:number;b:number;band?:boolean}[]>={shirt:[{a:0,b:1},{a:1,b:3},{a:1,b:5}],jacket:[{a:0,b:1},{a:1,b:3},{a:3,b:4},{a:1,b:5},{a:5,b:6}],pants:[{a:0,b:7},{a:7,b:8},{a:0,b:9},{a:9,b:10}],necklace:[{a:1,b:2,band:true}],bracelets:[{a:3,b:4,band:true},{a:5,b:6,band:true}]};
export function garmentPreset(name:GarmentPreset,edges:Edge[],gap:number,thickness:number):Shell[]|null{
 if(!Object.prototype.hasOwnProperty.call(plans,name)||edges.length!==figureEdges.length||!figureEdges.every(([a,b])=>edges.some(e=>e[0]===a&&e[1]===b)))return null;
 return plans[name].map(({a,b,band})=>({a,b,band:!!band,gap,thickness}));
}
