const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),base=process.env.QA_BASE||'http://127.0.0.1:8765';
(async()=>{
const model=await import(pathToFileURL(path.join(root,'src/vol-stop.mjs')).href);
const browser=await chromium.launch({headless:true}),page=await browser.newPage();
const errors=[],report={states:[],terms:[],checks:[]};
page.on('pageerror',e=>errors.push(e.message));
page.on('response',r=>{if(r.status()>=400)errors.push(r.status()+' '+r.url())});
await page.route('**/__version',route=>route.fulfill({body:'vol-stop-qa'}));
async function bounds(){
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 const clipped=await page.locator('.lab .chart svg').evaluateAll(svgs=>svgs.flatMap(s=>[...s.querySelectorAll('text')].filter(t=>{const r=t.getBBox(),v=s.viewBox.baseVal;return r.x< -1||r.y< -1||r.x+r.width>v.width+1||r.y+r.height>v.height+1}).map(t=>t.textContent)));
 assert.deepEqual(clipped,[]);
}
async function imageReady(){for(const img of await page.locator('.pairs-figure img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}}
const fmt=v=>v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
async function results(scenario,lambda,k,gap){
 const levels=model.stopScenario({scenario,gap});
 const table=page.locator('#pair-vol-stop-lab tbody tr');
 for(const [i,mode]of ['frozen','moving'].entries()){
  const r=model.runVolStop({levels,lambda,k,mode});
  assert.match(await table.nth(i).innerText(),new RegExp(fmt(r.netPnl).replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
  assert.match(await table.nth(i).innerText(),new RegExp('/ '+r.exit));
 }
 await bounds();
}
try{
 for(const width of [1440,390,320])for(const theme of ['light','dark']){
  await page.setViewportSize({width,height:1050});
  await page.goto(base+'/pairs-trading-volatility-stop.html');
  await page.waitForFunction(()=>document.querySelectorAll('#pair-vol-stop-lab .chart svg').length===2);
  await page.evaluate(t=>document.documentElement.setAttribute('data-theme',t),theme);
  await page.evaluate(()=>document.fonts.ready);await imageReady();await bounds();
  assert.equal(await page.locator('.pairs-figure img').count(),3);
  assert.equal(await page.locator('.katex-error').count(),0);
  await page.addScriptTag({path:require.resolve('axe-core')});
  const axe=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
  assert.deepEqual(axe.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)})),[]);
  await page.locator('#pair-vol-stop-lab').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(__dirname,`vol-stop-${theme}-${width}.png`)});
  report.states.push({width,theme,overflow:false,axeViolations:0});
 }
 await results('gap',.94,3,12);
 const lab=page.locator('#pair-vol-stop-lab');
 const ranges=lab.locator('input[type=range]');
 await ranges.nth(0).focus();await page.keyboard.press('Home');
 await ranges.nth(1).focus();await page.keyboard.press('End');
 await results('gap',.8,5,12);
 await ranges.nth(2).focus();await page.keyboard.press('End');await results('gap',.8,5,20);
 await ranges.nth(2).focus();await page.keyboard.press('Home');await results('gap',.8,5,4);
 for(const [scenario,name]of [['drift','ค่อย ๆ ฉีกออก'],['volatile','ผันผวนขึ้นรอบ mean เดิม']]){
  await lab.getByRole('button',{name,exact:true}).focus();await page.keyboard.press('Enter');
  assert.equal(await ranges.count(),2);await results(scenario,.8,5,4);
 }
 report.checks.push('Keyboard scenario/range controls; both stop results match numerical model at default and edge parameters');
 for(const [id,en,th]of [['conditional-volatility','conditional volatility','ความผันผวน'],['ewma','ewma','กำลังสอง'],['structural-break','structural break','โครงสร้าง'],['risk-circuit-breaker','circuit breaker','พักการรับ']]){
  await page.goto(base+'/glossary.html#'+id);const q=page.locator('#glossary-query'),term=page.locator('#'+id);
  assert.equal(await term.isVisible(),true);
  for(const text of [en,th]){await q.fill(text);assert.equal(await term.isVisible(),true);}
  await q.fill('zz-no-vol-term');assert.equal(await page.locator('.glossary-term:visible').count(),0);
  await q.focus();await page.keyboard.press('ControlOrMeta+A');await page.keyboard.press('Backspace');
  const a=term.locator('a').first(),href=await a.getAttribute('href');await a.focus();await page.keyboard.press('Enter');
  await page.waitForURL(new URL(href,base+'/').href);assert.equal(await page.locator(new URL(page.url()).hash).count(),1);await bounds();
  report.terms.push(id);
 }
 await page.goto(base+'/');assert.equal(await page.locator('.welcome-lesson').count(),5);
 assert.ok(await page.locator('a[href="pairs-trading-volatility-stop.html"]').count()>=2);
 await page.locator('#menu-button').click();await page.locator('#search-button').click();await page.locator('#search-input').fill('EWMA');
 assert.ok(await page.locator('#search-results a[href*="pairs-trading-volatility-stop"]').count()>0);
 report.checks.push('Five homepage chapters, EWMA site search and four glossary terms with direct anchors, Thai/English/empty searches and keyboard return links');
 const offline=await browser.newPage({viewport:{width:390,height:1050}}),requests=[];
 offline.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url())});
 await offline.route(/^https?:/,r=>r.abort());
 await offline.goto(pathToFileURL(path.join(root,'_site/pairs-trading-volatility-stop.html')).href);
 await offline.waitForFunction(()=>document.querySelectorAll('#pair-vol-stop-lab .chart svg').length===2);
 for(const img of await offline.locator('.pairs-figure img').all()){await img.scrollIntoViewIfNeeded();await img.evaluate(i=>i.decode());}
 assert.deepEqual(requests,[]);await offline.close();
 // Direct SVG text inspection catches labels clipped by the image boundary.
 for(const name of ['pairs-fx-snb-policy','pairs-fx-ewma-shock','pairs-vol-stop-widening']){
  await page.goto(base+'/assets/images/'+name+'.svg');await page.evaluate(()=>document.fonts.ready);
  const clipped=await page.evaluate(()=>{const s=document.querySelector('svg').getBoundingClientRect();return [...document.querySelectorAll('text')].filter(t=>{const r=t.getBoundingClientRect();return r.left<s.left-1||r.right>s.right+1||r.top<s.top-1||r.bottom>s.bottom+1}).map(t=>t.textContent)});
  assert.deepEqual(clipped,[]);
 }
 assert.deepEqual(errors,[]);report.status='passed';report.checks.push('Offline new lesson and three figures; SVG label bounds; no page errors or failed responses');
 fs.writeFileSync(path.join(__dirname,'vol-stop-page-report.json'),JSON.stringify(report,null,2));
 console.log('Vol stop pages passed: 6 responsive/theme states, 3 SVGs, 2 interactive charts, keyboard, numerical UI parity, 4 glossary terms, homepage/search and offline export.');
}finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
