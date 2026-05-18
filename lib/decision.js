export function getAction(atScore, trend, dzScore) {

  // HIGH RISK
  if (dzScore >= 7) {
    return "REDUCE";
  }

  // PEAKING
  if (atScore >= 8 && trend === "PEAKING") {
    return "HOLD CORE";
  }

  // STRONG RISING
  if (atScore >= 7 && trend === "RISING") {
    return "BUY ON DIPS";
  }

  // BUILD ZONE
  if (atScore >= 5.5 && trend === "RISING") {
    return "STAGGER";
  }

  // EARLY RECOVERY
  if (atScore >= 4.5) {
    return "WAIT / TRACK";
  }

  return "AVOID";
}
