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
      console.error(error);
      return res.status(500).json({ error });
    }

    for (let stock of stocks) {
      const result = runAstroEngine(stock.name);

      await supabase
        .from('stocks')
        .update({
          at: result.score,
          dz: result.score,
          week_bias: result.week_bias,
          action_plan: result.action_plan,
          position_action: result.position_action,
          astro_window: result.astro_window,
          pmp: result.pmp,
          signal: result.signal,
          updated_at: new Date()
        })
        .eq('name', stock.name);
    }

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
