export const roles=['standard','root','torso','head','hand','finger','foot','neck','shoulder','elbow','wrist','hip','knee','ankle','wing_root','tail_root'] as const;
export const sides=['unspecified','center','left','right'] as const;
export const parts=['unassigned','torso','head','arm','leg','wing','tail','other'] as const;
export const directions=['unspecified','+x','-x','+y','-y','+z','-z'] as const;
export type JointTag={role:typeof roles[number];side:typeof sides[number];part:typeof parts[number];direction:typeof directions[number]};
export function validTag(value:unknown):value is JointTag{if(!value||typeof value!=='object')return false;const t=value as Record<string,unknown>;return roles.includes(t.role as JointTag['role'])&&sides.includes(t.side as JointTag['side'])&&parts.includes(t.part as JointTag['part'])&&directions.includes(t.direction as JointTag['direction'])}
export function defaultTag():JointTag{return {role:'standard',side:'unspecified',part:'unassigned',direction:'unspecified'}}
