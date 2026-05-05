export function decisionEngine({ FS, CA, AT, DZ }) {
  let phase, action, positioning, signal;

  if (AT < 5) {
    phase = "Accumulation";
    action = "BUY ON DIPS";
    positioning = "60–75%";
  } else if (AT < 6.5) {
    phase = "Build";
    action = "STAGGER";
    positioning = "40–70%";
  } else {
    phase = "Expansion";
    action = "HOLD / ADD";
    positioning = "40–60%";
  }

  signal = AT > 6.5 ? "🟢 Rising" : AT > 5.5 ? "🟡 Stable" : "🔴 Weak";

  return { phase, action, positioning, signal };
}
