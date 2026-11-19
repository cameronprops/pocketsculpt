/** Optional application-defined node data. No animation behavior is implied. */
export type MetadataValue=null|boolean|number|string|MetadataValue[]|{[key:string]:MetadataValue};
export type NodeMetadata=Record<string,MetadataValue>;
export function validNodeMetadata(value:unknown):value is NodeMetadata{
 if(!value||typeof value!=='object'||Array.isArray(value))return false;
 let count=0;function visit(v:unknown,depth:number):boolean{if(++count>2048||depth>12)return false;if(v===null||typeof v==='boolean')return true;if(typeof v==='number')return Number.isFinite(v);if(typeof v==='string')return v.length<=4096;if(Array.isArray(v))return v.length<=512&&v.every(x=>visit(x,depth+1));if(typeof v==='object'){const obj=v as Record<string,unknown>,keys=Object.keys(obj);return keys.length<=256&&keys.every(k=>k.length<=128&&visit(obj[k],depth+1))}return false}return visit(value,0);
}
export function copyNodeMetadata(value:NodeMetadata|undefined):NodeMetadata|undefined{return value===undefined?undefined:JSON.parse(JSON.stringify(value)) as NodeMetadata}
