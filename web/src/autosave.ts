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
export type GalleryItem={id:string;name:string;kind:'project'|'template';savedAt:number;state:string};
export async function saveGalleryItem(name:string,kind:GalleryItem['kind'],state:string):Promise<void>{const db=await database(),item:GalleryItem={id:`${Date.now()}-${Math.random().toString(36).slice(2)}`,name:name.trim().slice(0,80),kind,savedAt:Date.now(),state};if(!item.name)throw Error('Name required');await new Promise<void>((resolve,reject)=>{const tx=db.transaction(STORE,'readwrite');tx.objectStore(STORE).put(item,`gallery:${item.id}`);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
export async function loadGalleryItems():Promise<GalleryItem[]>{const db=await database();return new Promise((resolve,reject)=>{const items:GalleryItem[]=[],tx=db.transaction(STORE,'readonly'),request=tx.objectStore(STORE).openCursor();request.onsuccess=()=>{const c=request.result;if(!c)return;const v=c.value;if(typeof c.key==='string'&&c.key.startsWith('gallery:')&&v&&typeof v.state==='string'&&typeof v.name==='string'&&(v.kind==='project'||v.kind==='template'))items.push(v as GalleryItem);c.continue()};tx.oncomplete=()=>resolve(items.sort((a,b)=>b.savedAt-a.savedAt));tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error)})}
