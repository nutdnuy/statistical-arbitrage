import fs from 'node:fs';
import {VOL_STOP,stopScenario,runVolStop} from '../src/vol-stop.mjs';
const scenarios=Object.fromEntries(['gap','drift','volatile'].map(s=>{const levels=stopScenario({scenario:s});return[s,{levels,frozen:runVolStop({levels}),moving:runVolStop({levels,mode:'moving'})}]}));
const widening={levels:stopScenario(),frozen:runVolStop({lambda:.8,k:5}),moving:runVolStop({lambda:.8,k:5,mode:'moving'})};
fs.writeFileSync(new URL('../data/pairs-vol-stop-demo.json',import.meta.url),JSON.stringify({parameters:VOL_STOP,scenarios,widening},null,2)+'\n');
