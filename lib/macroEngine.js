// SIMPLE MACRO ASTRO ENGINE (Phase 4A)

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

// simulate macro cycles
function macroCycle(week) {
  const fast = Math.sin(week * (Math.PI / 2));   // short cycle
  const mid = Math.sin(week * (Math.PI / 6));    // medium
  const slow = Math.sin(week * (Math.PI / 26));  // long

  return (fast * 3 + mid * 3 + slow * 4 + 10) / 2;
}

export function runMacroEngine() {
  const week = getWeekNumber();
  const score = macroCycle(week);

  let regime = "NEUTRAL";

  if (score >= 7) regime = "RISK ON";
  else if (score <= 4.5) regime = "RISK OFF";

  return {
    macro_score: Number(score.toFixed(2)),
    regime
  };
}
