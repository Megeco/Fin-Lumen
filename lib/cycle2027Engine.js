export function run2027CycleEngine(stock) {

  // ========================================
  // SUPER CYCLE LEADERS
  // Highest conviction 2026–2028 compounders
  // ========================================

  const superCycle = [

    "KAYNES.NS",
    "MAZDOCK.NS",
    "KPIT.NS",
    "NEWGEN.NS",
    "BSE.NS",
    "BDL.NS",
    "RECLTD.NS",
    "CGPOWER.NS",
    "DATAPATTNS.NS",
    "EPACK.NS"

  ];

  // ========================================
  // STRUCTURAL LEADERS
  // Long-duration compounders
  // ========================================

  const structural = [

    "LT.NS",
    "FORTIS.NS",
    "COCHINSHIP.NS",
    "TITAGARH.NS",
    "CUMMINSIND.NS",
    "SIEMENS.NS",
    "TATAPOWER.NS",
    "IRFC.NS",
    "CDSL.NS",
    "LUPIN.NS",
    "PFC.NS",
    "BHARTIARTL.NS",
    "TITAN.NS",
    "INFY.NS",
    "GRASIM.NS",
    "DIXON.NS"

  ];

  // ========================================
  // ROTATIONAL
  // Tactical / cyclical / medium conviction
  // ========================================

  const rotational = [

    "SUZLON.NS",
    "IDEA.NS",
    "JMFINANCIL.NS",
    "TDPOWERSYS.NS",
    "HBLENGINE.NS",
    "JAYKAY.NS",
    "GRAVITA.NS",
    "STAR.NS",
    "ENGINERSIN.NS"

  ];

  // ========================================
  // DISTRIBUTE
  // Late-cycle tactical trimming zone
  // ========================================

  const distribute = [

    "TRENT.NS"

  ];

  // ========================================
  // EXIT CYCLE
  // Thesis broken / structurally weak
  // ========================================

  const exitCycle = [

    "PCJEWELLER.NS",
    "CUPID.NS",
    "SKIPPER.NS",
    "PGEL.NS",
    "HSCL.NS"

  ];

  // ========================================
  // CLASSIFICATION
  // ========================================

  let cycle_2027 = "ROTATIONAL";

  if (superCycle.includes(stock)) {
    cycle_2027 = "SUPER CYCLE LEADER";
  }

  else if (structural.includes(stock)) {
    cycle_2027 = "STRUCTURAL LEADER";
  }

  else if (rotational.includes(stock)) {
    cycle_2027 = "ROTATIONAL";
  }

  else if (distribute.includes(stock)) {
    cycle_2027 = "DISTRIBUTE";
  }

  else if (exitCycle.includes(stock)) {
    cycle_2027 = "EXIT CYCLE";
  }

  return {
    cycle_2027
  };
}
