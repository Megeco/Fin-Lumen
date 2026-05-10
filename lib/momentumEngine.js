export function runMomentumEngine(stock) {

  // Stable compounders
  const stableLeaders = [
    "LT.NS",
    "SIEMENS.NS",
    "KPIT.NS",
    "CGPOWER.NS",
    "FORTIS.NS"
  ];

  // Controlled expansion names
  const controlledExpansion = [
    "MAZDOCK.NS",
    "TITAGARH.NS",
    "CUPID.NS",
    "GRWRHITECH.NS",
    "EPACK.NS"
  ];

  // Extended / overheating names
  const extendedNames = [
    "BSE.NS",
    "CDSL.NS",
    "DIXON.NS"
  ];

  // Weak / exhausted
  const exhaustedNames = [
    "SUZLON.NS",
    "DATAPATTNS.NS",
    "AARTIIND.NS",
    "LLOYDSENT.NS"
  ];

  // Default response
  let momentum_state = "NEUTRAL";
  let momentum_score = 5;

  // Stable leaders
  if (stableLeaders.includes(stock)) {
    momentum_state = "CONTROLLED EXPANSION";
    momentum_score = 8;
  }

  // Strong emerging momentum
  if (controlledExpansion.includes(stock)) {
    momentum_state = "EARLY IGNITION";
    momentum_score = 9;
  }

  // Late-stage momentum
  if (extendedNames.includes(stock)) {
    momentum_state = "EXTENDED";
    momentum_score = 6;
  }

  // Weak structures
  if (exhaustedNames.includes(stock)) {
    momentum_state = "EXHAUSTED";
    momentum_score = 2;
  }

  return {
    momentum_state,
    momentum_score
  };
}
