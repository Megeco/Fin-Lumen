// REAL ASTRO TIMING ENGINE (Phase 3B - deterministic cycles)

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 7));
}

// Fast cycle (Moon-like: 4-week rhythm)
function weeklyCycle(week, seed) {
  return Math.sin((week + seed) * (Math.PI / 2));
}

// Medium cycle (Mercury/Venus: ~12-week)
function mediumCycle(week, seed) {
  return Math.sin((week + seed) * (Math.PI / 6));
}

// Slow cycle (Jupiter/Saturn: ~52-week)
function slowCycle(week, seed) {
  return Math.sin((week + seed) * (Math.PI / 26));
}

// Convert cycles into score
function computeScore(name) {
  const week = getWeekNumber();

  let seed = 0;
  for (let i = 0; i < name.length; i++) {
    seed += name.charCodeAt(i);
  }

  const fast = weeklyCycle(week, seed % 4);
  const mid = mediumCycle(week, seed % 12);
  const slow = slowCycle(week, seed % 52);

  const score =
    (fast * 4 + mid * 3 + slow * 3 + 10) / 2; // normalize to ~0–10

  return score;
}

// CLASSIFICATION

function getAstroWindow(score) {
  if (score >= 7) return "OPEN";
  if (score >= 5) return "NEUTRAL";
  return "CLOSED";
}

function getPressure(score) {
  if (score >= 7) return "HIGH";
  if (score >= 5) return "MEDIUM";
  return "LOW";
}

function getBias(score) {
  if (score >= 7.5) return "ACCUMULATE";
  if (score >= 6.5) return "BUILD";
  if (score >= 5) return "HOLD";
  return "AVOID";
}

function getActions(bias, window, pressure) {
  let entry = "WAIT";
  let position = "HOLD";

  if (bias === "ACCUMULATE" && window === "OPEN") {
    entry = "BUY EARLY";
    position = "ADD";
  }

  else if (bias === "BUILD" && window === "OPEN") {
    entry = "STAGGER";
    position = "ADD";
  }

  else if (bias === "HOLD") {
    entry = "WAIT";
    position = "HOLD";
  }

  else if (bias === "AVOID" && window === "CLOSED") {
    entry = "IGNORE";

    if (pressure === "HIGH") {
      position = "TRIM";
    } else {
      position = "EXIT";
    }
  }

  return { entry, position };
}

// MAIN EXPORT

export function runAstroEngine(stockName) {
  const score = computeScore(stockName);

  const window = getAstroWindow(score);
  const pressure = getPressure(score);
  const bias = getBias(score);

  const { entry, position } = getActions(bias, window, pressure);

  return {
    score: Number(score.toFixed(2)),
    astro_window: window,
    pmp: pressure,
    week_bias: bias,
    action_plan: entry,
    position_action: position,
    signal:
      entry === "BUY EARLY" ? "BUY" :
      entry === "STAGGER" ? "BUILD" :
      entry === "IGNORE" ? "AVOID" :
      "HOLD"
  };
}
