export function getConfidence(
  stock
) {

  let score = 0;

  const cycle =
    stock
      .structural_cycle ||
    "";

  const pressure =
    stock
      .pressureLevel ||
    "";

  const expansion =
    stock
      .expansionLevel ||
    "";

  const ignition =
    stock
      .next_ignition ||
    "";

  const behaviour =
    stock
      .expected_behaviour ||
    "";

  // ==========================
  // STRUCTURAL QUALITY
  // ==========================

  if (
    cycle ===
    "SUPER CYCLE LEADER"
  ) {
    score += 3;
  }

  else if (
    cycle ===
    "STRUCTURAL LEADER"
  ) {
    score += 2;
  }

  else if (
    cycle ===
    "ROTATIONAL"
  ) {
    score -= 1;
  }

  else if (
    cycle ===
    "EXIT CYCLE"
  ) {
    score -= 2;
  }

  // ==========================
  // PRESSURE / EXPANSION
  // ==========================

  if (
    expansion ===
    "STRONG"
  ) {
    score += 3;
  }

  else if (
    expansion ===
    "MODERATE"
  ) {
    score += 2;
  }

  if (
    pressure ===
    "HIGH"
  ) {
    score -= 2;
  }

  // ==========================
  // IGNITION TIMING
  // ==========================

  if (
    ignition.includes(
      "7 Days"
    )
  ) {
    score += 2;
  }

  else if (
    ignition.includes(
      "10 Days"
    )
  ) {
    score += 1;
  }

  // ==========================
  // BEHAVIOUR
  // ==========================

  if (
    behaviour.includes(
      "Pressure likely absorbed"
    )
  ) {
    score += 2;
  }

  if (
    behaviour.includes(
      "Temporary pressure phase"
    )
  ) {
    score += 1;
  }

  if (
    behaviour.includes(
      "Higher volatility likely"
    )
  ) {
    score -= 1;
  }

  // ==========================
  // FINAL LABEL
  // ==========================

  if (
    score >= 7
  ) {

    return {
      label:
        "HIGH",
      score
    };
  }

  if (
    score >= 4
  ) {

    return {
      label:
        "MEDIUM",
      score
    };
  }

  return {
    label:
      "LOW",
    score
  };
}
