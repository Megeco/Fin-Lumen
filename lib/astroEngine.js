// Fin-Lumen Astro Engine (Lightweight Deterministic Version)

// --- STOCK NATAL MAP (Simplified placeholders)
// We will refine these later with exact incorporation charts
const NATAL_MAP = {
  "KPIT.NS": { sun: 210, moon: 120 },
  "MAZDOCK.NS": { sun: 180, moon: 60 },
  "KAYNES.NS": { sun: 240, moon: 90 },
  "SUZLON.NS": { sun: 300, moon: 150 },
  "NEWGEN.NS": { sun: 270, moon: 30 },
  "DATAPATTNS.NS": { sun: 150, moon: 210 },
  "PCJEWELLER.NS": { sun: 330, moon: 180 }
};

// --- SIMULATED TRANSIT ENGINE (time-based cycles)
function getTransitPositions(date) {
  const t = date.getTime() / (1000 * 60 * 60 * 24);

  return {
    jupiter: (t * 0.08) % 360,
    saturn: (t * 0.03) % 360,
    rahu: (t * -0.05) % 360,
    mars: (t * 0.2) % 360,
    venus: (t * 0.15) % 360
  };
}

// --- ANGLE DIFFERENCE
function angleDiff(a, b) {
  let diff = Math.abs(a - b);
  return diff > 180 ? 360 - diff : diff;
}

// --- ASPECT SCORING
function getAspectScore(diff) {
  if (diff < 8) return 3;        // conjunction
  if (Math.abs(diff - 120) < 8) return 2; // trine
  if (Math.abs(diff - 60) < 6) return 1;  // sextile
  if (Math.abs(diff - 90) < 6) return -2; // square
  if (Math.abs(diff - 180) < 8) return -3; // opposition
  return 0;
}

// --- CORE AT CALCULATION
export function computeAT(stockName) {
  const natal = NATAL_MAP[stockName];
  if (!natal) return 5.5; // fallback neutral

  const now = new Date();
  const transits = getTransitPositions(now);

  let score = 0;

  // Jupiter (positive growth)
  score += getAspectScore(angleDiff(transits.jupiter, natal.sun)) * 1.4;

  // Saturn (stress / structure)
  score += getAspectScore(angleDiff(transits.saturn, natal.sun)) * 1.2;

  // Rahu (momentum / chaos)
  score += getAspectScore(angleDiff(transits.rahu, natal.moon)) * 1.1;

  // Mars (volatility)
  score += getAspectScore(angleDiff(transits.mars, natal.sun)) * 0.8;

  // Venus (support)
  score += getAspectScore(angleDiff(transits.venus, natal.moon)) * 0.8;

  // Normalize to 0–10
  let normalized = 5 + score;

  if (normalized > 10) normalized = 10;
  if (normalized < 0) normalized = 0;

  return Number(normalized.toFixed(2));
}

// --- FORWARD PROJECTION
export function computeForwardAT(stockName) {
  const base = computeAT(stockName);

  // simulate trajectory
  const step1 = base + (Math.random() - 0.5) * 0.8;
  const step2 = step1 + (Math.random() - 0.5) * 0.8;
  const step3 = step2 + (Math.random() - 0.5) * 0.8;

  return [
    base,
    Number(step1.toFixed(2)),
    Number(step2.toFixed(2)),
    Number(step3.toFixed(2))
  ];
}

// --- DZ CALCULATION
export function computeDZ(at) {
  // inverse of AT + volatility buffer
  let dz = 10 - at + (Math.random() * 1.5);

  if (dz > 10) dz = 10;
  if (dz < 0) dz = 0;

  return Number(dz.toFixed(2));
}

// --- SIGNAL ENGINE
export function getSignal(at) {
  if (at >= 8) return "BUY";
  if (at >= 6.5) return "BUILD";
  if (at >= 5) return "HOLD";
  return "AVOID";
}

// --- PHASE ENGINE
export function getPhase(at) {
  if (at >= 7.5) return "EXPANSION";
  if (at >= 6) return "ACCUMULATION";
  if (at >= 5) return "CONSOLIDATION";
  return "DOWNTREND";
}