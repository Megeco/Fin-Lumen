export function getEarlySignal(result) {

  const action = result.position_action;
  const window = result.astro_window;
  const pmp = result.pmp;

  // 🚀 STRONG UPSIDE
  if (action === "ADD" && window === "OPEN" && pmp === "HIGH") {
    return "BUY ALERT";
  }

  // 👀 BUILDING UPSIDE
  if (action === "ADD" && window === "NEUTRAL") {
    return "WATCH BUY";
  }

  // 🔻 STRONG DOWNSIDE
  if (action === "TRIM" && window === "CLOSED" && pmp === "LOW") {
    return "TRIM ALERT";
  }

  // 👀 BUILDING DOWNSIDE
  if (action === "TRIM" && window === "NEUTRAL") {
    return "WATCH TRIM";
  }

  return "NONE";
}
