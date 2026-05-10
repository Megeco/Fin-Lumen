export function getNextWeekSignal({
  astro_window,
  pmp,
  pressure_score,
  momentum_state
}) {

  // Strong bullish continuation
  if (
    astro_window === "OPEN" &&
    pmp === "HIGH" &&
    pressure_score >= 7 &&
    momentum_state === "EARLY STRENGTH"
  ) {
    return "EXPANDING BULLISH";
  }

  // Bullish but not explosive
  if (
    astro_window === "OPEN" &&
    (pressure_score >= 5 || momentum_state === "MOMENTUM BUILDING")
  ) {
    return "BUILDING BULLISH";
  }

  // Weakening condition
  if (
    astro_window === "CLOSED" &&
    pressure_score <= 3
  ) {
    return "BUILDING BEARISH";
  }

  // Default neutral
  return "STABLE";
}
