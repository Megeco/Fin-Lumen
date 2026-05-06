import { createClient } from '@supabase/supabase-js';
import { runAstroEngine } from '../../lib/astroEngine';
import { runMacroEngine } from '../../lib/macroEngine';

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
    const { data: stocks, error } = await supabase
      .from('stocks')
      .select('*');

    if (error) {
      console.error("FETCH ERROR:", error);
      return res.status(500).json({ error });
    }

    // 🔮 GET MACRO FIRST (same for all stocks)
    const macro = runMacroEngine();

    for (let stock of stocks) {
      let result = runAstroEngine(stock.name);

      // ⚠️ MACRO OVERRIDE LOGIC

      if (macro.regime === "RISK OFF") {
        // kill aggression
        if (result.position_action === "ADD") {
          result.position_action = "HOLD";
          result.action_plan = "WAIT";
          result.signal = "HOLD";
        }
      }

      if (macro.regime === "NEUTRAL") {
        // reduce aggression slightly
        if (result.position_action === "ADD") {
          result.position_action = "HOLD";
          result.action_plan = "STAGGER";
          result.signal = "BUILD";
        }
      }

      const { error: updateError } = await supabase
        .from('stocks')
        .update({
          at: result.score,
          dz: result.score,

          week_bias: result.week_bias,
          action_plan: result.action_plan,
          position_action: result.position_action,
          positioning: positionMap[result.position_action] || "15–40%",

          astro_window: result.astro_window,
          pmp_forecast: result.pmp,
          signal: result.signal,

          // 🔥 STORE MACRO CONTEXT
          phase: macro.regime,

          updated_at: new Date()
        })
        .eq('name', stock.name);

      if (updateError) {
        console.error("UPDATE ERROR:", stock.name, updateError);
      }
    }

    return res.status(200).json({
      success: true,
      macro: macro
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
