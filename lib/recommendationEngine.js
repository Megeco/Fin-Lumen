export function getRecommendation({
  structural,
  astroWindow,
  momentumState,
  pressure
}) {

  // ====================================
  // EXIT CYCLE ONLY
  // ====================================
  if (structural === "EXIT CYCLE") {
    return "AVOID";
  }

  // ====================================
  // SUPER CYCLE LEADERS
  // ====================================
  if (structural === "SUPER CYCLE LEADER") {

    if (astroWindow === "OPEN") {
      return "AGGRESSIVE ACCUMULATION";
    }

    if (momentumState === "EXHAUSTED") {
      return "HOLD CORE / NO FRESH ADD";
    }

    return "CORE ACCUMULATION";
  }

  // ====================================
  // STRUCTURAL LEADERS
  // ====================================
  if (structural === "STRUCTURAL LEADER") {

    if (astroWindow === "OPEN") {
      return "STAGGERED ADD";
    }

    return "CORE HOLD";
  }

  // ====================================
  // ROTATIONAL
  // ====================================
  if (structural === "ROTATIONAL") {
    return "TACTICAL ONLY";
  }

  return "NEUTRAL";
}
