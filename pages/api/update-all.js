import { db } from "../../lib/db";
import { computeScores } from "../../lib/scorer";
import { decisionEngine } from "../../lib/decision";

export default async function handler(req, res) {
  const stocks = await db.getAll();

  for (let s of stocks) {
    const scores = await computeScores(s);
    const decision = decisionEngine(scores);

    await db.upsert({
      name: s.name,
      ...scores,
      ...decision,
      updated_at: new Date()
    });
  }

  res.status(200).json({ success: true });
}
