export function runMomentumEngine(stock) {

  // =========================================
  // EARLY IGNITION
  // =========================================

  if (
    stock.includes("MAZDOCK") ||
    stock.includes("LT") ||
    stock.includes("EPACK")
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
    stock.includes("CGPOWER") ||
    stock.includes("FORTIS") ||
    stock.includes("TITAGARH")
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
    stock.includes("KPIT") ||
    stock.includes("KAYNES") ||
    stock.includes("NEWGEN") ||
    stock.includes("BDL") ||
    stock.includes("SIEMENS") ||
    stock.includes("LUPIN") ||
    stock.includes("HBLENGINE") ||
    stock.includes("GRASIM")
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
