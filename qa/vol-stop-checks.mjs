import assert from 'node:assert/strict';
import fs from 'node:fs';
import {VOL_STOP,ewmaForecast,stopScenario,runVolStop} from '../src/vol-stop.mjs';
const near=(a,b,tol=1e-8)=>assert.ok(Math.abs(a-b)<tol,`${a} vs ${b}`);
// Hand-computable initialization and update, including a future shock.
const small=[0,1,0,2,5],f=ewmaForecast(small,.5,2);
assert.equal(f.sigma[2],null);near(f.sigma[3],1);near(f.sigma[4],Math.sqrt(2.5));
const changed=ewmaForecast([0,1,0,2,500],.5,2);near(f.sigma[4],changed.sigma[4]);
assert.notEqual(f.next[4],changed.next[4]);
let count=0;
for(const scenario of ['gap','drift','volatile']) for(const lambda of [.8,.94,.99]) for(const k of [2,3,5]) for(const gap of [4,12,20]) for(const mode of ['frozen','moving']) {
 const levels=stopScenario({scenario,gap}),r=runVolStop({levels,lambda,k,mode});
 const q=r.quantity,entry=60,feeAt=i=>.0005*q*(200+levels[i]);
 let equity=10000,qPrevious=0;
 for(const row of r.rows){
  if(row.day>entry) equity+=qPrevious*((100+levels[row.day])-(100+levels[row.day-1]));
  if(row.day===entry)equity-=feeAt(entry);
  if(row.fill)equity-=feeAt(row.day);
  near(row.equity,equity);
  near(row.cash+row.quantityA*(100+levels[row.day])+row.quantityB*100,row.equity);
  qPrevious=row.quantityA;
  if(mode==='frozen')near(row.limit,r.distance);
 }
 near(r.netPnl,q*(levels[r.exit]-levels[entry])-feeAt(entry)-feeAt(r.exit));
 assert.ok(r.plannedGrossLoss<=VOL_STOP.risk+1e-9);
 assert.ok(q*(200+levels[59])<=VOL_STOP.grossCap+1e-9);
 if(r.signal!==null){assert.equal(r.exit,r.signal+1);const s=r.rows.find(x=>x.day===r.signal);assert.ok(s.adverse>=s.limit);}
 else assert.equal(r.exit,100);
 assert.ok(r.rows.filter(x=>x.fill).length===1);
 count++;
}
const base=stopScenario(),perturbed=base.map((x,i)=>i>=80?x+5:x);
const old=runVolStop({levels:base}),future=runVolStop({levels:perturbed});
near(old.quantity,future.quantity);near(old.distance,future.distance);
for(let i=21;i<=80;i++)near(old.forecast.sigma[i],future.forecast.sigma[i]);
assert.ok(old.netPnl < -100,'Gap may exceed the planned risk budget');
const widened=runVolStop({lambda:.8,k:5,mode:'moving'}),frozen=runVolStop({lambda:.8,k:5});
assert.equal(frozen.exit,81);assert.equal(widened.exit,88);
// Reconcile archived figure inputs with today's numerical model.
const saved=JSON.parse(fs.readFileSync(new URL('../data/pairs-vol-stop-demo.json',import.meta.url)));
for(const [name,x] of Object.entries(saved.scenarios))for(const mode of ['frozen','moving']) {
 const fresh=runVolStop({levels:stopScenario({scenario:name}),mode});
 assert.deepEqual(x[mode],fresh);
}
assert.throws(()=>runVolStop({lambda:1}));assert.throws(()=>runVolStop({k:NaN}));
assert.throws(()=>runVolStop({levels:Array(131).fill(0)}));
console.log(`Vol stops passed: ${count} parameter cases; causal EWMA, quantity timing, independent two-leg cash/equity ledger, fees, next-close fills, gap overrun and archived figure parity.`);
