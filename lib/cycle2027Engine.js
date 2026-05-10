export function run2027CycleEngine(stockName) {

  const leaders = [
    "MAZDOCK.NS",
    "KPIT.NS",
    "LT.NS",
    "EPACK.NS",
    "CGPOWER.NS"
  ];

  const strongHold = [
    "FORTIS.NS",
    "TITAGARH.NS",
    "LUPIN.NS"
  ];

  const rotational = [
    "SIEMENS.NS",
    "CUMMINSIND.NS",
    "TDPOWERSYS.NS"
  ];

  const distribute = [
    "TRENT.NS",
    "RECLTD.NS",
    "SUZLON.NS"
  ];

  if (leaders.includes(stockName)) {
    return {
      cycle_2027: "MAJOR LEADER"
    };
  }

  if (strongHold.includes(stockName)) {
    return {
      cycle_2027: "STRONG HOLD"
    };
  }

  if (rotational.includes(stockName)) {
    return {
      cycle_2027: "ROTATIONAL"
    };
  }

  if (distribute.includes(stockName)) {
    return {
      cycle_2027: "DISTRIBUTE"
    };
  }

  return {
    cycle_2027: "EXIT CYCLE"
  };
}
