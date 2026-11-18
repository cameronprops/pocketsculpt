import * as THREE from 'three';

/** Blend a soft, optionally mirrored color stroke into an indexed mesh. */
export function paintMesh(geometry: THREE.BufferGeometry, point: THREE.Vector3, color: THREE.Color, radius: number, opacity: number, mirror: boolean): boolean {
  const positions = geometry.getAttribute('position');
  const colors = geometry.getAttribute('color') as THREE.BufferAttribute;
  if (!positions || !colors || radius <= 0 || opacity <= 0) return false;
  let changed = false;
  for (let i = 0; i < positions.count; i++) {
    const x=positions.getX(i), y=positions.getY(i), z=positions.getZ(i);
    const dy=y-point.y, dz=z-point.z;
    let distance=Math.hypot(x-point.x,dy,dz);
    if(mirror) distance=Math.min(distance,Math.hypot(x+point.x,dy,dz));
    let falloff=Math.max(0,1-distance/radius);
    if(!falloff) continue;
    falloff=falloff*falloff*(3-2*falloff)*Math.min(1,opacity);
    colors.setXYZ(i,colors.getX(i)+(color.r-colors.getX(i))*falloff,colors.getY(i)+(color.g-colors.getY(i))*falloff,colors.getZ(i)+(color.b-colors.getZ(i))*falloff);
    changed=true;
  }
  if(changed) colors.needsUpdate=true;
  return changed;
}
