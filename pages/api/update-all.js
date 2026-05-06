import { createClient } from '@supabase/supabase-js';
import { runAstroEngine } from '../../lib/astroEngine';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

export default async function handler(req, res) {
  try {
    const { data: stocks, error } = await supabase
      .from('stocks')
      .select('*');

    if (error) {
      console.error("FETCH ERROR:", error);
      return res.status(500).json({ error });
    }

    for (let stock of stocks) {
      const result = runAstroEngine(stock.name);

      const { error: updateError } = await supabase
        .from('stocks')
        .update({
          at: result.score,
          dz: result.score,
          week_bias: result.week_bias,
          action_plan: result.action_plan,
          position_action: result.position_action,
          astro_window: result.astro_window,
          pmp_forecast: result.pmp, // ✅ FIXED HERE
          signal: result.signal,
          updated_at: new Date()
        })
        .eq('name', stock.name);

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
