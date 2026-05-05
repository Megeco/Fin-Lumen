import { db } from "../../lib/db";
import { computeScores } from "../../lib/scorer";
import { decisionEngine } from "../../lib/decision";

export default async function handler(req, res) {
  const { name } = JSON.parse(req.body);

  let stock = db.get(name);

  const scores = await computeScores(stock);
  const decision = decisionEngine(scores);

  db.update(name, { ...scores, ...decision });

  res.status(200).json({ success: true });
}