export function getRecommendation({
  structural,
  astroWindow,
  momentumState,
  pressure
}) {

  // ====================================
  // EXIT CYCLE
  // ====================================
  if (structural === "EXIT CYCLE") {

    if (astroWindow === "OPEN") {
      return "SPECULATIVE ONLY";
    }

    return "AVOID";
  }

  // ====================================
  // SUPER CYCLE LEADERS
  // ====================================
  if (structural === "SUPER CYCLE LEADER") {

    // EARLY / OPEN WINDOW
    if (astroWindow === "OPEN") {

      if (
        momentumState === "EARLY IGNITION" ||
        momentumState === "BASE BUILDING"
      ) {
        return "AGGRESSIVE ACCUMULATION";
      }

      if (momentumState === "CONTROLLED EXPANSION") {
        return "CORE ACCUMULATION";
      }

      if (momentumState === "EXHAUSTED") {
        return "HOLD CORE / ADD ONLY ON DEEP DIPS";
      }
    }

    // NEUTRAL WINDOW
    if (astroWindow === "NEUTRAL") {

      if (
        momentumState === "EARLY IGNITION" ||
        momentumState === "BASE BUILDING"
      ) {
        return "STAGGERED ADD";
      }

      if (momentumState === "CONTROLLED EXPANSION") {
        return "CORE HOLD";
      }

      if (momentumState === "EXHAUSTED") {
        return "HOLD CORE / WAIT";
      }
    }

    // CLOSED WINDOW
    if (astroWindow === "CLOSED") {

      if (momentumState === "EXHAUSTED") {
        return "HOLD CORE / NO FRESH ADD";
      }

      return "CORE HOLD";
    }

    return "CORE ACCUMULATION";
  }

  // ====================================
  // STRUCTURAL LEADERS
  // ====================================
  if (structural === "STRUCTURAL LEADER") {

    if (astroWindow === "OPEN") {

      if (
        momentumState === "EARLY IGNITION" ||
        momentumState === "BASE BUILDING"
      ) {
        return "STAGGERED ADD";
      }

      return "CORE HOLD";
    }

    if (astroWindow === "CLOSED") {

      if (momentumState === "EXHAUSTED") {
        return "HOLD / WAIT FOR RESET";
      }
    }

    return "CORE HOLD";
  }

  // ====================================
  // ROTATIONAL
  // ====================================
  if (structural === "ROTATIONAL") {

    if (astroWindow === "OPEN") {
      return "TACTICAL BUY";
    }

    return "TACTICAL ONLY";
  }

  return "NEUTRAL";
}
