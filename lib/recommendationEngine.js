export function getRecommendation(data) {

  const cycle = data.cycle_2027;
  const pressure = data.pressure_score;
  const momentum = data.momentum_state;
  const action = data.position_action;

  // =====================================
  // SUPER CYCLE LEADERS
  // =====================================

  if (
    cycle === "SUPER CYCLE LEADER" &&
    pressure >= 8 &&
    (
      momentum === "EARLY IGNITION" ||
      momentum === "CONTROLLED EXPANSION"
    )
  ) {
    return "FULL ATTACK";
  }

  if (
    cycle === "SUPER CYCLE LEADER" &&
    (
      pressure >= 5 ||
      action === "HOLD"
    )
  ) {
    return "CORE ACCUMULATION";
  }

  // =====================================
  // STRUCTURAL LEADERS
  // =====================================

  if (
    cycle === "STRUCTURAL LEADER" &&
    pressure >= 5
  ) {
    return "CORE HOLD";
  }

  // =====================================
  // TEMPORARY WEAKNESS
  // =====================================

  if (
    (
      cycle === "SUPER CYCLE LEADER" ||
      cycle === "STRUCTURAL LEADER"
    ) &&
    pressure <= 2
  ) {
    return "SATELLITE TRIM";
  }

  // =====================================
  // WATCHLIST
  // =====================================

  if (
    action === "BUILD" &&
    pressure >= 5
  ) {
    return "WATCHLIST";
  }

  // =====================================
  // DISTRIBUTION
  // =====================================

  if (
    cycle === "DISTRIBUTE"
  ) {
    return "DISTRIBUTE RALLIES";
  }

  // =====================================
  // EXIT
  // =====================================

  if (
    cycle === "EXIT CYCLE"
  ) {
    return "AVOID";
  }

  // =====================================
  // DEFAULT
  // =====================================

  return "NEUTRAL";
}
