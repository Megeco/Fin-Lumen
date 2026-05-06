// SIMPLE ASTRO ENGINE (Option A - deterministic, no API)

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

// deterministic pseudo-score based on stock name
function generateScore(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash += name.charCodeAt(i);
  }
  return (hash % 100) / 10; // 0–10 range
}

export function runAstroEngine(stockName) {
  const score = generateScore(stockName);

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
