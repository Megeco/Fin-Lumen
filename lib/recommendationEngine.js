export function getRecommendation({
  structural,
  astroWindow,
  momentumState,
  conviction
}) {

  // ====================================
  // EXIT CYCLE
  // ====================================

  if (structural === "EXIT CYCLE") {

    // temporary tactical recovery
    if (
      astroWindow === "OPEN" &&
      conviction === "HIGH CONVICTION"
    ) {
      return "TACTICAL ACCUMULATION";
    }

    return "AVOID";
  }

  // ====================================
  // SUPER CYCLE LEADERS
  // ====================================

  if (structural === "SUPER CYCLE LEADER") {

    // strongest deployment zone
    if (
      astroWindow === "OPEN" &&
      (
        momentumState === "EARLY IGNITION" ||
        momentumState === "BASE BUILDING"
      )
    ) {
      return "AGGRESSIVE ACCUMULATION";
    }

    // late stage but still structural winner
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

    if (momentumState === "EXHAUSTED") {
      return "HOLD CORE";
    }

    return "CORE HOLD";
  }

  // ====================================
  // ROTATIONAL
  // ====================================

  if (structural === "ROTATIONAL") {

    if (astroWindow === "OPEN") {
      return "TACTICAL TRADE";
    }

    return "TACTICAL ONLY";
  }

  // ====================================
  // DEFAULT
  // ====================================

  return "NEUTRAL";
}
