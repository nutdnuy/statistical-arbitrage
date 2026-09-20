import React, {useMemo, useState} from 'react';
import {Chart, LabTitle, Range, format} from './ui.jsx';
import {VOL_STOP, stopScenario, runVolStop} from './vol-stop.mjs';
const bounds = values => {const lo=Math.min(0,...values), hi=Math.max(0,...values), pad=Math.max(.5,(hi-lo)*.1);return [lo-pad,hi+pad];};
const labels = {gap:'กระโดดแล้วไม่กลับ',drift:'ค่อย ๆ ฉีกออก',volatile:'ผันผวนขึ้นรอบ mean เดิม'};
export function VolStopLab(){
 const [scenario,setScenario]=useState('gap'),[lambda,setLambda]=useState(.94),[k,setK]=useState(3),[gap,setGap]=useState(12);
 const levels=useMemo(()=>stopScenario({scenario,gap}),[scenario,gap]);
 const fixed=useMemo(()=>runVolStop({levels,lambda,k}),[levels,lambda,k]);
 const moving=useMemo(()=>runVolStop({levels,lambda,k,mode:'moving'}),[levels,lambda,k]);
 const r=fixed.rows, xs=[60,80,100,120,130];
 const horizontal=value=>({values:[[60,value],[130,value]],className:'zero-line'});
 return <div className="lab"><LabTitle number="เพิ่มเติม" title="Vol สูงขึ้น จะเลื่อน Stop ออกไปหรือไม่">ข้อมูลจำลอง · seed {VOL_STOP.seed} · Long A / Short B อย่างละ q หน่วย ณ close 60 · เหตุการณ์เริ่มวัน 80</LabTitle>
 <div className="segmented" aria-label="สถานการณ์ของ Spread">{Object.entries(labels).map(([id,label])=><button key={id} aria-pressed={scenario===id} onClick={()=>setScenario(id)}>{label}</button>)}</div>
 <div className="controls two"><Range label="น้ำหนักความจำ λ" value={lambda} onChange={setLambda} min={.8} max={.99} step={.01}/><Range label="ระยะ Stop k เท่าของ σ ก่อนเข้า" value={k} onChange={setK} min={2} max={5} step={.5}/></div>
 {scenario==='gap'&&<Range label="ขนาดกระโดดผิดทาง" value={gap} onChange={setGap} min={4} max={20} step={1} suffix=" USD ต่อหน่วย"/>}
 <Chart title="ขาดทุนต่อหน่วยกับระยะ Stop" description="เส้นขาดทุนต่อหน่วยเทียบกับระยะตรึงก่อนเข้าและระยะที่ขยายตาม volatility ล่าสุด ทั้งสองตัดสินใจหลัง close และ fill close ถัดไป" xDomain={[60,130]} yDomain={bounds([...r.map(x=>x.adverse),...moving.rows.map(x=>x.limit),fixed.distance])} xTicks={xs} xLabel="วันจำลอง" yLabel="ระยะ / ขาดทุน (USD)" lines={[{values:r.map(x=>[x.day,x.adverse])},horizontal(fixed.distance),{values:moving.rows.map(x=>[x.day,x.limit]),className:'secondary-line'}]} verticals={[80]} markers={[fixed,moving].map(x=>({x:x.exit,y:levels[60]-levels[x.exit],className:x.mode==='frozen'?'point':'expected-point'}))}/>
 <p className="lab-note">ม่วง: ขาดทุนก่อนต้นทุนต่อหน่วย หากยังถือ · เส้นแนวนอน: Stop ตรึงก่อนเข้า · เขียวประ: Stop ที่ปรับตาม vol หลังเห็นข้อมูลวันนี้ · จุด: วัน fill ของแต่ละวิธี · เส้นตั้ง: วัน 80</p>
 <Chart title="มูลค่าบัญชีหลังต้นทุน" description="เงินเริ่มต้น 10000 ดอลลาร์ ไม่มีการเปิดใหม่หลังปิด ค่าธรรมเนียม5bpsทั้งสองขาทั้งตอนเข้าและออก" xDomain={[60,130]} yDomain={bounds([...r,...moving.rows].map(x=>x.equity-10000))} xTicks={xs} xLabel="วันจำลอง" yLabel="P&L สุทธิ (USD)" lines={[horizontal(0),{values:r.map(x=>[x.day,x.equity-10000])},{values:moving.rows.map(x=>[x.day,x.equity-10000]),className:'secondary-line'}]}/>
 <div className="legend"><span className="mean-key">Stop ตรึงก่อนเข้า</span><span className="median-key">Stop ขยับตาม vol ล่าสุด</span></div>
 <div className="table-wrap" tabIndex="0" role="region" aria-label="ผลของกติกา Stop เลื่อนตารางได้"><table><caption>หนึ่งสถานะที่กำหนดวันเข้าล่วงหน้า ไม่ใช่ผลทดสอบกลยุทธ์เลือกจังหวะ</caption><thead><tr><th scope="col">กติกา</th><th scope="col">สัญญาณ / Fill</th><th scope="col">PnL สุทธิ</th><th scope="col">ขาดทุน / งบ 100 USD</th></tr></thead><tbody>{[fixed,moving].map(x=><tr key={x.mode}><th scope="row">{x.mode==='frozen'?'ตรึงก่อนเข้า':'ขยับตาม vol'}</th><td>{x.signal===null?'ครบเวลาถือ':x.signal} / {x.exit}</td><td>{format(x.netPnl)} USD</td><td>{format(x.budgetMultiple)} เท่า</td></tr>)}</tbody></table></div>
 <p className="lab-note" role="status">q = {format(fixed.quantity,3)} หน่วยต่อขา · σ ก่อนเข้า = {format(fixed.forecast.sigma[60],3)} USD · ระยะ Stop = {format(fixed.distance,3)} USD · งบขาดทุนก่อนต้นทุนตามระยะ = {format(fixed.plannedGrossLoss)} USD · Gross ณ fill = {format(fixed.grossAtFill)} USD</p>
 <p className="lab-note">เงินทุน 10,000 USD · งบก่อนต้นทุน 100 USD · จำกัด gross เป้าหมาย 20,000 USD จากราคา close 59 · จำนวนหน่วยตรึงจนปิด · ค่าธรรมเนียม 5 bps ทุกขาทุก fill · หากไม่ชน Stop ปิด close 100 ตามเวลาที่กำหนดไว้ · ไม่รวมค่ายืม ดอกเบี้ย margin call และ slippage เพิ่มเติม</p>
 <p className="lab-note">ตัวอย่างนี้แยกกติกา Stop สองแบบเพื่อดูผลของการขยายระยะ ยังไม่ได้เพิ่มวงจรหยุดระบบจากข่าวหรือเพดานขาดทุนสุทธิรายวัน หลังปิดไม่เปิดใหม่ ผลจึงใช้เปรียบเทียบกลไก ไม่ได้พิสูจน์ว่าวิธีหนึ่งดีที่สุดทุกตลาด</p>
 </div>;
}
