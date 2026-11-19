import * as THREE from 'three';
/** Translate the orbit target so the model follows a two-finger screen drag. */
export function panTarget(target:THREE.Vector3,camera:THREE.PerspectiveCamera,dx:number,dy:number,viewportHeight:number,distance:number):void{
 if(!Number.isFinite(dx)||!Number.isFinite(dy)||!Number.isFinite(viewportHeight)||viewportHeight<=0||!Number.isFinite(distance)||distance<=0)return;
 const unitsPerPixel=2*distance*Math.tan(THREE.MathUtils.degToRad(camera.fov)/2)/viewportHeight;
 const right=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,0),up=new THREE.Vector3().setFromMatrixColumn(camera.matrixWorld,1);
 target.addScaledVector(right,-dx*unitsPerPixel).addScaledVector(up,dy*unitsPerPixel);
}
