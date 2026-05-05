import { db } from "../../lib/db";

export default async function handler(req, res) {
  const data = await db.getAll();
  res.status(200).json(data);
}
