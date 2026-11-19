import {sharpenAmount} from '../src/brush';
const f=(z:number,mean:number,strength=.1,weight=1,radius=1)=>sharpenAmount(0,0,z,0,0,1,0,0,mean,strength,weight,radius);
if(f(0,0)!==0)throw Error('Flat patch moved');if(f(.01,0)<=0||f(-.01,0)>=0)throw Error('Curvature direction incorrect');if(f(.1,0,0)!==0||f(.1,0,.1,0)!==0)throw Error('Zero controls moved');if(Math.abs(f(100,0,1,1,.2))>.00300000001)throw Error('Displacement limit failed');console.log('Sharpen respects flat surfaces, curvature sign, controls and displacement limit');
