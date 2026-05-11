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
      .select('*');

    if (error) {
      console.error("FETCH ERROR:", error);
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
      const momentum = runMomentumEngine(stock.name);
      const cycle2027 = run2027CycleEngine(stock.name);

      // =========================================
      // FINAL POSITION ACTION
      // =========================================

      let finalAction = result.position_action;

      // Weekly EXIT becomes TRIM
      if (finalAction === "EXIT") {
        finalAction = "TRIM";
      }

      // Long-term breakdown override
      if (cycle.long_term === "EXIT") {
        finalAction = "EXIT";
      }

      // Macro soft filter
      if (
        (macro.regime === "RISK OFF" ||
         macro.regime === "NEUTRAL")
        &&
        finalAction === "ADD"
      ) {
        finalAction = "HOLD";
      }

      // =========================================
      // CONVICTION ENGINE
      // =========================================

      let conviction = "BUILDING";

      if (momentum.momentum_state === "EARLY IGNITION") {
        conviction = "HIGH CONVICTION";
      }

      if (momentum.momentum_state === "CONTROLLED EXPANSION") {
        conviction = "STRONG";
      }

      if (momentum.momentum_state === "EXTENDED") {
        conviction = "CAUTION";
      }

      if (momentum.momentum_state === "EXHAUSTED") {
        conviction = "WEAK";
      }

      // =========================================
      // EARLY WARNING ENGINE
      // =========================================

      const earlySignal = getEarlySignal({
        position_action: finalAction,
        astro_window: result.astro_window,
        pmp: result.pmp
      });

      // =========================================
      // NEXT WEEK ENGINE
      // =========================================

      const nextWeekSignal = getNextWeekSignal({
        position_action: finalAction,
        astro_window: result.astro_window,
        pmp: result.pmp
      });

      // =========================================
      // PRESSURE ENGINE
      // =========================================

      const pressure = runPressureEngine({
        astro_window: result.astro_window,
        pmp: result.pmp,
        position_action: finalAction,
        next_week_signal: nextWeekSignal
      });

      // =========================================
      // RECOMMENDATION ENGINE
      // =========================================

      const recommendation = getRecommendation({
  cycle_2027: cycle2027.cycle_2027,
  pressure_score: pressure.pressure_score,
  momentum_state: momentum.momentum_state,
  position_action: finalAction,
  astro_window: result.astro_window,
  pmp: result.pmp
});

      // =========================================
      // DATABASE UPDATE
      // =========================================

      const { error: updateError } = await supabase
        .from('stocks')
        .update({

          // Astro layer
          week_bias: result.week_bias,
          action_plan: result.action_plan,

          // Positioning
          position_action: finalAction,
          positioning: positionMap[finalAction] || "15–40%",

          // Timing
          astro_window: result.astro_window,
          pmp_forecast: result.pmp,

          // Signal
          signal: result.signal,

          // Long-term thesis
          long_term: cycle.long_term,
          cycle_2027: cycle2027.cycle_2027,

          // Recommendation
          recommendation: recommendation,

          // Early warning
          early_signal: earlySignal,

          // Next week forecast
          next_week_signal: nextWeekSignal,

          // Pressure engine
          pressure_score: pressure.pressure_score,
          conviction: conviction,

          // Momentum engine
          momentum_state: momentum.momentum_state,
          momentum_score: momentum.momentum_score,

          // Macro phase
          phase:
            macro.regime === "RISK OFF"
              ? "DEFENSIVE"
              : macro.regime === "NEUTRAL"
              ? "CAUTIOUS"
              : "NORMAL",

          // Timestamp
          updated_at: new Date()

        })
        .eq('name', stock.name);

      if (updateError) {
        console.error("UPDATE ERROR:", stock.name, updateError);
      }
    }

    // =========================================
    // SUCCESS
    // =========================================

    return res.status(200).json({ success: true });

  } catch (err) {

    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      error: err.message
    });
  }
}
