export function runMomentumEngine(stock) {

  const hash =
    stock.split("").reduce((a, c) => a + c.charCodeAt(0), 0);

  const score = hash % 10;

  let momentum_state = "BASE";

  if (score >= 8) {
    momentum_state = "EARLY IGNITION";
  }
  else if (score >= 6) {
    momentum_state = "CONTROLLED EXPANSION";
  }
  else if (score >= 4) {
    momentum_state = "STABLE";
  }
  else if (score >= 2) {
    momentum_state = "EXTENDED";
  }
  else {
    momentum_state = "EXHAUSTED";
  }

  return {
    momentum_state,
    momentum_score: score
  };
}
