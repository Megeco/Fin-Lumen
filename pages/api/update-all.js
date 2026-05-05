import { db } from "../../lib/db";
import { computeScores } from "../../lib/scorer";
import { decisionEngine } from "../../lib/decision";

export default async function handler(req, res) {
  const stocks = db.getAll();

  for (let s of stocks) {
    const scores = await computeScores(s);
    const decision = decisionEngine(scores);
    db.update(s.name, { ...scores, ...decision });
  }

  res.status(200).json({ success: true });
}