export function runMomentumEngine(stock) {

  // HIGH MOMENTUM
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

  // MID MOMENTUM
  if (
    stock.includes("KPIT") ||
    stock.includes("FORTIS") ||
    stock.includes("CGPOWER") ||
    stock.includes("TITAGARH")
  ) {
    return {
      momentum_state: "CONTROLLED EXPANSION",
      momentum_score: 6
    };
  }

  // LOW MOMENTUM
  return {
    momentum_state: "EXHAUSTED",
    momentum_score: 0
  };
}
