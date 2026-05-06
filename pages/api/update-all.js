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

export default async function handler(req, res) {
  // 1. Get existing stocks
  let { data: stocks } = await supabase.from('stocks').select('*');

  // 2. If empty → insert defaults
  if (!stocks || stocks.length === 0) {
    const insertData = DEFAULT_STOCKS.map(name => ({ name }));
    await supabase.from('stocks').insert(insertData);

    // Fetch again after insert
    const result = await supabase.from('stocks').select('*');
    stocks = result.data;
  }

  // 3. Update each stock with dummy values (for now)
  for (let stock of stocks) {
    await supabase
      .from('stocks')
      .update({
        fs: 7 + Math.random(),
        ca: 7 + Math.random(),
        at: 6 + Math.random(),
        phase: 'EXPANSION',
        action: 'STAGGER',
        positioning: '40–70%',
        signal: 'BUILD',
        updated_at: new Date()
      })
      .eq('name', stock.name);
  }

  res.status(200).json({ success: true });
}
