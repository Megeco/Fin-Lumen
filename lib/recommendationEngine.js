export function getRecommendation({
  cycle_2027,
  astro_window,
  momentum_state
}) {

  // ====================================
  // DISTRIBUTE
  // ====================================

  if (cycle_2027 === "DISTRIBUTE") {
    return "DISTRIBUTE INTO STRENGTH";
  }

  // ====================================
  // EXIT CYCLE
  // ====================================

  if (cycle_2027 === "EXIT CYCLE") {
    return "AVOID";
  }

  // ====================================
  // SUPER CYCLE LEADERS
  // ====================================

  if (cycle_2027 === "SUPER CYCLE LEADER") {

    if (momentum_state === "EARLY IGNITION") {
      return "AGGRESSIVE ACCUMULATION";
    }

    if (momentum_state === "BASE BUILDING") {
      return "CORE ACCUMULATION";
    }

    if (momentum_state === "CONTROLLED EXPANSION") {
      return "STAGGERED ADD";
    }

    if (momentum_state === "EXTENDED") {
      return "HOLD CORE / NO FRESH ADD";
    }

    if (momentum_state === "EXHAUSTED") {
      return "TACTICAL PAUSE";
    }

    return "CORE HOLD";
  }

  // ====================================
  // STRUCTURAL LEADERS
  // ====================================

  if (cycle_2027 === "STRUCTURAL LEADER") {

    if (astro_window === "OPEN") {
      return "STAGGERED ADD";
    }

    if (momentum_state === "EXHAUSTED") {
      return "HOLD CORE";
    }

    return "CORE HOLD";
  }

  // ====================================
  // ROTATIONAL
  // ====================================

  if (cycle_2027 === "ROTATIONAL") {
    return "TACTICAL ONLY";
  }

  return "NEUTRAL";
}
