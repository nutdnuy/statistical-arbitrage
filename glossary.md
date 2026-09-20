---
title: อภิธานศัพท์
description: ศัพท์ Statistical Arbitrage และ Pairs Trading พร้อมความหมายภาษาไทยและลิงก์กลับไปอ่านตัวอย่าง
---

# อภิธานศัพท์

คำศัพท์ที่ใช้ในซีรีส์ **Statistical Arbitrage / Pairs Trading** แต่ละคำมีลิงก์ไปยังตัวอย่างในซีรีส์นี้ หรือบทพื้นฐานใน Quantitative Finance Notes

<div class="glossary-search" hidden>
<label for="glossary-query">ค้นหาคำศัพท์</label>
<input id="glossary-query" type="search" placeholder="เช่น Cointegration, Spread หรือ ขายชอร์ต" autocomplete="off" aria-describedby="glossary-status">
<p id="glossary-status" role="status" aria-live="polite"></p>
</div>

<section class="glossary-group" id="group-pairs-trading">

## Statistical Arbitrage และ Pairs Trading

<section class="glossary-term" id="pairs-trading">

### Pairs Trading — กลยุทธ์ซื้อขายสินทรัพย์เป็นคู่

การถือ Long และ Short โดยใช้ความสัมพันธ์ของสินทรัพย์สองตัวกำหนดขนาดและสัญญาณ ในซีรีส์นี้ศึกษาการกลับเข้าหาค่าเฉลี่ยของ spread ความสัมพันธ์อาจเปลี่ยนและพอร์ตยังขาดทุนได้ ต้องนับ P&L ทั้งสองขาพร้อมต้นทุน

[ดูตัวอย่าง Long–Short](statistical-arbitrage.html#two-legs)

</section>
<section class="glossary-term" id="cointegration">

### Cointegration — การร่วมกันหักล้างแนวโน้มสุ่ม

กรณีอนุกรม I(1) สองชุดมีผลรวมเชิงเส้นที่เป็น I(0) เช่น P_A − α − hP_B ค่า correlation สูงเพียงอย่างเดียวไม่รับประกันคุณสมบัตินี้ และ p-value ของการทดสอบไม่ใช่โอกาสที่ราคาจะกลับเข้าหากันในอนาคต

[ดูนิยามและตัวอย่างจำลอง](pairs-trading-cointegration.html#cointegration-definition)

</section>
<section class="glossary-term" id="pair-spread">

### Pair spread — ส่วนต่างตามนิยามของคู่

Residual ที่เหลือหลังหักความสัมพันธ์ เช่น s = P_A − α − hP_B สำหรับราคาในหน่วยดอลลาร์ต่อหุ้น h คือหุ้น B ต่อหุ้น A หนึ่งหุ้น ต้องแยกจาก bid–ask spread และระบุว่าคำนวณจากระดับราคาหรือ log price

[ดูสมการของ spread](pairs-trading-cointegration.html#cointegration-definition)

</section>
<section class="glossary-term" id="pair-z-score">

### Pair Z-score — ระยะของ Spread ในหน่วย SD

ค่า (spread − mean) / SD โดยต้องระบุช่วงข้อมูลที่ใช้ประมาณ mean และ SD ซีรีส์นี้ตรึงค่าจาก train การ standardize ไม่ได้รับประกันว่า spread เป็น Normal หรือมีความน่าจะเป็นนอก threshold เท่ากันทุกช่วง

[ดูการเปลี่ยน Z-score เป็นสัญญาณ](pairs-trading-backtest.html#z-score)

</section>
<section class="glossary-term" id="gross-notional">

### Gross notional — ผลรวมมูลค่าสถานะโดยไม่หักล้างเครื่องหมาย

มูลค่า Long บวกค่าสัมบูรณ์ของมูลค่า Short เช่น Long 10,000 และ Short 10,000 ดอลลาร์ มี gross 20,000 ดอลลาร์ แม้ net notional เป็นศูนย์ Gross ไม่จำเป็นต้องเท่ากับเงินทุนหรือหลักประกัน ต้องระบุฐานก่อนรายงานผลตอบแทน

[ดูฐานผลตอบแทนของพอร์ตสองขา](statistical-arbitrage.html#two-legs)

</section>
<section class="glossary-term" id="pair-drawdown">

### Drawdown — การลดลงจากจุดสูงสุดของมูลค่าบัญชี

สำหรับ equity ที่เป็นบวก คำนวณเป็น 1 − equity ปัจจุบัน / equity สูงสุดก่อนหน้ารวมวันปัจจุบัน Maximum drawdown คือค่ามากที่สุดในช่วงที่วัด เป็นสถิติของเส้นทางนั้น ไม่ทำ annualization และไม่ใช่ขาดทุนสูงสุดที่เป็นไปได้ในอนาคต

[ดูสมการและ Backtest หลังต้นทุน](pairs-trading-backtest.html#performance)

</section>
</section>

<section class="glossary-group" id="group-prerequisites">

## พื้นฐานที่ใช้ในซีรีส์

<section class="glossary-term" id="short-selling">

### Short selling — การขายชอร์ต

การยืมสินทรัพย์มาขายก่อน โดยมีภาระต้องซื้อกลับไปคืนภายหลัง เงินที่รับจากการขายวันนี้จึงไม่ใช่กำไรทั้งหมด ในพอร์ตตัวอย่าง การชอร์ตครึ่งหุ้นที่ราคา 100 รับเงิน 50 แต่ยังต้องนับภาระซื้อหุ้นคืนในวันพรุ่งนี้

[ดูในบทเรียน](https://nutdnuy.github.io/quantitative-finance-notes/random-assets.html#hedging)

</section>

<section class="glossary-term" id="stationarity">

### Stationarity — คุณสมบัติที่คงเดิมเมื่อเลื่อนเวลา

Weak stationarity กำหนดให้ mean คงที่ variance มีค่าจำกัดและคงที่ และ covariance ขึ้นกับระยะห่างเวลา ส่วน strict stationarity กำหนดให้ joint distribution ไม่เปลี่ยนเมื่อเลื่อนเวลาทุกตำแหน่งพร้อมกัน

[ดูสมการและตัวอย่าง](https://nutdnuy.github.io/quantitative-finance-notes/stochastic-processes.html#stationarity)

</section>

<section class="glossary-term" id="sharpe-ratio">

### Sharpe ratio — อัตราส่วนชาร์ป

ผลตอบแทนส่วนเกินคาดหมายเหนือสินทรัพย์ปลอดความเสี่ยง หารด้วยส่วนเบี่ยงเบนมาตรฐานของผลตอบแทนส่วนเกิน เมื่อคำนวณจากข้อมูลย้อนหลังให้ใช้ค่าเฉลี่ยและส่วนเบี่ยงเบนมาตรฐานจากช่วงเวลาเดียวกัน ตัวส่วนต้องมากกว่าศูนย์ และค่าที่คำนวณได้ยังมีความไม่แน่นอนจากการประมาณ

[ดูในบทเรียน](https://nutdnuy.github.io/quantitative-finance-notes/portfolio-theory.html#tangency)

</section>

</section>
