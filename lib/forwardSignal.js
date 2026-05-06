export function getForwardSignal(result) {

  const window = result.astro_window;
  const pmp = result.pmp;
  const action = result.position_action;

  // 🟢 Bullish build-up
  if (
    (window === "NEUTRAL" && pmp === "MEDIUM" && action === "HOLD") ||
    (window === "OPEN" && pmp === "MEDIUM")
  ) {
    return "BUILDING BULLISH";
  }

  // 🔴 Bearish build-up
  if (
    (window === "NEUTRAL" && pmp === "LOW") ||
    (window === "CLOSED" && action === "TRIM")
  ) {
    return "BUILDING BEARISH";
  }

  return "STABLE";
}
