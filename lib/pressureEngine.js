export function runPressureEngine({
  astro_window,
  pmp,
  position_action,
  next_week_signal
}) {

  // ========================================
  // DEFAULT
  // ========================================

  let pressure_score = "STABLE";

  // ========================================
  // CLOSED WINDOW
  // ========================================

  if (astro_window === "CLOSED") {
    pressure_score = "BEARISH PRESSURE";
  }

  // ========================================
  // OVERHEATING CONDITIONS
  // ========================================

  if (
    astro_window === "OPEN" &&
    pmp === "HIGH" &&
    position_action === "ADD"
  ) {
    pressure_score = "BUILDING PRESSURE";
  }

  // ========================================
  // RESET / REACCUMULATION
  // ========================================

  if (
    next_week_signal === "RECOVERY" ||
    next_week_signal === "STABILISING"
  ) {
    pressure_score = "REACCUMULATION PHASE";
  }

  return {
    pressure_score
  };
}
