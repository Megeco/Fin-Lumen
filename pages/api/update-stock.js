import { db } from "../../lib/db";
import { computeScores } from "../../lib/scorer";
import { decisionEngine } from "../../lib/decision";

export default async function handler(req, res) {
  const { name } = JSON.parse(req.body);

  const scores = await computeScores({ name });
  const decision = decisionEngine(scores);

  await db.upsert({
    name,
    ...scores,
    ...decision,
    updated_at: new Date()
  });

  res.status(200).json({ success: true });
}
