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
    // PROCESS STOCKS
    // =========================================

    for (const stock of stocks) {

      // =========================================
      // CORE ENGINES
      // =========================================

      // FIX 1: pass stock.name (string), not the full stock object
      const astro = runAstroEngine(stock.name);

      // FIX 2: runMacroEngine takes no arguments
      const macro = runMacroEngine();

      const cycle2027 = run2027CycleEngine(stock.name);

      const astroEvent = runAstroEventEngine(stock.name);

      // =========================================
      // ACTION LOGIC (needed before pressure/momentum)
      // =========================================

      // FIX 6: compute a preliminary action from astro so pressure engine
      // receives position_action (it needs it before finalAction is set)
      let preliminaryAction = astro.position_action;

      // =========================================
      // PRESSURE ENGINE
      // =========================================

      // FIX 3: pass the fields pressureEngine actually expects
      const pressure = runPressureEngine({
        astro_window: astro.astro_window,
        pmp: astro.pmp,
        position_action: preliminaryAction,
        next_week_signal: null   // not yet computed; engine handles null gracefully
      });

      // =========================================
      // MOMENTUM ENGINE
      // =========================================

      // FIX 4: pass the fields momentumEngine actually expects
      const momentum = runMomentumEngine({
        astro_window: astro.astro_window,
        pressure_score: pressure.pressure_score,
        conviction: null,  // not yet available; engine defaults to EXHAUSTED
        m_score: macro.macro_score
      });

      // =========================================
      // NEXT WEEK ENGINE
      // =========================================

      // nextWeekEngine is now called after momentum so momentum_state is available
      const nextWeek = getNextWeekSignal({
        astro_window: astro.astro_window,
        pmp: astro.pmp,
        momentum_state: momentum.momentum_state
      });

      // =========================================
      // EARLY WARNING ENGINE
      // =========================================

      // FIX 5: pass the fields earlyWarning actually expects
      const early = getEarlySignal({
        position_action: preliminaryAction,
        astro_window: astro.astro_window,
        pmp: astro.pmp
      });

      // =========================================
      // FINAL ACTION LOGIC
      // =========================================

      // FIX 9: pressure_score is now a number (see pressureEngine fix),
      // so numeric comparisons work correctly
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
          // FIX 8: use fields that macroEngine actually returns
          // =====================================

          week_bias: macro.regime,
          action_plan: macro.regime,
          signal: macro.regime,

          // =====================================
          // SIGNALS
          // =====================================

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

          volatility_risk: astroEvent.volatility_risk

        })
        .eq('id', stock.id);

    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({
      success: true,
      updated: stocks.length
    });

  }

  catch (err) {

    return res.status(500).json({
      error: err.message
    });

  }

}
