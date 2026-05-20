export function runAstroEventEngine(stock) {

  // =========================================
  // DEFAULT
  // =========================================

  let event_phase = "STABLE";
  let event_warning = "NONE";
  let days_to_event = 0;
  let volatility_risk = "LOW";

  // =========================================
  // HIGH VOLATILITY WINDOWS
  // =========================================

  const highRiskStocks = [

    "KAYNES.NS",
    "MAZDOCK.NS",
    "KPIT.NS",
    "BSE.NS",
    "DATAPATTNS.NS",
    "PCJEWELLER.NS",
    "PFC.NS",
    "RECLTD.NS"

  ];

  // =========================================
  // REACCUMULATION WINDOWS
  // =========================================

  const reaccumulationStocks = [

    "BDL.NS",
    "NEWGEN.NS",
    "LT.NS",
    "FORTIS.NS",
    "EPACK.NS"

  ];

  // =========================================
  // DISTRIBUTION RISK
  // =========================================

  const distributionRisk = [

    "TRENT.NS",
    "SUZLON.NS",
    "IDEA.NS"

  ];

  // =========================================
  // LOGIC
  // =========================================

  // HIGH BETA / OVERHEATING RISK

  if (highRiskStocks.includes(stock)) {

    event_phase = "PRESSURE BUILDING";
    event_warning = "SATELLITE TRIM ALERT";
    days_to_event = 11;
    volatility_risk = "HIGH";

  }

  // REACCUMULATION PHASE

  else if (reaccumulationStocks.includes(stock)) {

    event_phase = "REACCUMULATION PHASE";
    event_warning = "FAVORABLE BUILD ZONE";
    days_to_event = 18;
    volatility_risk = "LOW";

  }

  // DISTRIBUTION RISK

  else if (distributionRisk.includes(stock)) {

    event_phase = "DISTRIBUTION RISK";
    event_warning = "REDUCE AGGRESSION";
    days_to_event = 7;
    volatility_risk = "HIGH";

  }

  return {

    event_phase,
    event_warning,
    days_to_event,
    volatility_risk

  };

}
