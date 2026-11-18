import * as THREE from 'three';

/** Subdivide shared triangle edges and gently relax the surface for sculpting. */
export function refineForSculpt(source: THREE.BufferGeometry, maxVertices=50000): THREE.BufferGeometry {
  const p=source.getAttribute('position'), index=source.getIndex();
  if(!p||!index) throw Error('Expected an indexed body mesh');
  if(p.count+index.count/2>maxVertices) return source.clone();
  const positions=Array.from(p.array as ArrayLike<number>), faces:number[]=[], edges=new Map<string,number>();
  function mid(a:number,b:number){const key=a<b?`${a}:${b}`:`${b}:${a}`;const existing=edges.get(key);if(existing!==undefined)return existing;const i=positions.length/3;positions.push((positions[a*3]+positions[b*3])/2,(positions[a*3+1]+positions[b*3+1])/2,(positions[a*3+2]+positions[b*3+2])/2);edges.set(key,i);return i}
  for(let i=0;i<index.count;i+=3){const a=index.getX(i),b=index.getX(i+1),c=index.getX(i+2),ab=mid(a,b),bc=mid(b,c),ca=mid(c,a);faces.push(a,ab,ca,ab,b,bc,ca,bc,c,ab,bc,ca)}
  const neighbors=Array.from({length:positions.length/3},()=>new Set<number>());
  for(let i=0;i<faces.length;i+=3){const [a,b,c]=faces.slice(i,i+3);neighbors[a].add(b).add(c);neighbors[b].add(a).add(c);neighbors[c].add(a).add(b)}
  const original=positions.slice();for(let i=0;i<neighbors.length;i++){let x=0,y=0,z=0;for(const j of neighbors[i]){x+=original[j*3];y+=original[j*3+1];z+=original[j*3+2]}const count=neighbors[i].size;if(count){const t=.3;positions[i*3]=original[i*3]*(1-t)+x/count*t;positions[i*3+1]=original[i*3+1]*(1-t)+y/count*t;positions[i*3+2]=original[i*3+2]*(1-t)+z/count*t}}
  const result=new THREE.BufferGeometry();result.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));result.setIndex(faces);result.computeVertexNormals();return result;
}
