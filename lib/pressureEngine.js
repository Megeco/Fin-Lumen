// FIX 9: The original engine returned pressure_score as strings ("STABLE",
// "BEARISH PRESSURE", etc.), but update-all.js uses numeric comparisons
// (pressure.pressure_score <= 2, <= 5, <= 7) to derive finalAction.
// All numeric comparisons against strings evaluate to false in JS, meaning
// finalAction always fell through to "EXIT".
//
// This version returns a numeric pressure_score (0–10) and a separate
// pressure_label string for display — both are written to the DB.

export function runPressureEngine({
  astro_window,
  pmp,
  position_action,
  next_week_signal
}) {

  // ========================================
  // DEFAULT — low pressure
  // ========================================

  let pressure_score = 3;
  let pressure_label = "STABLE";

  // ========================================
  // CLOSED WINDOW — bearish pressure
  // ========================================

  if (astro_window === "CLOSED") {
    pressure_score = 8;
    pressure_label = "BEARISH PRESSURE";
  }

  // ========================================
  // OVERHEATING CONDITIONS
  // ========================================

  else if (
    astro_window === "OPEN" &&
    pmp === "HIGH" &&
    position_action === "ADD"
  ) {
    pressure_score = 6;
    pressure_label = "BUILDING PRESSURE";
  }

  // ========================================
  // NEUTRAL WINDOW
  // ========================================

  else if (astro_window === "NEUTRAL") {
    pressure_score = 4;
    pressure_label = "MODERATE";
  }

  // ========================================
  // RESET / REACCUMULATION
  // ========================================

  if (
    next_week_signal === "RECOVERY" ||
    next_week_signal === "STABILISING"
  ) {
    pressure_score = 2;
    pressure_label = "REACCUMULATION PHASE";
  }

  return {
    pressure_score,
    pressure_label
  };
}
