import React from 'react';
import {VolStopLab} from './vol-stop.jsx';
import {createRoot} from 'react-dom/client';
import {PairHedgeLab, CointegrationLab, PairBacktestLab} from './pairs-trading.jsx';
for (const [id, Component] of [['pair-hedge-lab',PairHedgeLab],['pair-cointegration-lab',CointegrationLab],['pair-backtest-lab',PairBacktestLab],['pair-vol-stop-lab',VolStopLab]]) {
  const target=document.getElementById(id);
  if(target) createRoot(target).render(<Component />);
}
