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

// 🔮 BASIC ASTRO TIMING (upgrade-ready)
function computeAstroWindow() {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday

  if (day === 1 || day === 2) {
    return { astro_window: "OPEN", astro_score: 7.5 };
  }
  if (day === 3) {
    return { astro_window: "NEUTRAL", astro_score: 5.5 };
  }
  return { astro_window: "CLOSED", astro_score: 4.0 };
}

// 📊 REAL PMP ENGINE (price compression detection)
async function computeRealPMP(symbol) {
  try {
    const res = await fetch(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?serietype=line&apikey=${process.env.FMP_API_KEY}`
    );

    const data = await res.json();
    const prices = data?.historical?.slice(0, 20);

    if (!prices || prices.length < 10) {
      return { pmp_forecast: "MEDIUM", pressure_score: 5 };
    }

    const closes = prices.map(p => p.close);

    const max = Math.max(...closes);
    const min = Math.min(...closes);
    const range = max - min;

    const recentCloses = closes.slice(0, 5);
    const recentRange =
      Math.max(...recentCloses) - Math.min(...recentCloses);

    let pmp_forecast = "MEDIUM";

    if (recentRange < range * 0.4) {
      pmp_forecast = "HIGH"; // compression → breakout likely
    } else if (recentRange > range * 0.8) {
      pmp_forecast = "LOW"; // already expanded
    }

    return {
      pmp_forecast,
      pressure_score: Number((10 * (1 - recentRange / range)).toFixed(2))
    };

  } catch (err) {
    console.error("PMP ERROR:", err);
    return { pmp_forecast: "MEDIUM", pressure_score: 5 };
  }
}

export default async function handler(req, res) {
  try {
    // 1. Fetch stocks
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

    // 3. Process each stock
    for (let stock of stocks) {

      const astro = computeAstroWindow();
      const pmp = await computeRealPMP(stock.name);

      let week_bias = "HOLD";
      let action_plan = "WAIT";

      // 🎯 CORE DECISION ENGINE
      if (astro.astro_window === "OPEN" && pmp.pmp_forecast === "HIGH") {
        week_bias = "ACCUMULATE";
        action_plan = "BUY EARLY";
      } else if (astro.astro_window === "OPEN") {
        week_bias = "BUILD";
        action_plan = "STAGGER";
      } else if (astro.astro_window === "NEUTRAL") {
        week_bias = "HOLD";
        action_plan = "WAIT";
      } else {
        week_bias = "AVOID";
        action_plan = "IGNORE";
      }

      await supabase
        .from('stocks')
        .update({
          fs: Number((7 + Math.random()).toFixed(2)),
          ca: Number((7 + Math.random()).toFixed(2)),
          at: Number((6 + Math.random()).toFixed(2)),
          dz: Number((5 + Math.random()).toFixed(2)),

          phase:
            astro.astro_window === "OPEN"
              ? "EXPANSION"
              : "CONSOLIDATION",

          action: action_plan,

          positioning:
            week_bias === "ACCUMULATE" ? "70–90%" :
            week_bias === "BUILD" ? "40–70%" :
            week_bias === "HOLD" ? "15–40%" :
            "0–10%",

          signal:
            week_bias === "ACCUMULATE" ? "BUY" :
            week_bias === "BUILD" ? "BUILD" :
            week_bias === "HOLD" ? "HOLD" :
            "AVOID",

          // ✅ REAL ENGINE OUTPUTS
          week_bias,
          action_plan,
          astro_window: astro.astro_window,
          pmp_forecast: pmp.pmp_forecast,

          updated_at: new Date()
        })
        .eq('name', stock.name);
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
}
