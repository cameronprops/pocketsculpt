import * as THREE from 'three';
import type {JointTag} from './jointTags';
export type Joint={id:number;x:number;y:number;z:number;r:number;tag?:JointTag};
export type Edge=[number,number];
const corners:[[number,number,number],[number,number,number],[number,number,number],[number,number,number],[number,number,number],[number,number,number],[number,number,number],[number,number,number]]=[[0,0,0],[1,0,0],[1,1,0],[0,1,0],[0,0,1],[1,0,1],[1,1,1],[0,1,1]];
const tetra=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
export function buildMesh(joints:Joint[],edges:Edge[],step=.17):THREE.BufferGeometry{
 const byId=new Map(joints.map(j=>[j.id,j]));
 const links=edges.map(([a,b])=>[byId.get(a),byId.get(b)]).filter((e):e is [Joint,Joint]=>!!e[0]&&!!e[1]);
 const linked=new Set(links.flatMap(([a,b])=>[a.id,b.id]));const isolated=joints.filter(j=>!linked.has(j.id));
 if(!joints.length)return new THREE.BufferGeometry();
 if(!Number.isFinite(step)||step<=0||joints.some(j=>!Number.isFinite(j.r)||j.r<=0))throw Error('Invalid joint radius or surface detail.');
 // Thin limbs need multiple samples across their diameter, including preview.
 step=Math.min(step,Math.min(...joints.map(j=>j.r))*.75);
 const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const j of joints)for(let k=0;k<3;k++){const v=[j.x,j.y,j.z][k];lo[k]=Math.min(lo[k],v-j.r-.3);hi[k]=Math.max(hi[k],v+j.r+.3)}
 const [nx,ny,nz]=lo.map((v,k)=>Math.ceil((hi[k]-v)/step)+1);
 if(nx*ny*nz>700000)throw Error('The smallest joints are too thin for this model size. Increase their radius or shorten the model, then try again.');
 const index=(i:number,j:number,k:number)=>(i*ny+j)*nz+k;
 const field=(x:number,y:number,z:number)=>{
  // Blend the two closest distinct limbs only. Sequential blending of all
  // joints and bones inflated busy intersections and depended on edge order.
  let first=Infinity,second=Infinity;
  function consider(d:number){if(d<first){second=first;first=d}else if(d<second)second=d}
  for(const [a,b] of links){const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,den=dx*dx+dy*dy+dz*dz;
   const t=den?Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy+(z-a.z)*dz)/den)):0;
   consider(Math.hypot(x-a.x-dx*t,y-a.y-dy*t,z-a.z-dz*t)-(a.r+(b.r-a.r)*t));
  }
  for(const j of isolated)consider(Math.hypot(x-j.x,y-j.y,z-j.z)-j.r);
  if(!Number.isFinite(second))return first;
  const k=.14,h=Math.max(k-Math.abs(first-second),0)/k;
  return first-h*h*k*.25;
 };
 const values=new Float32Array(nx*ny*nz);
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)values[index(i,j,k)]=field(lo[0]+i*step,lo[1]+j*step,lo[2]+k*step);
 type P={id:number;x:number;y:number;z:number;v:number};
 const verts:number[]=[],faces:number[]=[],cache=new Map<string,number>();
 const vertex=(a:P,b:P)=>{const key=a.id<b.id?a.id+':'+b.id:b.id+':'+a.id;const hit=cache.get(key);if(hit!==undefined)return hit;const t=a.v/(a.v-b.v),id=verts.length/3;verts.push(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,a.z+(b.z-a.z)*t);cache.set(key,id);return id};
 const tri=(a:number,b:number,c:number)=>{if(a!==b&&b!==c&&a!==c)faces.push(a,b,c)};
 for(let i=0;i<nx-1;i++)for(let j=0;j<ny-1;j++)for(let k=0;k<nz-1;k++){
  const cell:P[]=corners.map(([di,dj,dk])=>{const I=i+di,J=j+dj,K=k+dk;return{id:index(I,J,K),x:lo[0]+I*step,y:lo[1]+J*step,z:lo[2]+K*step,v:values[index(I,J,K)]}});
  if(cell.every(p=>p.v>=0)||cell.every(p=>p.v<0))continue;
  for(const tet of tetra){const inside=tet.filter(q=>cell[q].v<0),outside=tet.filter(q=>cell[q].v>=0);
   if(inside.length===1)tri(...(outside.map(b=>vertex(cell[inside[0]],cell[b])) as [number,number,number]));
   else if(inside.length===3){const f=inside.map(a=>vertex(cell[a],cell[outside[0]]));tri(f[2],f[1],f[0])}
   else if(inside.length===2){const [a,b]=inside,[c,d]=outside,p=vertex(cell[a],cell[c]),q=vertex(cell[a],cell[d]),r=vertex(cell[b],cell[c]),s=vertex(cell[b],cell[d]);tri(p,q,r);tri(q,s,r)}
  }
 }
 for(let i=0;i<faces.length;i+=3){const ia=faces[i]*3,ib=faces[i+1]*3,ic=faces[i+2]*3;
  const ax=verts[ia],ay=verts[ia+1],az=verts[ia+2],bx=verts[ib],by=verts[ib+1],bz=verts[ib+2],cx=verts[ic],cy=verts[ic+1],cz=verts[ic+2];
  const ux=bx-ax,uy=by-ay,uz=bz-az,vx=cx-ax,vy=cy-ay,vz=cz-az,nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx;
  const x=(ax+bx+cx)/3,y=(ay+by+cy)/3,z=(az+bz+cz)/3,e=.01;
  if(nx*(field(x+e,y,z)-field(x-e,y,z))+ny*(field(x,y+e,z)-field(x,y-e,z))+nz*(field(x,y,z+e)-field(x,y,z-e))<0){const t=faces[i+1];faces[i+1]=faces[i+2];faces[i+2]=t}
 }
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));g.setIndex(faces);g.computeVertexNormals();return g;
}
