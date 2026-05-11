export function runMomentumEngine(stock) {

  const s = stock.toUpperCase();

  // =========================================
  // EARLY IGNITION
  // =========================================

  if (
    s.includes("MAZDOCK") ||
    s.includes("LT") ||
    s.includes("EPACK")
  ) {
    return {
      momentum_state: "EARLY IGNITION",
      momentum_score: 9
    };
  }

  // =========================================
  // CONTROLLED EXPANSION
  // =========================================

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

  // =========================================
  // BASE BUILDING
  // =========================================

  if (
    s.includes("KPIT") ||
    s.includes("KAYNES") ||
    s.includes("NEWGEN") ||
    s.includes("BDL") ||
    s.includes("SIEMENS") ||
    s.includes("LUPIN") ||
    s.includes("HBLENGINE") ||
    s.includes("GRASIM")
  ) {
    return {
      momentum_state: "BASE BUILDING",
      momentum_score: 4
    };
  }

  // =========================================
  // EXHAUSTED
  // =========================================

  return {
    momentum_state: "EXHAUSTED",
    momentum_score: 0
  };
}
