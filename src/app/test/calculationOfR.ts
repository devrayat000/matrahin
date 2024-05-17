export interface Resistance {
  name: string;
  value: number;
  node1: string;
  node2: string;
}

enum ACTION {
  SHORT_CIRCUIT_REMOVAL,
  OPEN_CIRCUIT_REMOVAL,
  SERIES,
  PARALLEL,
  WYE_DELTA,
  FALLBACK,
}

function getNewNameForResistance(): string {
  return "R" + ++currentCount;
}

function filterOutInfiniteResistances(circuit: Resistance[]): boolean {
  let changed = false;
  for (let i = circuit.length - 1; i >= 0; --i) {
    if (circuit[i].value == Infinity) {
      circuit.splice(i, 1);
      changed = true;
    }
  }
  return changed;
}

function mergeNodes(
  circuit: Resistance[],
  mainNode: string,
  removedNode: string
) {
  for (let i = 0; i < circuit.length; ++i) {
    if (circuit[i].node1 == removedNode) circuit[i].node1 = mainNode;
    if (circuit[i].node2 == removedNode) circuit[i].node2 = mainNode;
  }
}

function handleZeroResistances(
  circuit: Resistance[],
  terminal1: string,
  terminal2: string
): boolean {
  for (let i = 0; i < circuit.length; ++i) {
    if (circuit[i].value == 0) {
      if (circuit[i].node2 != terminal1 && circuit[i].node2 != terminal2)
        mergeNodes(circuit, circuit[i].node1, circuit[i].node2);
      else mergeNodes(circuit, circuit[i].node2, circuit[i].node1);
      circuit.splice(i, 1);
      return true;
    }
  }
  return false;
}

function removeShortCircuits(
  circuit: Resistance[],
  log?: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  let changed = false;
  for (let i = circuit.length - 1; i >= 0; --i) {
    const resistance = circuit[i];
    if (resistance.node1 == resistance.node2) {
      changed = true;
      circuit.splice(i, 1);
      if (log) log(ACTION.SHORT_CIRCUIT_REMOVAL, [resistance], circuit);
    }
  }

  return changed;
}

function removeOpenCircuits(
  circuit: Resistance[],
  terminal1: string,
  terminal2: string,
  log?: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  let changed = false;

  for (let i = circuit.length - 1; i >= 0; --i) {
    const resistance = circuit[i];
    const nodesToBeSearched: string[] = [];

    if (resistance.node1 != terminal1 && resistance.node2 != terminal2)
      nodesToBeSearched.push(resistance.node1);
    if (resistance.node2 != terminal1 && resistance.node2 != terminal2)
      nodesToBeSearched.push(resistance.node2);

    for (const node of nodesToBeSearched) {
      let found = false;
      for (let j = 0; j < circuit.length; ++j) {
        if (i == j) continue;
        if (circuit[j].node1 == node || circuit[j].node2 == node) {
          found = true;
          break;
        }
      }
      if (!found) {
        changed = true;
        circuit.splice(i, 1);
        if (log) log(ACTION.OPEN_CIRCUIT_REMOVAL, [resistance], circuit);
      }
    }
  }

  return changed;
}

function removeUnnecessaryResistanceAndNodes(
  circuit: Resistance[],
  terminal1: string,
  terminal2: string,
  log?: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  let changed = false;

  changed ||= removeShortCircuits(circuit, log);
  changed ||= removeOpenCircuits(circuit, terminal1, terminal2, log);

  return changed;
}

function isParallel(r1: Resistance, r2: Resistance): boolean {
  if (r1 == r2) {
    return false;
  }
  if (r1.node1 == r2.node1 && r1.node2 == r2.node2) {
    return true;
  }
  if (r1.node2 == r2.node1 && r1.node1 == r2.node2) {
    return true;
  }
  return false;
}

function getParallelWith(circuit: Resistance[], r1: Resistance): Resistance[] {
  const ret: Resistance[] = [];
  for (const r2 of circuit) {
    if (isParallel(r1, r2)) {
      ret.push(r2);
    }
  }
  return ret;
}

function parallelResistanceValue(parallels: Resistance[]): number {
  let inverseVal = NaN;
  for (const r of parallels) {
    if (isNaN(inverseVal)) {
      inverseVal = 1 / r.value;
    } else {
      inverseVal += 1 / r.value;
    }
  }
  return 1 / inverseVal;
}

function mergeParallelUnit(
  circuit: Resistance[],
  log: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  let parallels: Resistance[] = [];
  for (const r of circuit) {
    parallels = getParallelWith(circuit, r);
    if (parallels.length > 0) {
      parallels.push(r);
      break;
    }
  }
  if (parallels.length == 0) {
    return false;
  }

  const logResistances: Resistance[] = [];
  logResistances.push(structuredClone(parallels[0]));

  const val = parallelResistanceValue(parallels);
  parallels[0].name = getNewNameForResistance();
  parallels[0].value = val;

  for (let i = 1; i < parallels.length; ++i)
    logResistances.push(structuredClone(parallels[i]));
  logResistances.push(structuredClone(parallels[0]));

  for (let i = 1; i < parallels.length; i += 1) {
    parallels[i].value = Infinity;
  }

  filterOutInfiniteResistances(circuit);
  log(ACTION.PARALLEL, logResistances, circuit);

  return true;
}

