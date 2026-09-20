---
title: Statistical Arbitrage
description: ซีรีส์ Pairs Trading ภาษาไทย จากพอร์ต Long–Short และ Cointegration ไปจนถึง Backtest และ Machine Learning พร้อมกราฟ ห้องทดลอง และ Python Notebook
---

# Statistical Arbitrage

<div class="welcome-hero">
<p class="welcome-kicker">QuantCorner · Pairs Trading</p>
<div class="welcome-lead">ศึกษาความสัมพันธ์ของราคา<br>สร้างกลยุทธ์ Pairs Trading</div>
<p class="welcome-summary">เริ่มจากกำไรขาดทุนของพอร์ตสองขา ตรวจว่าราคามีแนวโน้มร่วมกันหรือไม่ แล้วทดสอบกติกาซื้อขายและโมเดลทำนายด้วยข้อมูลที่แยกตามเวลา</p>
<div class="welcome-actions"><a class="button primary" href="statistical-arbitrage.html">เริ่มจากตอนแรก <span aria-hidden="true">→</span></a><a class="welcome-text-link" href="#lessons">ดูทั้ง 4 ตอน <span aria-hidden="true">↓</span></a></div>
<p class="welcome-format">กราฟจากการคำนวณ · ห้องทดลองปรับค่า · Python Notebook</p>
</div>

<!-- author-profile -->

<div class="welcome-preparation">
<h3>ก่อนเริ่ม</h3>
<p>ควรคุ้นกับผลตอบแทน ค่าเฉลี่ย และส่วนเบี่ยงเบนมาตรฐาน ตัวอย่างและผล Backtest ในซีรีส์นี้ใช้ข้อมูลจำลองเพื่ออธิบายวิธีคำนวณ ผลที่ได้จึงไม่ได้แสดงว่ากลยุทธ์ทำกำไรในตลาดจริง</p>
<a class="welcome-text-link" href="glossary.html">เปิดอภิธานศัพท์ประกอบการอ่าน <span aria-hidden="true">→</span></a>
</div>

<h2 id="lessons">บทเรียน 4 ตอน</h2>

อ่านตามลำดับเพื่อเชื่อมความหมายของสถานะ Spread สัญญาณ และผลการทดสอบ แต่ละตอนมีสมมติฐานและแหล่งอ้างอิงกำกับ

<div class="welcome-lessons">
<article class="welcome-lesson">
<span class="welcome-lesson-number" aria-hidden="true">01</span>
<div><p class="welcome-lesson-label">เริ่มจากสองขาของพอร์ต</p>
<h3><a href="statistical-arbitrage.html">Statistical Arbitrage · Pairs Trading</a></h3>
<p>กำไรของ Long–Short, ฐานเงินทุน และความต่างของ Hedge ratio</p>
<p class="welcome-topics">Long–Short · Dollar neutral · Market beta</p>
<a class="welcome-text-link" href="statistical-arbitrage.html">อ่านตอนนี้ →</a></div>
</article>
<article class="welcome-lesson">
<span class="welcome-lesson-number" aria-hidden="true">02</span>
<div><p class="welcome-lesson-label">ตรวจความสัมพันธ์ของราคา</p>
<h3><a href="pairs-trading-cointegration.html">Pairs Trading 2 · Cointegration</a></h3>
<p>หักแนวโน้มร่วม สร้าง residual และอ่านผลทดสอบพร้อมข้อจำกัด</p>
<p class="welcome-topics">Stationarity · Engle–Granger · Half-life</p>
<a class="welcome-text-link" href="pairs-trading-cointegration.html">อ่านตอนนี้ →</a></div>
</article>
<article class="welcome-lesson">
<span class="welcome-lesson-number" aria-hidden="true">03</span>
<div><p class="welcome-lesson-label">ติดตามเงินตั้งแต่เปิดจนปิดสถานะ</p>
<h3><a href="pairs-trading-backtest.html">Pairs Trading 3 · Signals & Backtest</a></h3>
<p>สร้างคำสั่งจาก z-score แล้วนับกำไรขาดทุนหลังต้นทุนทั้งสองขา</p>
<p class="welcome-topics">Lagged execution · Trade blotter · Drawdown</p>
<a class="welcome-text-link" href="pairs-trading-backtest.html">อ่านตอนนี้ →</a></div>
</article>
<article class="welcome-lesson">
<span class="welcome-lesson-number" aria-hidden="true">04</span>
<div><p class="welcome-lesson-label">ตรวจโมเดลกับวิธีง่าย</p>
<h3><a href="pairs-trading-ml.html">Pairs Trading 4 · Clustering, PCA & Prediction</a></h3>
<p>คัดกลุ่มหุ้นและทำนาย residual ด้วยข้อมูล train, validation และ test</p>
<p class="welcome-topics">Clustering · PCA · Ridge · Python Notebook</p>
<a class="welcome-text-link" href="pairs-trading-ml.html">อ่านตอนนี้ →</a></div>
</article>
</div>


<div class="welcome-resources">
<h3>ทดลองต่อด้วย Python</h3>
<p>Notebook รวมทั้งสี่ตอน พร้อมโค้ดและผลที่คำนวณแล้ว ลองเปลี่ยนสมมติฐานทีละข้อแล้วเปรียบเทียบผลกับบทเรียน</p>
<div class="welcome-download"><a href="notebooks/pairs-trading.ipynb" download>ดาวน์โหลด Pairs Trading Notebook</a><a href="statistical-arbitrage.md" download>ดาวน์โหลด Markdown ตอนแรก</a></div>
</div>
