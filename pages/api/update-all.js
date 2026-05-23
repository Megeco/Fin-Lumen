import { createClient } from '@supabase/supabase-js';

import { runAstroEngine } from '../../lib/astroEngine';
import { runMacroEngine } from '../../lib/macroEngine';
import { getEarlySignal } from '../../lib/earlyWarning';
import { getNextWeekSignal } from '../../lib/nextWeekEngine';
import { runPressureEngine } from '../../lib/pressureEngine';
import { runMomentumEngine } from '../../lib/momentumEngine';
import { run2027CycleEngine } from '../../lib/cycle2027Engine';
import { getRecommendation } from '../../lib/recommendationEngine';
import { runAstroEventEngine } from '../../lib/astroEventEngine';

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
    // CURRENT TIMESTAMP
    // =========================================

    const currentTimestamp = new Date().toISOString();

    // =========================================
    // PROCESS STOCKS
    // =========================================

    for (const stock of stocks) {

      // =========================================
      // CORE ENGINES
      // =========================================

      const astro = runAstroEngine(stock);

      const macro = runMacroEngine(stock);

      const cycle2027 = run2027CycleEngine(stock.name);

      const astroEvent = runAstroEventEngine(stock.name);

      // =========================================
      // PRESSURE ENGINE
      // =========================================

      const pressure = runPressureEngine({
        astro_window: astro.astro_window,
        macro_score: macro.macro_score,
        cycle_2027: cycle2027.cycle_2027
      });

      // =========================================
      // MOMENTUM ENGINE
      // =========================================

      const momentum = runMomentumEngine({
        astro_window: astro.astro_window,
        cycle_2027: cycle2027.cycle_2027,
        pressure_score: pressure.pressure_score
      });

      // =========================================
      // EARLY WARNING ENGINE
      // =========================================

      const early = getEarlySignal({
        astro_window: astro.astro_window,
        pressure_score: pressure.pressure_score,
        momentum_state: momentum.momentum_state
      });

      // =========================================
      // NEXT WEEK ENGINE
      // =========================================

      const nextWeek = getNextWeekSignal({
        astro_window: astro.astro_window,
        pmp: astro.pmp,
        momentum_state: momentum.momentum_state
      });

      // =========================================
      // ACTION LOGIC
      // =========================================

      let finalAction = "HOLD";

      if (pressure.pressure_score <= 2) {
        finalAction = "ADD";
      }

      else if (pressure.pressure_score <= 5) {
        finalAction = "HOLD";
      }

      else if (pressure.pressure_score <= 7) {
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
      // DATABASE UPDATE
      // =========================================

      await supabase
        .from('stocks')
        .update({

          // =====================================
          // ASTRO
          // =====================================

          astro_window: astro.astro_window,
          pmp: astro.pmp,

          // =====================================
          // MACRO
          // =====================================

          week_bias: macro.week_bias,
          action_plan: macro.action_plan,

          // =====================================
          // SIGNALS
          // =====================================

          signal: macro.signal,

          early_signal: early,

          next_week_signal: nextWeek,

          // =====================================
          // POSITIONING
          // =====================================

          position_action: finalAction,
          position: positionMap[finalAction],

          // =====================================
          // PRESSURE
          // =====================================

          pressure: pressure.pressure_label,
          pressure_score: pressure.pressure_score,

          // =====================================
          // MOMENTUM
          // =====================================

          momentum: momentum.momentum_state,

          momentum_state: momentum.momentum_state,

          momentum_score: momentum.momentum_score,

          conviction: conviction,

          // =====================================
          // STRUCTURAL + TACTICAL
          // =====================================

          structural_status: cycle2027.cycle_2027,

          tactical_action: recommendation,

          recommendation: recommendation,

          cycle_2027: cycle2027.cycle_2027,

          // =====================================
          // ASTRO EVENT WARNING
          // =====================================

          event_phase: astroEvent.event_phase,

          event_warning: astroEvent.event_warning,

          days_to_event: astroEvent.days_to_event,

          volatility_risk: astroEvent.volatility_risk,

          // =====================================
          // SYSTEM UPDATE TIMESTAMP
          // =====================================

          updated_at: currentTimestamp

        })
        .eq('id', stock.id);

    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({
      success: true,
      updated: stocks.length,
      timestamp: currentTimestamp
    });

  }

  catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
