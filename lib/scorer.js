import { computeAT } from "./astro";

export async function computeScores(stock) {
  // Placeholder — will connect API later
  const FS = 8;
  const CA = 7.5;
  const DZ = 5;

  const AT = await computeAT(stock.name);

  return { FS, CA, AT, DZ };
}