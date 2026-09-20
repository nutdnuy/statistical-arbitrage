"""Three original risk charts: unmodified ECB observations and labeled models.

Offline generator. Fetch the recorded ECB API URL separately to update raw data.
The source CSV is retained verbatim; calculations are marked as author-derived.
"""
import os, csv, json, hashlib, base64, subprocess
from pathlib import Path
from datetime import datetime, timezone
from html import escape
os.environ.setdefault('MPLCONFIGDIR','/tmp/quantcorner-pairs-matplotlib')
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from matplotlib import font_manager
import numpy as np
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'assets/images'; PREVIEW=Path('/tmp/quantcorner-vol-stop');PREVIEW.mkdir(exist_ok=True)
font=Path.home()/'Library/Fonts/Roboto-QuantBootCamp.ttf'
if font.exists():font_manager.fontManager.addfont(str(font))
plt.rcParams.update({'font.family':'Roboto' if font.exists() else 'DejaVu Sans','font.size':14,
 'axes.titlesize':16,'axes.labelsize':14,'xtick.labelsize':12,'ytick.labelsize':12,
 'axes.spines.top':False,'axes.spines.right':False,'svg.fonttype':'none','svg.hashsalt':'quantcorner-vol-stop'})
PURPLE,TEAL,GRAY,RED,GRID='#6200ee','#008577','#62626a','#b00020','#e5e5eb'
def layout(title, subtitle, rows=2):
 fig,ax=plt.subplots(rows,1,figsize=(11.2,8.8),squeeze=False)
 fig.subplots_adjust(left=.11,right=.965,top=.78,bottom=.20,hspace=.62)
 fig.text(.045,.95,title,fontsize=24,weight='bold',va='top')
 fig.text(.045,.885,subtitle,fontsize=14,color=GRAY,va='top')
 for a in ax[:,0]:a.grid(axis='y',color=GRID);a.set_axisbelow(True)
 return fig,ax[:,0]
def save(fig,name,desc,footer):
 fig.text(.045,.06,footer,fontsize=12,color=GRAY,linespacing=1.45)
 path=OUT/name;fig.savefig(path,metadata={'Date':None,'Creator':'QuantCorner | scripts/make_vol_stop_figures.py'})
 s=path.read_text();rules=[]
 for weight in [400,700]:
  b64=base64.b64encode((ROOT/f'assets/fonts/roboto-latin-{weight}-normal.woff2').read_bytes()).decode()
  rules.append(f"@font-face{{font-family:'Roboto';font-weight:{weight};src:url(data:font/woff2;base64,{b64}) format('woff2')}}")
 s=s.replace('<defs>','<defs><style>'+''.join(rules)+'</style>',1).replace('<svg ','<svg role="img" aria-labelledby="chart-title chart-description" ',1)
 at=s.index('>',s.index('<svg '))+1;s=s[:at]+f'<title id="chart-title">{escape(desc.split(". ")[0])}</title><desc id="chart-description">{escape(desc)}</desc>'+s[at:]
 path.write_text('\n'.join(x.rstrip() for x in s.splitlines())+'\n');fig.savefig(PREVIEW/name.replace('.svg','.png'),dpi=100);plt.close(fig)
raw=ROOT/'data/ecb-chf-eur-2014-2015.csv'
rows=list(csv.DictReader(raw.open(newline='')))
assert len(rows)==105 and all(r['KEY']=='EXR.D.CHF.EUR.SP00.A' and r['OBS_STATUS']=='A' for r in rows)
date_strings=[r['TIME_PERIOD'] for r in rows];assert date_strings==sorted(set(date_strings))
dates=[datetime.fromisoformat(d) for d in date_strings];values=np.array([float(r['OBS_VALUE']) for r in rows])
returns=np.r_[np.nan,values[1:]/values[:-1]-1]
sigma=np.full(len(rows),np.nan);after=sigma.copy();v=float(np.mean(returns[1:21]**2));after[20]=np.sqrt(v)
for i in range(21,len(rows)):
 sigma[i]=np.sqrt(v);v=.94*v+.06*returns[i]**2;after[i]=np.sqrt(v)
