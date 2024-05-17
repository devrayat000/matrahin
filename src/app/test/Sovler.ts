import { Wire } from "./store";
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

export class Solver {
  private resistances: Resistance[];
  private wires: Wire[];
  private terminal1: string;
  private terminal2: string;

  private nodes: string[][][];

  private resistanceCount: number;
  constructor(
    resistances: Resistance[],
    wires: Wire[],
    terminal1: string,
    terminal2: string
  ) {
    this.resistances = resistances;
    this.wires = wires;
    this.terminal1 = terminal1;
    this.terminal2 = terminal2;
    this.resistanceCount = resistances.length + 1;
  }

  private updateNodesAndResistances() {
    this.generateNodes();
    this.updateNodesOfResistances();
  }

  public solve() {
    this.updateNodesAndResistances();
    this.findEquivalentResistance();
  }

  private initializeNodes() {
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        this.nodes[i][j] = [`${i}__${j}`];
      }
    }
  }
  private generateNodes() {
    this.initializeNodes();

    for (const wire of this.wires) {
      const [node1, node2] = [wire.start, wire.end];
      const [node1x, node1y] = node1.split("__").map((x) => parseInt(x));
      const [node2x, node2y] = node2.split("__").map((x) => parseInt(x));
      const mergedNodes = [
        ...this.nodes[node1x][node1y],
        ...this.nodes[node2x][node2y],
      ];
      const uniqueNodes = Array.from(new Set(mergedNodes));
      // if nodes[i][j] contains node1 or node2, replace it with uniqueNodes
      for (let i = 0; i < 30; i++) {
        for (let j = 0; j < 30; j++) {
          if (
            this.nodes[i][j].includes(node1) ||
            this.nodes[i][j].includes(node2)
          ) {
            this.nodes[i][j] = [...uniqueNodes];
          }
        }
      }
    }
  }

  private updateNodesOfResistances() {
    this.resistances.forEach((r) => {
      const [node1x, node1y] = r.node1.split("__").map((x) => parseInt(x));
      const [node2x, node2y] = r.node2.split("__").map((x) => parseInt(x));
      r.node1 =
        r.node1.split("h")[0] + "h" + this.nodes[node1x][node1y].join("w");
      r.node2 =
        r.node2.split("h")[0] + "h" + this.nodes[node2x][node2y].join("w");
    });
  }

  private getPointFromNode(node: string): [number, number] {
    return node
      .split("h")[0]
      .split("__")
      .map((x) => parseInt(x)) as [number, number];
  }

  private isEqualNodes(node1: string, node2: string): boolean {
    return node1.split("h")[1] === node2.split("h")[1];
  }

  private logSingleStep(action: ACTION, resistances: Resistance[]) {}

  private getNewNameForResistance(): string {
    return "R" + this.resistanceCount++;
  }

  private filterOutInfiniteResistances(): boolean {
    let changed = false;
    for (let i = this.resistances.length - 1; i >= 0; --i) {
      if (this.resistances[i].value == Infinity) {
        this.resistances.splice(i, 1);
        changed = true;
      }
    }
    return changed;
  }

  private mergeNodes(
    circuit: Resistance[],
    mainNode: string,
    removedNode: string
  ) {
    for (let i = 0; i < circuit.length; ++i) {
      if (circuit[i].node1 == removedNode) circuit[i].node1 = mainNode;
      if (circuit[i].node2 == removedNode) circuit[i].node2 = mainNode;
    }
  }

  private addWireBetweenTwoNodes(node1: string, node2: string) {
    const [node1x, node1y] = this.getPointFromNode(node1);
    const [node2x, node2y] = this.getPointFromNode(node2);

    this.wires.push({
      start: `${node1x}__${node1y}`,
      end: `${node2x}__${node2y}`,
    });
  }

  private handleZeroResistances(): boolean {
    const circuit = this.resistances;
    for (let i = 0; i < circuit.length; ++i) {
      if (circuit[i].value == 0) {
        // remove the resistance and add a wire between the two nodes

        const { node1, node2 } = circuit[i];
        circuit.splice(i, 1);
        this.addWireBetweenTwoNodes(node1, node2);

        // update the nodes of the resistances and Nodes array
        this.updateNodesAndResistances();

        return true;
      }
    }
    return false;
  }

  private removeShortCircuits(): boolean {
    let changed = false;
    for (let i = this.resistances.length - 1; i >= 0; --i) {
      const resistance = this.resistances[i];
      if (this.isEqualNodes(resistance.node1, resistance.node2)) {
        changed = true;
        this.resistances.splice(i, 1);
        this.logSingleStep(ACTION.SHORT_CIRCUIT_REMOVAL, [resistance]);
      }
    }

    return changed;
  }

  private removeOpenCircuits(): boolean {
    let changed = false;

    for (let i = this.resistances.length - 1; i >= 0; --i) {
      const resistance = this.resistances[i];
      const nodesToBeSearched: string[] = [];

      if (
        !this.isEqualNodes(resistance.node1, this.terminal1) &&
        !this.isEqualNodes(resistance.node2, this.terminal2)
      )
        nodesToBeSearched.push(resistance.node1);
      if (
        !this.isEqualNodes(resistance.node2, this.terminal1) &&
        !this.isEqualNodes(resistance.node2, this.terminal2)
      )
        nodesToBeSearched.push(resistance.node2);

      for (const node of nodesToBeSearched) {
        let found = false;
        for (let j = 0; j < this.resistances.length; ++j) {
          if (i == j) continue;
          if (
            this.resistances[j].node1 == node ||
            this.resistances[j].node2 == node
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          changed = true;
          this.resistances.splice(i, 1);
          this.logSingleStep(ACTION.OPEN_CIRCUIT_REMOVAL, [resistance]);
        }
      }
    }

    return changed;
  }

  private removeUnnecessaryResistanceAndNodes(): boolean {
    let changed = false;

    changed ||= this.removeShortCircuits();
    changed ||= this.removeOpenCircuits();

    return changed;
  }

  private isParallel(r1: Resistance, r2: Resistance): boolean {
    if (r1 == r2) {
      return false;
    }
    if (
      this.isEqualNodes(r1.node1, r2.node1) &&
      this.isEqualNodes(r1.node2, r2.node2)
    ) {
      return true;
    }
    if (
      this.isEqualNodes(r1.node2, r2.node1) &&
      this.isEqualNodes(r1.node1, r2.node2)
    ) {
      return true;
    }
    return false;
  }

  private getParallelWith(r1: Resistance): Resistance[] {
    const ret: Resistance[] = [];
    for (const r2 of this.resistances) {
      if (this.isParallel(r1, r2)) {
        ret.push(r2);
      }
    }
    return ret;
  }

  private parallelResistanceValue(parallels: Resistance[]): number {
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

  private mergeParallelUnit(): boolean {
    let parallels: Resistance[] = [];
    for (const r of this.resistances) {
      parallels = this.getParallelWith(r);
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

    const val = this.parallelResistanceValue(parallels);

    // creating resulting resistance
    parallels[0].name = this.getNewNameForResistance();
    parallels[0].value = val;

    for (let i = 0; i < parallels.length; ++i)
      logResistances.push(structuredClone(parallels[i]));

    logResistances.push(structuredClone(parallels[0]));

    for (let i = 1; i < parallels.length; i += 1) {
      parallels[i].value = Infinity;
    }

    // remove the parallel resistances
    this.filterOutInfiniteResistances();
    this.logSingleStep(ACTION.PARALLEL, logResistances);

    return true;
  }

  private getCommonEnd(r1: Resistance, r2: Resistance): string {
    if (
      this.isEqualNodes(r1.node1, r2.node1) ||
      this.isEqualNodes(r1.node1, r2.node2)
    ) {
      return r1.node1;
    } else if (
      this.isEqualNodes(r1.node2, r2.node1) ||
      this.isEqualNodes(r1.node2, r2.node2)
    ) {
      return r1.node2;
    }
    return "";
  }

  private isSeries(r1: Resistance, r2: Resistance): boolean {
    if (r1 == r2) {
      return false;
    }
    if (this.isParallel(r1, r2)) {
      return false;
    }

    const common = this.getCommonEnd(r1, r2);
    if (common == "") {
      return false;
    }
    if (
      this.isEqualNodes(common, this.terminal1) ||
      this.isEqualNodes(common, this.terminal2)
    )
      return false;

    for (const r of this.resistances) {
      if (r == r1 || r == r2) {
        continue;
      }
      if (
        this.isEqualNodes(r.node1, common) ||
        this.isEqualNodes(r.node2, common)
      ) {
        return false;
      }
    }

    return true;
  }

  private seriesResistanceValue(r1: Resistance, r2: Resistance): number {
    return r1.value + r2.value;
  }

  private getSingleSeriesResistanceWith(r1: Resistance): Resistance | null {
    for (const r2 of this.resistances) {
      if (this.isSeries(r1, r2)) {
        return r2;
      }
    }
    return null;
  }

  private mergeTwoSeriesResistance(r1: Resistance, r2: Resistance): Resistance {
    r1.value = this.seriesResistanceValue(r1, r2);
    r1.name = this.getNewNameForResistance();

    // value set to 0 to remove it
    r2.value = 0;
    this.handleZeroResistances();
    return r1;
  }

  private mergeSeriesUnit(): boolean {
    let rs: Resistance | null = null;

    const logResistances: Resistance[] = [];
    for (const r1 of this.resistances) {
      const r2 = this.getSingleSeriesResistanceWith(r1);
      if (r2 != null) {
        logResistances.push(structuredClone(r1));
        logResistances.push(structuredClone(r2));
        rs = this.mergeTwoSeriesResistance(r1, r2);
        break;
      }
    }
    if (rs == null) {
      return false;
    }

    while (true) {
      let found = false;
      for (const r of this.resistances) {
        if (this.isSeries(rs, r)) {
          logResistances.push(structuredClone(r));
          rs = this.mergeTwoSeriesResistance(rs, r);
          found = true;
          break;
        }
      }
      if (!found) {
        break;
      }
    }

    logResistances.push(structuredClone(rs));
    this.logSingleStep(ACTION.SERIES, logResistances);
    return true;
  }

  private isWye(r1: Resistance, r2: Resistance, r3: Resistance): boolean {
    if (r1 == r2 || r2 == r3 || r3 == r1) {
      return false;
    }
    if (
      this.isParallel(r1, r2) ||
      this.isParallel(r2, r3) ||
      this.isParallel(r3, r1)
    ) {
      return false;
    }
    const common = this.getCommonEnd(r1, r2);
    if (!this.isEqualNodes(this.getCommonEnd(r2, r3), common)) {
      return false;
    }
    if (
      this.isEqualNodes(common, this.terminal1) ||
      this.isEqualNodes(common, this.terminal2)
    ) {
      return false;
    }
    for (const r of this.resistances) {
      if (r == r1 || r == r2 || r == r3) continue;
      if (
        this.isEqualNodes(r.node1, common) ||
        this.isEqualNodes(r.node2, common)
      ) {
        return false;
      }
    }
    return true;
  }

  private getDeltaFromWye(
    r1: Resistance,
    r2: Resistance,
    r3: Resistance
  ): Resistance[] {
    const n = this.getCommonEnd(r1, r2);
    const a = this.isEqualNodes(r1.node1, n) ? r1.node2 : r1.node1;
    const b = this.isEqualNodes(r2.node1, n) ? r2.node2 : r2.node1;
    const c = this.isEqualNodes(r3.node1, n) ? r3.node2 : r3.node1;
    const factor =
      (r1.value * r2.value * r3.value) /
      this.parallelResistanceValue([r1, r2, r3]);
    const r_ab: Resistance = {
      name: this.getNewNameForResistance(),
      value: factor / r3.value,
      node1: a,
      node2: b,
    };
    const r_bc: Resistance = {
      name: this.getNewNameForResistance(),
      value: factor / r1.value,
      node1: b,
      node2: c,
    };
    const r_ca: Resistance = {
      name: this.getNewNameForResistance(),
      value: factor / r2.value,
      node1: c,
      node2: a,
    };
    return [r_ab, r_bc, r_ca];
  }

  private solveWyes(): boolean {
    for (const r1 of this.resistances) {
      for (const r2 of this.resistances) {
        for (const r3 of this.resistances) {
          if (this.isWye(r1, r2, r3)) {
            const [r_ab, r_bc, r_ca] = this.getDeltaFromWye(r1, r2, r3);
            this.resistances.push(r_ab);
            this.resistances.push(r_bc);
            this.resistances.push(r_ca);
            const i = this.resistances.indexOf(r1);
            this.resistances.splice(i, 1);
            const j = this.resistances.indexOf(r2);
            this.resistances.splice(j, 1);
            const k = this.resistances.indexOf(r3);
            this.resistances.splice(k, 1);
            this.logSingleStep(ACTION.WYE_DELTA, [
              r1,
              r2,
              r3,
              r_ab,
              r_bc,
              r_ca,
            ]);
            return true;
          }
        }
      }
    }
    return false;
  }

  private removeUnnecessaryWires() {
    // remove unnecessary wires
  }

  private findEquivalentResistance() {
    while (this.resistances.length != 1) {
      while (this.removeUnnecessaryResistanceAndNodes());
      if (this.mergeParallelUnit()) continue;
      if (this.mergeSeriesUnit()) continue;
      if (this.solveWyes()) continue;
      // remove unnecessary wires
      this.removeUnnecessaryWires();

      break;
    }

    if (this.resistances.length != 1) this.logSingleStep(ACTION.FALLBACK, []);
  }
}
