import { createClient } from '@supabase/supabase-js';

import { runAstroEngine } from '../../lib/astroEngine';
import { runMacroEngine } from '../../lib/macroEngine';
import { runCycleEngine } from '../../lib/cycleEngine';
import { getEarlySignal } from '../../lib/earlyWarning';
import { getNextWeekSignal } from '../../lib/nextWeekEngine';
import { runPressureEngine } from '../../lib/pressureEngine';
import { runMomentumEngine } from '../../lib/momentumEngine';
import { run2027CycleEngine } from '../../lib/cycle2027Engine';
import { getRecommendation } from '../../lib/recommendationEngine';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const positionMap = {
  ADD: "70–90%",
  HOLD: "15–40%",
  TRIM: "10–30%",
  EXIT: "0–10%"
};

export default async function handler(req, res) {

  try {

    // =========================================
    // FETCH STOCKS
    // =========================================

    const { data: stocks, error } = await supabase
      .from('stocks')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('FETCH ERROR:', error);
      return res.status(500).json({ error });
    }

    // =========================================
    // GLOBAL MACRO
    // =========================================

    const macro = runMacroEngine();

    // =========================================
    // PROCESS STOCKS
    // =========================================

    for (let stock of stocks) {

      // =========================================
      // CORE ENGINES
      // =========================================

      const result = runAstroEngine(stock.name);
      const cycle = runCycleEngine(stock.name);
      const cycle2027 = run2027CycleEngine(stock.name);

      // =========================================
      // FINAL POSITION ACTION
      // =========================================

      let finalAction = result.position_action;

      if (finalAction === 'EXIT') {
        finalAction = 'TRIM';
      }

      if (cycle.long_term === 'EXIT') {
          momentum_state: momentum.momentum_stat