event=date_strings.index('2015-01-15');assert values[event-1]==1.201 and values[event]==1.028
summary={'source':'ECB statistics','series':'EXR.D.CHF.EUR.SP00.A','observations':len(rows),
 'first_date':date_strings[0],'last_date':date_strings[-1],'unit':'CHF per 1 EUR',
 'event':'2015-01-15','previous_value':float(values[event-1]),'event_value':float(values[event]),
 'event_simple_return':float(returns[event]),'lambda':.94,'warmup_returns':20,
 'warmup_first_return_date':date_strings[1],'warmup_last_return_date':date_strings[20],
 'pre_event_sigma':float(sigma[event]),'updated_next_sigma':float(after[event]),
 'standardized_event_move':float(returns[event]/sigma[event]),
 'raw_sha256':hashlib.sha256(raw.read_bytes()).hexdigest(),
 'api_url':'https://data-api.ecb.europa.eu/service/data/EXR/D.CHF.EUR.SP00.A?startPeriod=2014-10-01&endPeriod=2015-02-27&format=csvdata',
 'retrieved_on':'2026-09-20','missing_policy':'Use observed ECB dates only; no interpolation or weekend padding',
 'distinction':'Raw rates and metadata are unmodified. Returns and EWMA are author calculations, not ECB forecasts or executable prices.',
 'source_terms':'https://www.ecb.europa.eu/stats/ecb_statistics/governance_and_quality_framework/html/usage_policy.en.html'}
(ROOT/'data/pairs-fx-policy-risk.json').write_text(json.dumps(summary,indent=2)+'\n')
fig,ax=layout('A policy floor can disappear overnight','Observed EUR/CHF reference rates | SNB ends the minimum rate on 15 Jan 2015')
ax[0].plot(dates,values,color=PURPLE,lw=2)
ax[0].plot(dates[:event],np.full(event,1.20),color=GRAY,ls='--',label='Policy minimum before 15 Jan')
ax[0].scatter([dates[event-1],dates[event]],[values[event-1],values[event]],color=RED,zorder=5)
ax[0].annotate('14 Jan: 1.2010',xy=(dates[event-1],values[event-1]),xytext=(-125,15),textcoords='offset points',fontsize=13,bbox={'facecolor':'white','edgecolor':'none','pad':2})
ax[0].annotate('15 Jan: 1.0280',xy=(dates[event],values[event]),xytext=(20,-8),textcoords='offset points',fontsize=13,bbox={'facecolor':'white','edgecolor':'none','pad':2})
ax[0].set_ylabel('CHF per EUR');ax[0].set_ylim(.95,1.25);ax[0].legend(frameon=False,fontsize=11,loc='lower left')
ax[1].bar(dates,returns*100,width=1.5,color=TEAL)
ax[1].axhline(0,color=GRAY,lw=1);ax[1].set_ylabel('Reference-rate change (%)')
ax[1].annotate(f'{returns[event]*100:.2f}%',xy=(dates[event],returns[event]*100),xytext=(25,0),textcoords='offset points',color=RED,fontsize=16,weight='bold')
for a in ax:a.axvline(dates[event],color=RED,ls=':',lw=1.2);a.xaxis.set_major_locator(mdates.MonthLocator());a.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
save(fig,'pairs-fx-snb-policy.svg','EUR/CHF around the 15 January 2015 policy change. Observed ECB reference rate falls from 1.2010 on 14 January to 1.0280 on 15 January. Rate changes are author calculations; these are not intraday lows or executable trade prices.',
 'Source: ECB statistics, EXR.D.CHF.EUR.SP00.A | 105 observations | 1 Oct 2014 - 27 Feb 2015\nRate change = F(t) / F(t-1) - 1; gaps retain actual observation dates. Policy date: SNB press release.\nA minimum rate is not a fixed peg; this chart does not establish a cointegrated trading pair.')
