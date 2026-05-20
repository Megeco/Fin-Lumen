import { createClient } from '@supabase/supabase-js';

import { runAstroEngine } from '../../lib/astroEngine';
import { runMacroEngine } from '../../lib/macroEngine';
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
  ADD: "70-90%",
  HOLD: "15-40%",
  TRIM: "10-30%",
  EXIT: "0-10%"
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
      return res.status(500).json({
        error: error.message
      });
    }

    // =========================================
    // PROCESS STOCKS
    // =========================================

    for (const stock of stocks) {

      const astro = runAstroEngine(stock);
      const macro = runMacroEngine(stock);
      const cycle = run2027CycleEngine(stock.name);
      const early = getEarlySignal(stock);
      const nextWeek = getNextWeekSignal(stock);

      const pressure = runPressureEngine({
        astro_window: astro.astro_window,
        macro_score: macro.macro_score,
        cycle_alignment: cycle.cycle_alignment
      });

      const momentum = runMomentumEngine({
        astro_window: astro.astro_window,
        cycle_alignment: cycle.cycle_alignment,
        pressure_score: pressure.pressure_score
      });

      const cycle2027 = run2027CycleEngine(stock.name);

      // =========================================
      // ACTION LOGIC
      // =========================================

      let finalAction = "HOLD";

      if (pressure.pressure_score >= 8) {
        finalAction = "ADD";
      }

      else if (pressure.pressure_score >= 5) {
        finalAction = "HOLD";
      }

      else if (pressure.pressure_score >= 3) {
        finalAction = "TRIM";
      }

      else {
        finalAction = "EXIT";
      }

      // =========================================
      // RECOMMENDATION ENGINE
      // =========================================

      const recommendation = getRecommendation({
        cycle_2027: cycle2027.cycle_2027,
        pressure_score: pressure.pressure_score,
        momentum_state: momentum.momentum_state,
        position_action: finalAction,
        astro_window: astro.astro_window,
        pmp: astro.pmp
      });

      // =========================================
      // CONVICTION ENGINE
      // =========================================

      let conviction = "WEAK";

      if (momentum.momentum_state === 'EARLY IGNITION') {
        conviction = 'HIGH CONVICTION';
      }

      else if (momentum.momentum_state === 'BASE BUILDING') {
        conviction = 'BUILDING';
      }

      else if (momentum.momentum_state === 'CONTROLLED EXPANSION') {
        conviction = 'STRONG';
      }

      else if (momentum.momentum_state === 'EXTENDED') {
        conviction = 'CAUTION';
      }

      else if (momentum.momentum_state === 'EXHAUSTED') {
        conviction = 'WEAK';
      }

      // =========================================
      // UPDATE DATABASE
      // =========================================

      await supabase
        .from('stocks')
        .update({

          astro_window: astro.astro_window,
          pmp: astro.pmp,

          week_bias: macro.week_bias,
          action_plan: macro.action_plan,

          signal: cycle.signal,
          position_action: finalAction,
          position: positionMap[finalAction],

          early_signal: early,
          next_week: nextWeek,

          pressure: pressure.pressure_label,
          pressure_score: pressure.pressure_score,

          momentum: momentum.momentum_state,
          conviction: conviction,

          recommendation: recommendation,

          cycle_2027: cycle2027.cycle_2027

        })
        .eq('id', stock.id);

    }

    return res.status(200).json({
      success: true,
      updated: stocks.length
    });

  } catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
