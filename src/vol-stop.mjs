import { normalGenerator } from './math.mjs';

export const VOL_STOP = Object.freeze({ seed: 20260922, count: 131, entry: 60, event: 80, exit: 100, equity: 10000, risk: 100, grossCap: 20000 });

// sigma[i] forecasts change i using information through i-1. The first 20
// changes initialize the zero-mean second moment; they are not forecasts.
export function ewmaForecast(levels, lambda = .94, warmup = 20) {
  if (!(lambda > 0 && lambda < 1) || !Number.isInteger(warmup) || warmup < 2 || levels.length < warmup + 2 || levels.some(x => !Number.isFinite(x))) throw new RangeError('Invalid EWMA inputs');
  const changes = levels.map((v, i) => i ? v - levels[i - 1] : 0);
  const sigma = levels.map(() => null), next = levels.map(() => null);
  let variance = changes.slice(1, warmup + 1).reduce((s, x) => s + x*x, 0) / warmup;
  next[warmup] = Math.sqrt(variance);
  for (let i = warmup + 1; i < levels.length; i++) {
    sigma[i] = Math.sqrt(variance);
    variance = lambda * variance + (1 - lambda) * changes[i]**2;
    next[i] = Math.sqrt(variance);
  }
  return { changes, sigma, next };
}

export function stopScenario({ scenario = 'gap', gap = 12, seed = VOL_STOP.seed } = {}) {
  if (!['gap','drift','volatile'].includes(scenario) || !Number.isFinite(gap) || gap < 0 || gap > 25 || !Number.isInteger(seed)) throw new RangeError('Invalid scenario');
  const random = normalGenerator(seed), s = [0];
  for (let i = 1; i < VOL_STOP.count; i++) {
    const noise = random();
    if (i <= VOL_STOP.entry) s.push(.85 * s[i-1] + .8 * noise);
    else if (i < VOL_STOP.event) s.push(s[VOL_STOP.entry] + .1 * Math.sin(i - VOL_STOP.entry));
    else if (scenario === 'gap') s.push(s[VOL_STOP.entry] - gap - .15*(i - VOL_STOP.event) + .1*Math.sin(i - VOL_STOP.entry));
    else if (scenario === 'drift') s.push(s[VOL_STOP.entry] - .5*(i - VOL_STOP.event + 1) + .1*Math.sin(i - VOL_STOP.entry));
    else s.push(s[VOL_STOP.entry] + .65*(s[i-1] - s[VOL_STOP.entry]) + 1.3*noise);
  }
  return s;
}

// A = 100+s, B = 100, h = 1. One preset long-spread trade, not an entry strategy.
// Quantity and distance decided at close 59; fill close 60; stops fill t+1.
export function runVolStop({ levels = stopScenario(), lambda = .94, k = 3, mode = 'frozen', feeBps = 5 } = {}) {
  if (levels.length !== VOL_STOP.count || levels.some(x => !Number.isFinite(x) || 100+x <= 0) || !(k > 0) || !Number.isFinite(k) || !['frozen','moving'].includes(mode) || !Number.isFinite(feeBps) || feeBps < 0) throw new RangeError('Invalid stop inputs');
  const f = ewmaForecast(levels, lambda), { entry, exit: scheduledExit, equity, risk, grossCap } = VOL_STOP;
  const distance = k * f.sigma[entry];
  if (!(distance > 1e-10)) throw new RangeError('Entry volatility must be positive');
  const quantity = Math.min(risk / distance, grossCap / (200 + levels[entry-1]));
  const cost = i => feeBps / 10000 * quantity * (200 + levels[i]);
  const entryFee = cost(entry); let cash = equity - quantity * levels[entry] - entryFee;
  let holding = true, pending = null, signal = null, exit = null, exitFee = 0, reason = null;
  const rows = [];
  for (let i = entry; i < levels.length; i++) {
    if (holding && (i === pending || i === scheduledExit)) {
      exitFee = cost(i); cash += quantity * levels[i] - exitFee; holding = false;
      exit = i; reason = pending === i ? 'stop' : 'time';
    }
    const limit = mode === 'frozen' ? distance : k * f.next[i];
    const adverse = levels[entry] - levels[i];
    if (holding && i > entry && pending === null && adverse >= limit) { signal = i; pending = i + 1; }
    rows.push({ day: i, spread: levels[i], sigmaBefore: f.sigma[i], sigmaAfter: f.next[i],
      adverse, limit, cash, quantityA: holding ? quantity : 0, quantityB: holding ? -quantity : 0,
      equity: cash + (holding ? quantity * levels[i] : 0), holding,
      signal: signal === i, fill: exit === i });
  }
  const pnl = cash - equity;
  return { mode, lambda, k, quantity, distance, plannedGrossLoss: quantity*distance,
    grossAtFill: quantity*(200 + levels[entry]), entryFee, exitFee, signal, exit, reason,
    grossPnl: quantity*(levels[exit] - levels[entry]), netPnl: pnl,
    budgetMultiple: Math.max(0, -pnl) / risk, rows, forecast: f };
}
