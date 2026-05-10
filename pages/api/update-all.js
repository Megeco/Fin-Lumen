import { createClient } from '@supabase/supabase-js';
import { runAstroEngine } from '../../lib/astroEngine';
import { runMacroEngine } from '../../lib/macroEngine';
import { runCycleEngine } from '../../lib/cycleEngine';
import { getEarlySignal } from '../../lib/earlyWarning';
import { getForwardSignal } from '../../lib/forwardSignal'; // 🔥 NEW
import { getPressureScore } from '../../lib/pressureEngine';

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
    // 1. Fetch stocks
    const { data: stocks, error } = await supabase
      .from('stocks')
      .select('*');

    if (error) {
      console.error("FETCH ERROR:", error);
      return res.status(500).json({ error });
    }

    // 2. Get macro once
    const macro = runMacroEngine();

    // 3. Loop through each stock
    for (let stock of stocks) {

      // 🔮 Core engines
      const result = runAstroEngine(stock.name);
      const cycle = runCycleEngine(stock.name);

      let finalAction = result.position_action;

      // 🔁 Prevent churn (weekly EXIT → TRIM)
      if (finalAction === "EXIT") {
        finalAction = "TRIM";
      }

      // 🧠 Long-term override (true exit only)
      if (cycle.long_term === "EXIT") {
        finalAction = "EXIT";
      }

      // 🌍 Macro filter (soft control)
      if (macro.regime === "RISK OFF" && finalAction === "ADD") {
        finalAction = "HOLD";
      }

      if (macro.regime === "NEUTRAL" && finalAction === "ADD") {
        finalAction = "HOLD";
      }

      // ⚡ Early Warning
      const earlySignal = getEarlySignal({
        position_action: finalAction,
        astro_window: result.astro_window,
        pmp: result.pmp
      });

      // 🔮 Forward (Next Week) Signal
      const forwardSignal = getForwardSignal({
        position_action: finalAction,
        astro_window: result.astro_window,
        pmp: result.pmp
      });

          const pressure = getPressureScore({
  astro_window: result.astro_window,
  pmp: result.pmp,
  position_action: finalAction,
  next_week_signal: forwardSignal
});
      
      // 4. Update DB (USE ID — important fix)
      const { error: updateError } = await supabase
        .from('stocks')
        .update({
          week_bias: result.week_bias,
          action_plan: result.action_plan,

          position_action: finalAction,
          positioning: positionMap[finalAction] || "15–40%",

          astro_window: result.astro_window,
          pmp_forecast: result.pmp,
          signal: result.signal,

          // 🔥 Long-term conviction
          long_term: cycle.long_term,

          // ⚡ Early signal
          early_signal: earlySignal,

          // 🔮 Forward signal
          next_week_signal: forwardSignal,

          pressure_score: pressure.pressure_score,
conviction: pressure.conviction,
          
          // 🧭 Macro context
          phase:
            macro.regime === "RISK OFF" ? "DEFENSIVE" :
            macro.regime === "NEUTRAL" ? "CAUTIOUS" :
            "NORMAL",

          // ⏱ Clean timestamp
          updated_at: new Date().toISOString()
        })
        .eq('id', stock.id); // ✅ CRITICAL FIX

      if (updateError) {
        console.error("UPDATE ERROR:", stock.name, updateError);
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
