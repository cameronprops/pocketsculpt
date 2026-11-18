const DB_NAME='pocket-sculpt-projects', STORE='projects', KEY='autosave', LEGACY_KEY='pocket-sculpt-web-v06';
let dbPromise:Promise<IDBDatabase>|null=null;
function database():Promise<IDBDatabase>{
 if(!dbPromise)dbPromise=new Promise((resolve,reject)=>{if(!globalThis.indexedDB){reject(Error('Storage unavailable'));return}const request=indexedDB.open(DB_NAME,1);request.onupgradeneeded=()=>{if(!request.result.objectStoreNames.contains(STORE))request.result.createObjectStore(STORE)};request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);request.onblocked=()=>reject(Error('Storage blocked'))});
 return dbPromise;
}
export async function loadAutosave():Promise<string|null>{
 let stored:string|null=null;
 try{const db=await database();stored=await new Promise((resolve,reject)=>{const tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).get(KEY);request.onsuccess=()=>resolve(typeof request.result==='string'?request.result:null);request.onerror=()=>reject(request.error);tx.onabort=()=>reject(tx.error)})}catch{/* Legacy storage can still be read. */}
 if(stored!==null)return stored;
 try{return localStorage.getItem(LEGACY_KEY)}catch{return null}
}
export async function saveAutosave(value:string):Promise<void>{
 const db=await database();
 await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(value,KEY);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)});
}
