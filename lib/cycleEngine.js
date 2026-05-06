export function runCycleEngine(stock) {

  // 🔮 Very simple placeholder logic (we'll upgrade later)

  const rand = Math.random();

  // Rare exit condition (~10%)
  if (rand < 0.1) {
    return {
      long_term: "EXIT",
      reason: "Cycle breakdown"
    };
  }

  return {
    long_term: "HOLD",
    reason: "Cycle intact"
  };
}
