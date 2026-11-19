import * as THREE from 'three';
export function validMillimetersPerUnit(v:unknown):v is number{return typeof v==='number'&&Number.isFinite(v)&&v>=.001&&v<=100000}
export function snapCoordinate(value:number,stepMm:number,mmPerUnit:number):number{if(!Number.isFinite(value)||!validMillimetersPerUnit(mmPerUnit)||!Number.isFinite(stepMm)||stepMm<=0)return value;const step=stepMm/mmPerUnit;return Math.round(value/step)*step}
export function snapPoint(p:THREE.Vector3,stepMm:number,mmPerUnit:number):THREE.Vector3{return p.set(snapCoordinate(p.x,stepMm,mmPerUnit),snapCoordinate(p.y,stepMm,mmPerUnit),snapCoordinate(p.z,stepMm,mmPerUnit))}
