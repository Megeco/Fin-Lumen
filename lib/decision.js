export function decisionEngine({ FS, CA, AT, DZ }) {
  let phase = "Build";
  let action = "WAIT";
  let positioning = "15–40%";

  if (AT < 5) {
    phase = "Accumulation";
    action = "BUY ON DIPS";
    positioning = "60–75%";
  } else if (AT < 6.5) {
    phase = "Build";
    action = "STAGGER";
    positioning = "50–65%";
  } else {
    phase = "Expansion";
    action = "HOLD / ADD";
    positioning = "40–60%";
  }

  const signal = AT > 6 ? "🟢 Rising" : "🟡 Stable";

  return { phase, action, positioning, signal };
}