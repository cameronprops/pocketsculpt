import {validNodeMetadata} from '../src/nodeMetadata';
import {readArmature,attachBranch} from '../src/parts';
const metadata={custom:{name:'elbow',future:{time:1,position:[1,2,3],scale:[1,1,.5]}},enabled:true};
if(!validNodeMetadata(metadata)||validNodeMetadata({bad:Infinity})||validNodeMetadata([]))throw Error('metadata validation');
const input=JSON.stringify({joints:[{id:0,x:0,y:0,z:0,r:.2},{id:1,x:1,y:0,z:0,r:.2,metadata}],edges:[[0,1]]});const source=readArmature(input),target=readArmature(input),result=attachBranch(target,0,source,0);const clone=result.joints.find(j=>j.id===2);if(JSON.stringify(clone?.metadata)!==JSON.stringify(metadata))throw Error('metadata lost during attach');(clone!.metadata!.custom as any).name='changed';if((source.joints[1].metadata!.custom as any).name!=='elbow')throw Error('metadata alias');console.log('Node metadata validates, round-trips and copies independently');
