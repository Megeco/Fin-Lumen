import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const DEFAULT_STOCKS = [
  'KPIT.NS',
  'MAZDOCK.NS',
  'SUZLON.NS',
  'KAYNES.NS',
  'NEWGEN.NS',
  'DATAPATTNS.NS',
  'PCJEWELLER.NS'
];

// 🎯 CORE ENGINE — WEEKLY LOGIC
function computeAstroLayer() {
  const r = Math.random();

  let astro_window = "NEUTRAL";
  let pmp_forecast = "MEDIUM";
  let week_bias = "HOLD";
  let action_plan = "WAIT";

  // --- Astro Window ---
  if (r > 0.65) astro_window = "OPEN";
  else if (r < 0.35) astro_window = "CLOSED";

  // --- PMP Forecast ---
  const p = Math.random();
  if (p > 0.66) pmp_forecast = "HIGH";
  else if (p < 0.33) pmp_forecast = "LOW";

  // --- Decision Logic (YOUR EDGE) ---
  if (astro_window === "OPEN" && pmp_forecast === "HIGH") {
    week_bias = "ACCUMULATE";
    action_plan = "BUY EARLY";
  } else if (astro_window === "OPEN") {
    week_bias = "BUILD";
    action_plan = "STAGGER";
  } else if (astro_window === "NEUTRAL") {
    week_bias = "HOLD";
    action_plan = "WAIT";
  } else {
    week_bias = "AVOID";
    action_plan = "IGNORE";
  }

  return { astro_window, pmp_forecast, week_bias, action_plan };
}

export default async function handler(req, res) {
  try {
    // 1. Get stocks
    let { data: stocks, error } = await supabase
      .from('stocks')
      .select('*');

    if (error) throw error;

    // 2. Insert defaults if empty
    if (!stocks || stocks.length === 0) {
      await supabase.from('stocks').insert(
        DEFAULT_STOCKS.map(name => ({ name }))
      );

      const result = await supabase.from('stocks').select('*');
      stocks = result.data;
    }

    // 3. Update each stock
    for (let stock of stocks) {
      const astro = computeAstroLayer();

      await supabase
        .from('stocks')
        .update({
          fs: Number((7 + Math.random()).toFixed(2)),
          ca: Number((7 + Math.random()).toFixed(2)),
          at: Number((6 + Math.random()).toFixed(2)),
          dz: Number((5 + Math.random()).toFixed(2)),

          phase: astro.astro_window === "OPEN" ? "EXPANSION" : "CONSOLIDATION",

          action: astro.action_plan,
          positioning:
            astro.week_bias === "ACCUMULATE" ? "70–90%" :
            astro.week_bias === "BUILD" ? "40–70%" :
            astro.week_bias === "HOLD" ? "15–40%" :
            "0–10%",

          signal:
            astro.week_bias === "ACCUMULATE" ? "BUY" :
            astro.week_bias === "BUILD" ? "BUILD" :
            astro.week_bias === "HOLD" ? "HOLD" :
            "AVOID",

          // NEW FIELDS
          week_bias: astro.week_bias,
          astro_window: astro.astro_window,
          pmp_forecast: astro.pmp_forecast,
          action_plan: astro.action_plan,

          updated_at: new Date()
        })
        .eq('name', stock.name);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
