export function run2027CycleEngine(stock) {

  // ========================================
  // SUPER CYCLE LEADERS
  // ========================================

  const superCycle = [

    "KAYNES.NS",
    "MAZDOCK.NS",
    "KPIT.NS",
    "NEWGEN.NS",
    "BSE.NS",
    "BDL.NS",
    "CGPOWER.NS",
    "DATAPATTNS.NS",
    "EPACK.NS"

  ];

  // ========================================
  // STRUCTURAL LEADERS
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
    "RECLTD.NS",
    "KPIT.NS",
    "MAZDOCK.NS",
    "BSE.NS"

  ];

  // ========================================
  // ROTATIONAL
  // ========================================

  const rotational = [

    "SUZLON.NS",
    "IDEA.NS",
    "JMFINANCIAL.NS",
    "TDPOWERSYS.NS"

  ];

  // ========================================
  // DISTRIBUTE
  // ========================================

  const distribute = [

    "TRENT.NS",
    "PCJEWELLER.NS"

  ];

  // ========================================
  // CLASSIFICATION
  // ========================================

  let cycle_2027 = "EXIT CYCLE";

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

  return {
    cycle_2027
  };
}