function getCommonEnd(r1: Resistance, r2: Resistance): string {
  if (r1.node1 == r2.node1 || r1.node1 == r2.node2) {
    return r1.node1;
  } else if (r1.node2 == r2.node1 || r1.node2 == r2.node2) {
    return r1.node2;
  }
  return "";
}

function isSeries(
  circuit: Resistance[],
  r1: Resistance,
  r2: Resistance,
  terminal1: string,
  terminal2: string
): boolean {
  if (r1 == r2) {
    return false;
  }
  if (isParallel(r1, r2)) {
    return false;
  }

  const common = getCommonEnd(r1, r2);
  if (common == "") {
    return false;
  }
  if (common == terminal1 || common == terminal2) return false;

  for (const r of circuit) {
    if (r == r1 || r == r2) {
      continue;
    }
    if (r.node1 == common || r.node2 == common) {
      return false;
    }
  }

  return true;
}

function seriesResistanceValue(r1: Resistance, r2: Resistance): number {
  return r1.value + r2.value;
}

function getSingleSeriesResistanceWith(
  circuit: Resistance[],
  r1: Resistance,
  terminal1: string,
  terminal2: string
): Resistance | null {
  for (const r2 of circuit) {
    if (isSeries(circuit, r1, r2, terminal1, terminal2)) {
      return r2;
    }
  }
  return null;
}

function mergeTwoSeriesResistance(
  circuit: Resistance[],
  r1: Resistance,
  r2: Resistance,
  terminal1: string,
  terminal2: string
): Resistance {
  r1.value = seriesResistanceValue(r1, r2);
  r2.value = 0;
  handleZeroResistances(circuit, terminal1, terminal2);
  r1.name = getNewNameForResistance();
  // add start and end: start = r1.start ,end = r2.end
  // also check if there's already a resistance with the same start and end
  // if there is, use start = r1.start and end = r1.end and add a wire between r1.end and r2.end
  // also r1.end += "w" + r2.end; //making same node for r1.end and r2.end
  return r1;
}

function mergeSeriesUnit(
  circuit: Resistance[],
  terminal1: string,
  terminal2: string,
  log: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  let rs: Resistance | null = null;

  const logResistances: Resistance[] = [];
  for (const r1 of circuit) {
    const r2 = getSingleSeriesResistanceWith(circuit, r1, terminal1, terminal2);
    if (r2 != null) {
      logResistances.push(structuredClone(r1));
      logResistances.push(structuredClone(r2));
      rs = mergeTwoSeriesResistance(circuit, r1, r2, terminal1, terminal2);
      break;
    }
  }
  if (rs == null) {
    return false;
  }

  while (true) {
    let found = false;
    for (const r of circuit) {
      if (isSeries(circuit, rs, r, terminal1, terminal2)) {
        logResistances.push(structuredClone(r));
        rs = mergeTwoSeriesResistance(circuit, rs, r, terminal1, terminal2);
        found = true;
        break;
      }
    }
    if (!found) {
      break;
    }
  }

  logResistances.push(structuredClone(rs));
  log(ACTION.SERIES, logResistances, circuit);
  return true;
}

function isWye(
  circuit: Resistance[],
  r1: Resistance,
  r2: Resistance,
  r3: Resistance,
  t1: string,
  t2: string
): boolean {
  if (r1 == r2 || r2 == r3 || r3 == r1) {
    return false;
  }
  if (isParallel(r1, r2) || isParallel(r2, r3) || isParallel(r3, r1)) {
    return false;
  }
  const common = getCommonEnd(r1, r2);
  if (getCommonEnd(r2, r3) != common) {
    return false;
  }
  if (common == t1 || common == t2) {
    return false;
  }
  for (const r of circuit) {
    if (r == r1 || r == r2 || r == r3) continue;
    if (r.node1 == common || r.node2 == common) {
      return false;
    }
  }
  return true;
}

function getDeltaFromWye(
  r1: Resistance,
  r2: Resistance,
  r3: Resistance
): Resistance[] {
  const n = getCommonEnd(r1, r2);
  const a = r1.node1 == n ? r1.node2 : r1.node1;
  const b = r2.node1 == n ? r2.node2 : r2.node1;
  const c = r3.node1 == n ? r3.node2 : r3.node1;
  const factor =
    (r1.value * r2.value * r3.value) / parallelResistanceValue([r1, r2, r3]);
  const r_ab: Resistance = {
    name: getNewNameForResistance(),
    value: factor / r3.value,
    node1: a,
    node2: b,
  };
  const r_bc: Resistance = {
    name: getNewNameForResistance(),
    value: factor / r1.value,
    node1: b,
    node2: c,
  };
  const r_ca: Resistance = {
    name: getNewNameForResistance(),
    value: factor / r2.value,
    node1: c,
    node2: a,
  };
  return [r_ab, r_bc, r_ca];
}

