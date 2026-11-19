/** Bounded snapshot history. One completed interaction contributes one entry. */
export class SnapshotHistory{
 private past:string[]=[];private future:string[]=[];
 constructor(private maxEntries=30,private maxChars=12000000){}
 remember(previous:string):void{this.past.push(previous);this.future=[];while(this.past.length>this.maxEntries||(this.past.length>1&&this.past.reduce((n,s)=>n+s.length,0)>this.maxChars))this.past.shift()}
 rememberChange(previous:string,current:string,moved:boolean):boolean{if(!moved||previous===current)return false;this.remember(previous);return true}
 undo(current:string):string|undefined{const s=this.past.pop();if(s!==undefined)this.future.push(current);return s}
 redo(current:string):string|undefined{const s=this.future.pop();if(s!==undefined)this.past.push(current);return s}
}
