import test from 'node:test';
import assert from 'node:assert/strict';
import {dateTimestamp,monthTimestamp,timelineSnapshot} from '../timeline.js';
import {calculate,defaults,normalize} from '../calculator.js';
const date=timestamp=>new Date(timestamp).toISOString().slice(0,10);
test('month-end anniversaries clamp without drifting, including leap years',()=>{
 assert.equal(date(monthTimestamp('2024-01-31',1)),'2024-02-29');
 assert.equal(date(monthTimestamp('2024-01-31',2)),'2024-03-31');
 assert.equal(date(monthTimestamp('2024-02-29',12)),'2025-02-28');
});
test('invalid calendar dates rejected; older saved inputs receive a start date',()=>{
 for(const value of ['2025-02-29','2026-04-31','',null])assert.throws(()=>dateTimestamp(value));
 assert.ok(normalize({price:10000}).startDate);
});
test('today at start and endpoint uses the exact corresponding results',()=>{
 const c=calculate({...defaults,startDate:'2026-01-01',months:12});
 for(const [day,index] of [['2026-01-01',0],['2027-01-01',12]]){
  const t=timelineSnapshot(c.rows,c.d.startDate,day);assert.equal(t.state,'during');
  assert.equal(t.snapshot.balance,c.rows[index].balance);assert.equal(t.snapshot.value,c.rows[index].value);
 }
});
test('mid-month debt stays at last payment, value and mileage interpolate',()=>{
 const c=calculate({...defaults,startDate:'2026-01-01'}),t=timelineSnapshot(c.rows,c.d.startDate,'2026-01-16');
 assert.equal(t.snapshot.balance,c.rows[0].balance);
 assert.ok(t.snapshot.value<c.rows[0].value&&t.snapshot.value>c.rows[1].value);
 assert.ok(t.snapshot.odometer>c.rows[0].odometer&&t.snapshot.odometer<c.rows[1].odometer);
 assert.equal(t.snapshot.cost+t.snapshot.value,c.rows[0].cost+c.rows[0].value);
});
test('today outside ownership is explicitly before or after, without extrapolation',()=>{
 const c=calculate({...defaults,startDate:'2026-01-01',months:12});
 for(const [day,state] of [['2025-12-31','before'],['2027-01-02','after']]){
  const t=timelineSnapshot(c.rows,c.d.startDate,day);assert.equal(t.state,state);assert.equal(t.snapshot,null);
 }
});
test('current balance reflects early payoff on its monthly anniversary',()=>{
 const c=calculate({...defaults,startDate:'2026-01-31',payoff:1});
 assert.ok(timelineSnapshot(c.rows,c.d.startDate,'2026-02-27').snapshot.balance>0);
 assert.equal(timelineSnapshot(c.rows,c.d.startDate,'2026-02-28').snapshot.balance,0);
});