function solveWyes(
  circuit: Resistance[],
  t1: string,
  t2: string,
  log: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
): boolean {
  for (const r1 of circuit) {
    for (const r2 of circuit) {
      for (const r3 of circuit) {
        if (isWye(circuit, r1, r2, r3, t1, t2)) {
          const [r_ab, r_bc, r_ca] = getDeltaFromWye(r1, r2, r3);
          circuit.push(r_ab);
          circuit.push(r_bc);
          circuit.push(r_ca);
          const i = circuit.indexOf(r1);
          circuit.splice(i, 1);
          const j = circuit.indexOf(r2);
          circuit.splice(j, 1);
          const k = circuit.indexOf(r3);
          circuit.splice(k, 1);
          log(ACTION.WYE_DELTA, [r1, r2, r3, r_ab, r_bc, r_ca], circuit);
          return true;
        }
      }
    }
  }
  return false;
}

function findEquivalentResistance(
  circuit: Resistance[],
  terminal1: string,
  terminal2: string,
  log: (
    action: ACTION,
    resistances: Resistance[],
    circuit: Resistance[]
  ) => void
) {
  console.log(circuit);

  while (circuit.length != 1) {
    while (
      removeUnnecessaryResistanceAndNodes(circuit, terminal1, terminal2, log)
    );
    if (mergeParallelUnit(circuit, log)) continue;
    if (mergeSeriesUnit(circuit, terminal1, terminal2, log)) continue;
    if (solveWyes(circuit, terminal1, terminal2, log)) continue;

    break;
  }

  if (circuit.length != 1) log(ACTION.FALLBACK, [], circuit);
}
const circuit: Resistance[] = [
  {
    name: "R1",
    value: 1,
    node1: "A",
    node2: "B",
  },
  {
    name: "R2",
    value: 2,
    node1: "B",
    node2: "C",
  },
  {
    name: "R3",
    value: 1,
    node1: "C",
    node2: "D",
  },
  {
    name: "R4",
    value: 1,
    node1: "D",
    node2: "E",
  },
];
// const circuit: Resistance[] = [
//   {
//     name: "R1",
//     value: 1,
//     node1: "A",
//     node2: "B",
//   },

//   {
//     name: "R2",
//     value: 2,
//     node1: "A",
//     node2: "C",
//   },

//   {
//     name: "R3",
//     value: 3,
//     node1: "B",
//     node2: "C",
//   },

//   {
//     name: "R4",
//     value: 4,
//     node1: "B",
//     node2: "D",
//   },

//   {
//     name: "R5",
//     value: 5,
//     node1: "B",
//     node2: "E",
//   },

//   {
//     name: "R6",
//     value: 6,
//     node1: "D",
//     node2: "E",
//   },

//   {
//     name: "R7",
//     value: 7,
//     node1: "C",
//     node2: "D",
//   },
// ];
let currentCount = circuit.length;

function log(action: ACTION, resistances: Resistance[], circuit: Resistance[]) {
  if (action === ACTION.SHORT_CIRCUIT_REMOVAL) {
    console.log(`${resistances[0].name} was removed because of short circuit`);
  } else if (action == ACTION.OPEN_CIRCUIT_REMOVAL) {
    console.log(`${resistances[0].name} was removed because of open circuit`);
  } else if (action == ACTION.SERIES) {
    let message = "";
    for (let i = 0; i < resistances.length - 1; ++i) {
      message += resistances[i].name;
      if (i < resistances.length - 2) message += ", ";
    }
    message += ` are in series, result: ${
      resistances[resistances.length - 1].name
    }`;
    console.log(message);
  } else if (action == ACTION.PARALLEL) {
    let message = "";
    for (let i = 0; i < resistances.length - 1; ++i) {
      message += resistances[i].name;
      if (i < resistances.length - 2) message += ", ";
    }
    message += ` are in parallel, result: ${
      resistances[resistances.length - 1].name
    }`;
    console.log(message);
  } else if (action == ACTION.WYE_DELTA) {
    console.log(
      `wye-delta conversion with ${resistances[0].name}, ${resistances[1].name}, ${resistances[2].name} and substituions: ${resistances[3].name}, ${resistances[4].name}, ${resistances[5].name}`
    );
  } else if (action == ACTION.FALLBACK) {
    console.log("cannot reduce further with traditional methods");
  }

  console.log(circuit);
}

findEquivalentResistance(circuit, "A", "F", log);