fig,ax=layout('Volatility reacts after the policy shock','EWMA on simple reference-rate changes | lambda = 0.94 | zero-mean approximation')
ax[0].plot(dates,sigma*100,color=PURPLE,lw=2,label='Forecast for today, known yesterday')
ax[0].plot(dates,after*100,color=TEAL,ls='--',lw=1.7,label='Updated after today: forecast for next observation')
ax[0].set_yscale('log');ax[0].set_ylabel('One-step sigma (%) | log scale');ax[0].legend(frameon=False,fontsize=11,loc='upper left')
ax[1].bar(['Forecast before\n15 Jan','Absolute observed\n15 Jan change','Forecast after\n15 Jan'],[sigma[event]*100,abs(returns[event])*100,after[event]*100],color=[PURPLE,RED,TEAL],width=.55)
for j,val in enumerate([sigma[event]*100,abs(returns[event])*100,after[event]*100]):ax[1].text(j,val+.35,f'{val:.3f}%',ha='center',fontsize=15)
ax[1].set_ylim(0,18);ax[1].set_ylabel('One-step change scale (%)')
ax[0].axvline(dates[event],color=RED,ls=':');ax[0].xaxis.set_major_locator(mdates.MonthLocator());ax[0].xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
save(fig,'pairs-fx-ewma-shock.svg','Lagged EWMA versus the observed SNB-event move. The event shock is excluded from its own forecast; the updated sigma first applies to the next observation. The upper panel uses a logarithmic sigma axis. A standardized surprise is not a Normal-tail probability.',
 f'Source: ECB statistics; EWMA and returns calculated by QuantCorner | No annualization\nInitialize with mean squared first 20 returns ({date_strings[1]} - {date_strings[20]}); forecasts start next observation.\nA variance forecast does not predict policy announcements, intraday extremes or stop execution.')
subprocess.run(['node',str(ROOT/'scripts/export_vol_stop_demo.mjs')],check=True)
demo=json.loads((ROOT/'data/pairs-vol-stop-demo.json').read_text())['widening']
frozen,moving=demo['frozen'],demo['moving'];r=frozen['rows'];days=[x['day'] for x in r]
fig,ax=layout('Do not expand a loss budget after the shock','Synthetic long-spread trade | lambda = 0.80, k = 5 | signal at close t, fill at close t+1')
ax[0].plot(days,[x['adverse'] for x in r],color=PURPLE,label='Adverse move per unit if still held')
ax[0].plot(days,[x['limit'] for x in moving['rows']],color=TEAL,ls='--',label='Moving stop: k times updated sigma')
ax[0].axhline(frozen['distance'],color=GRAY,ls=':',label='Distance frozen before entry')
ax[0].set_ylabel('Adverse move / distance (USD)');ax[0].legend(frameon=False,fontsize=11,loc='lower left',bbox_to_anchor=(0,1.01))
for model,color,label in [(frozen,PURPLE,'Frozen'),(moving,TEAL,'Moving')]:
 ax[1].plot(days,[x['equity']-10000 for x in model['rows']],color=color,ls='-' if label=='Frozen' else '--',label=f'{label}: fill {model["exit"]}, net P&L {model["netPnl"]:.2f} USD')
 ax[1].scatter(model['exit'],model['netPnl'],color=color,zorder=5)
ax[1].axhline(-100,color=GRAY,ls=':',label='Planned gross loss budget: 100 USD')
ax[1].set_ylabel('Net P&L (USD)');ax[1].set_xlabel('Simulated day');ax[1].legend(frameon=False,fontsize=11,loc='upper right')
for a in ax:a.axvline(80,color=RED,ls=':');a.set_xlim(60,130)
save(fig,'pairs-vol-stop-widening.svg','Synthetic stop comparison with lambda 0.80 and k 5. Moving the stop after the gap expands the distance and delays the exit. Both fills can exceed the planned loss budget because execution occurs at the next close. This chosen mechanism example does not rank strategies statistically.',
 'Hypothetical scenario, seed 20260922 | Entry 60; policy-like gap 80; scheduled exit 100\nA=100+s, B=100, h=1; fixed quantities; 5 bps per leg per fill; excludes borrow, financing and extra slippage.\nThe interactive lab defaults to lambda 0.94, k=3; its results differ from this explicitly chosen illustration.')
print(json.dumps(summary,indent=2));print('Rendered 3 risk figures; exported reproducible simulation ledger.')
