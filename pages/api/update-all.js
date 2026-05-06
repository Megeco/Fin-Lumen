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

    if (error) return res.status(500).json({ error });

    const macro = runMacroEngine();

    for (let stock of stocks) {
      let result = runAstroEngine(stock.name);

      let finalAction = result.position_action;

      // 🔥 REMOVE WEEKLY EXIT (convert to TRIM)
      if (finalAction === "EXIT") {
        finalAction = "TRIM";
      }

      // 🔥 LONG TERM OVERRIDE (ONLY TRUE EXIT CONDITION)
      if (stock.long_term === "EXIT") {
        finalAction = "EXIT";
      }

      // 🔥 MACRO SOFT FILTER
      if (macro.regime === "RISK OFF" && finalAction === "ADD") {
        finalAction = "HOLD";
      }

      if (macro.regime === "NEUTRAL" && finalAction === "ADD") {
        finalAction = "HOLD";
      }

      await supabase
        .from('stocks')
        .update({
          week_bias: result.week_bias,
          action_plan: result.action_plan,

          position_action: finalAction,
          positioning: positionMap[finalAction] || "15–40%",

          astro_window: result.astro_window,
          pmp_forecast: result.pmp,
          signal: result.signal,

          phase:
            macro.regime === "RISK OFF" ? "DEFENSIVE" :
            macro.regime === "NEUTRAL" ? "CAUTIOUS" :
            "NORMAL",

          updated_at: new Date()
        })
        .eq('name', stock.name);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
