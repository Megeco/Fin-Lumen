export function getMomentumState(stock) {
  const s = stock.toUpperCase();

  // =========================
  // EARLY IGNITION
  // =========================
  if (
    s.includes("MAZDOCK") ||
    s.includes("KAYNES") ||
    s.includes("LT") ||
    s.includes("RECLTD") ||
    s.includes("EPACK")
  ) {
    return {
      momentum_state: "EARLY IGNITION",
      momentum_score: 9
    };
  }

  // =========================
  // CONTROLLED EXPANSION
  // =========================
  if (
    s.includes("CGPOWER") ||
    s.includes("FORTIS") ||
    s.includes("TITAGARH")
  ) {
    return {
      momentum_state: "CONTROLLED EXPANSION",
      momentum_score: 6
    };
  }

  // =========================
  // BASE BUILDING
  // =========================
  if (
    s.includes("KPIT") ||
    s.includes("BDL") ||
    s.includes("SIEMENS") ||
    s.includes("NEWGEN")
  ) {
    return {
      momentum_state: "BASE BUILDING",
      momentum_score: 4
    };
  }

  // =========================
  // TRUE EXHAUSTION ONLY
  // =========================
  if (
    s.includes("TRENT") ||
    s.includes("PCJEWELLER") ||
    s.includes("BSE")
  ) {
    return {
      momentum_state: "EXHAUSTED",
      momentum_score: 1
    };
  }

  // =========================
  // DEFAULT = NEUTRAL
  // NEVER EXHAUSTED
  // =========================
  return {
    momentum_state: "NEUTRAL",
    momentum_score: 5
  };
}
