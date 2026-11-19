import test from 'node:test';
import assert from 'node:assert/strict';
import {PicnicLayout} from '../.test-build/assets/style2/layout.js';
const state=(n,hero)=>({seatCount:n,mySeat:hero,players:Array.from({length:n},(_,i)=>({seat:i+1,cards:i+1===hero?[1,2]:[0,0]})),community:[1,2,3],actions:['fold','call','raise']});
test('picnic layout preserves all seat IDs and leaves shared snapshots unchanged',()=>{
 for(const id of ['original','balanced','classic','oval'])for(const n of [2,3,4,5,6,7,8,9])for(const hero of [0,1,n]){
  const layout=new PicnicLayout(id);layout.resize(440,782,false,706);const s=state(n,hero),before=JSON.stringify(s),p=layout.positions(s);
  assert.deepEqual([...p.keys()],Array.from({length:n},(_,i)=>i+1));assert.equal(JSON.stringify(s),before);
  for(const v of p.values()){assert.ok(Number.isFinite(v.x)&&Number.isFinite(v.y)&&v.scale>0);assert.ok(v.x>=0&&v.x<=layout.width&&v.y>=0&&v.y<=layout.height);}
 }
});
test('picnic keeps classic second-board half-card pitch and other layouts separated',()=>{
 for(const id of ['original','balanced','classic','oval']){const l=new PicnicLayout(id);l.resize(440,782,false,706);const c=l.content({dual:true,boardSize:1,jackpotHeight:0});const gap=c.secondBoard.y-c.board.y,cardHeight=176*c.board.scale;assert.ok(id==='classic'?Math.abs(gap/cardHeight-.5)<.001:gap>=cardHeight);}
});
test('picnic distributes added height and reserves navigation on long screens',()=>{
 const a=new PicnicLayout('balanced'),b=new PicnicLayout('balanced');a.resize(440,782,false,706);b.resize(440,956,false,880);const s=state(8,1),pa=a.positions(s),pb=b.positions(s);
 assert.ok(pb.get(2).y>pa.get(2).y);assert.ok(pb.get(1).y>pa.get(1).y);
 assert.equal(parseFloat(b.controls(s,1).styles.top)+60,880);
});
