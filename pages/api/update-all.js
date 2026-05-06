import { createClient } from '@supabase/supabase-js';

import {
  computeAT,
  computeDZ,
  getSignal,
  getPhase
} from '../../lib/astroEngine';

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

export default async function handler(req, res) {
  try {
    // 1. Fetch existing stocks
    let { data: stocks, error: fetchError } = await supabase
      .from('stocks')
      .select('*');

    if (fetchError) {
      console.error('FETCH ERROR:', fetchError);
      return res.status(500).json({ error: fetchError });
    }

    // 2. If table empty → insert defaults
    if (!stocks || stocks.length === 0) {
      const insertData = DEFAULT_STOCKS.map(name => ({ name }));

      const { error: insertError } = await supabase
        .from('stocks')
        .insert(insertData);

      if (insertError) {
        console.error('INSERT ERROR:', insertError);
        return res.status(500).json({ error: insertError });
      }

      // Fetch again after insert
      const result = await supabase.from('stocks').select('*');
      stocks = result.data;
    }

    // 3. Update each stock using ASTRO ENGINE
    for (let stock of stocks) {
      const at = computeAT(stock.name);
      const dz = computeDZ(at);
      const signal = getSignal(at);
      const phase = getPhase(at);

      const action =
        signal === 'BUY'
          ? 'BUY NOW'
          : signal === 'BUILD'
          ? 'STAGGER'
          : signal === 'HOLD'
          ? 'HOLD'
          : 'AVOID';

      const positioning =
        signal === 'BUY'
          ? '70–90%'
          : signal === 'BUILD'
          ? '40–70%'
          : signal === 'HOLD'
          ? '15–40%'
          : '0%';

      const { error: updateError } = await supabase
        .from('stocks')
        .update({
          at,
          dz,
          phase,
          action,
          positioning,
          signal,
          updated_at: new Date()
        })
        .eq('name', stock.name);

      if (updateError) {
        console.error('UPDATE ERROR for', stock.name, updateError);
      }
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('SERVER ERROR:', err);
    return res.status(500).json({ error: err.message });
  }
}
