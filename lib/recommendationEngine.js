export function getRecommendation({
  cycle_2027,
  pressure_score,
  momentum_state,
  position_action,
  astro_window,
  pmp
}) {

  // =====================================
  // SUPER CYCLE LEADERS
  // =====================================

  if (cycle_2027 === "SUPER CYCLE LEADER") {

    if (
      momentum_state === "EARLY IGNITION" &&
      astro_window === "OPEN"
    ) {
      return "AGGRESSIVE ACCUMULATION";
    }

    if (
      momentum_state === "CONTROLLED EXPANSION"
    ) {
      return "CORE ACCUMULATION";
    }

    if (
      momentum_state === "EXHAUSTED"
    ) {
      return "SATELLITE TRIM";
    }

    return "CORE ACCUMULATION";
  }

  // =====================================
  // STRUCTURAL LEADERS
  // =====================================

  if (cycle_2027 === "STRUCTURAL LEADER") {

    if (
      momentum_state === "EARLY IGNITION"
    ) {
      return "STAGGERED ADD";
    }

    if (
      momentum_state === "CONTROLLED EXPANSION"
    ) {
      return "CORE HOLD";
    }

    return "CORE HOLD";
  }

  // =====================================
  // ROTATIONAL
  // =====================================

  if (cycle_2027 === "ROTATIONAL") {

    if (
      momentum_state === "EARLY IGNITION"
    ) {
      return "TACTICAL TRADE";
    }

    return "NEUTRAL";
  }

  // =====================================
  // DISTRIBUTE
  // =====================================

  if (cycle_2027 === "DISTRIBUTE") {
    return "DISTRIBUTE";
  }

  // =====================================
  // EXIT CYCLE
  // =====================================

  if (cycle_2027 === "EXIT CYCLE") {

    if (
      momentum_state === "EARLY IGNITION"
    ) {
      return "EXIT INTO STRENGTH";
    }

    return "AVOID";
  }

  // =====================================
  // DEFAULT
  // =====================================

  return "NEUTRAL";
}
