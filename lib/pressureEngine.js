export function getPressureScore(data) {

  let score = 5;

  // 🌌 Astro window
  if (data.astro_window === "OPEN") score += 2;
  if (data.astro_window === "CLOSED") score -= 2;

  // 📈 PMP
  if (data.pmp === "HIGH") score += 2;
  if (data.pmp === "LOW") score -= 2;

  // ⚡ Action
  if (data.position_action === "ADD") score += 1.5;
  if (data.position_action === "TRIM") score -= 1.5;

  // 🔮 Forward pressure
  if (data.next_week_signal === "BUILDING BULLISH") score += 1;
  if (data.next_week_signal === "BUILDING BEARISH") score -= 1;

  // Clamp
  if (score > 10) score = 10;
  if (score < 0) score = 0;

  // 🧠 Conviction Labels
  let conviction = "NEUTRAL";

  if (score >= 8) {
    conviction = "HIGH CONVICTION";
  } else if (score >= 6) {
    conviction = "BUILDING";
  } else if (score < 4) {
    conviction = "WEAK";
  }

  return {
    pressure_score: Number(score.toFixed(1)),
    conviction
  };
}
