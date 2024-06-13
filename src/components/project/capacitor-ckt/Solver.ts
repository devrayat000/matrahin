import { ACTION, Capacitance, StepsInfo, Wire } from "./store";

export class Solver {
  private Capacitances: Capacitance[];
  private wires: Wire[];
  private terminal1: string;
  private terminal2: string;

  private nodes: string[][][];

  private CapacitanceCount: number;
  private Steps: StepsInfo[] = [];
  private previousCircuit: Capacitance[] = [];

  private maxLengthOfCapacitancesArray: number = 25;

  /**
   * 2D array of strings, each i,j element contains the property of the node
   * node -> end of C : "C"
   * node -> end of wire : "W"
   * node -> terminal : "T"
   * node -> a C or wire directly passes through : "O" //C/wire Over
   * node-> empty : ""
   * priority : C > W > T > O
   *
   * initialized with ""
   *
   *  so, the array can be like : W WCC O C
   *                                 O
   *                                 C
   */
  private circuitPoints: string[][];

  constructor(
    Capacitances: Capacitance[],
    wires: Wire[],
    terminal1: string,
    terminal2: string
  ) {
    this.Capacitances = Capacitances;
    this.wires = wires;
    this.terminal1 = terminal1;
    this.terminal2 = terminal2;
    this.CapacitanceCount = Capacitances.length + 1;
    this.nodes = Array.from({ length: this.maxLengthOfCapacitancesArray }, () =>
      Array.from({ length: this.maxLengthOfCapacitancesArray }, () => [])
    );
    this.circuitPoints = Array.from(
      { length: this.maxLengthOfCapacitancesArray },
      () => Array.from({ length: this.maxLengthOfCapacitancesArray }, () => "")
    );
  }

  private logSingleStep(
    action: ACTION,
    Capacitances: Capacitance[],
    resultantCircuit: Capacitance[],
    wireAddedCount = 0
  ) {
    let removedCapacitances: Capacitance[] = [];
    let resultingCapacitances: Capacitance[] = [];
    let msg1: string;
    let msg2: string;

    let tempWires = structuredClone(this.wires);

    switch (action) {
      case ACTION.SHORT_CIRCUIT_REMOVAL:
        removedCapacitances = Capacitances;
        msg1 =
          msg2 = `${Capacitances[0].name} was removed because of short circuit`;
        break;
      case ACTION.OPEN_CIRCUIT_REMOVAL:
        removedCapacitances = Capacitances;
        msg1 =
          msg2 = `${Capacitances[0].name} was removed because of open circuit`;
        break;
      case ACTION.PARALLEL:
        removedCapacitances = Capacitances.slice(0, Capacitances.length - 1);
        resultingCapacitances = Capacitances.slice(Capacitances.length - 1);
        msg1 =
          removedCapacitances.map((r) => r.name).join(", ") +
          " are in parallel";
        msg2 =
          "Result: " +
          resultingCapacitances[0].name +
          " ( = " +
          removedCapacitances.map((r) => r.name).join(" + ") +
          " )";
        break;
      case ACTION.SERIES:
        removedCapacitances = Capacitances.slice(0, Capacitances.length - 1);
        resultingCapacitances = Capacitances.slice(Capacitances.length - 1);
        msg1 =
          removedCapacitances.map((r) => r.name).join(", ") + " are in series";
        msg2 =
          "Result: " +
          resultingCapacitances[0].name +
          "( = " +
          removedCapacitances.map((r) => r.name).join(" || ") +
          " )";
        break;

      case ACTION.EMPTY_CIRCUIT:
        removedCapacitances = [];
        resultingCapacitances = [];
        msg1 = msg2 = "Empty Circuit";
        break;
      case ACTION.FALLBACK:
        removedCapacitances = [];
        resultingCapacitances = [];
        msg1 = msg2 =
          "Fallback, could not simplify further with traditional methods";
        break;
    }

    // step 1: get all the nodes necessary for resistors
    // step 2: if shorted points on a node doesn't have a resister node or terminal node
    // , remove the wire

    // to highlight the resistors that are removing
    this.Steps.push({
      Circuit: structuredClone(this.previousCircuit),
      Wires: structuredClone(tempWires),
      terminal1: this.terminal1,
      terminal2: this.terminal2,
      removedCapacitances: structuredClone(removedCapacitances),
      resultingCapacitances: [],
      message: msg1,
    });
    // to highlight the resistors that are adding
    this.Steps.push({
      Circuit: structuredClone(resultantCircuit),
      Wires: structuredClone(this.wires),
      terminal1: this.terminal1,
      terminal2: this.terminal2,
      removedCapacitances: [],
      resultingCapacitances: structuredClone(resultingCapacitances),
      message: msg2,
    });

    this.previousCircuit = structuredClone(resultantCircuit);
  }

  public solve() {
    this.initializePointsProps();
    this.updateNodesAndCapacitances();
    this.updateTerminalNodes();
    this.previousCircuit = structuredClone(this.Capacitances);
    this.findEquivalentCapacitance();
    return this.Steps;
  }

  private handlePointsCoveredByRorW(
    node1x: number,
    node1y: number,
    node2x: number,
    node2y: number,
    addition = true
  ) {
    if (node1x === node2x) {
      for (let i = node1y + 1; i < node2y; i++) {
        if (addition) this.circuitPoints[node1x][i] += "O";
        else
          this.circuitPoints[node1x][i] = this.circuitPoints[node1x][i].replace(
            "O",
            ""
          );
      }
    } else if (node1y === node2y) {
      for (let i = node1x + 1; i < node2x; i++) {
        if (addition) this.circuitPoints[i][node1y] += "O";
        else
          this.circuitPoints[i][node1y] = this.circuitPoints[i][node1y].replace(
            "O",
            ""
          );
      }
    } else if (Math.abs(node1x - node2x) === Math.abs(node1y - node2y)) {
      // can be 45 or 135

      // 45
      /**
       *          ** (node1)
       *        **
       *      **(node2)
       */
      if (node2x < node1x && node2y > node1y) {
        [node1x, node1y] = [node2x, node2y];
      }

      /**
       *          ** (node2)
       *        **
       *      **(node1)
       */
      if (node1x < node2x && node1y > node2y) {
        for (let i = 1; i < node2x - node1x; i++) {
          if (addition) this.circuitPoints[node1x + i][node1y - i] += "O";
          else
            this.circuitPoints[node1x + i][node1y - i] = this.circuitPoints[
              node1x + i
            ][node1y - i].replace("O", "");
        }
      }

      // 135
      /**
       *          ** (node2)
       *            **
       *              **(node1)
       */
      if (node2x < node1x && node2y < node1y) {
        [node1x, node1y] = [node2x, node2y];
      }
      /**
       *          ** (node1)
       *            **
       *              **(node2)
       */
      if (node1x < node2x && node1y < node2y) {
        for (let i = 1; i < node2x - node1x; i++) {
          if (addition) this.circuitPoints[node1x + i][node1y + i] += "O";
          else
            this.circuitPoints[node1x + i][node1y + i] = this.circuitPoints[
              node1x + i
            ][node1y + i].replace("O", "");
        }
      }
    }
  }
  private initializePointsProps() {
    for (const wire of this.wires) {
      const [node1, node2] = [wire.start, wire.end];
      let [node1x, node1y] = node1.split("__").map((x) => parseInt(x));
      let [node2x, node2y] = node2.split("__").map((x) => parseInt(x));
      this.circuitPoints[node1x][node1y] += "W";
      this.circuitPoints[node2x][node2y] += "W";

      //  if a Wire is horizontal  or vertical or exactly 45 then the points in between them are "RO"
      this.handlePointsCoveredByRorW(node1x, node1y, node2x, node2y);
    }

    for (const r of this.Capacitances) {
      let [node1x, node1y] = this.getPointFromNode(r.node1);
      let [node2x, node2y] = this.getPointFromNode(r.node2);
      this.circuitPoints[node1x][node1y] += "R";
      this.circuitPoints[node2x][node2y] += "R";

      //  if a R is horizontal  or vertical or exactly 45 then the points in between them are "RO"
      this.handlePointsCoveredByRorW(node1x, node1y, node2x, node2y);
    }

    const [node1x, node1y] = this.getPointFromNode(this.terminal1);
    const [node2x, node2y] = this.getPointFromNode(this.terminal2);
    this.circuitPoints[node1x][node1y] += "T";
    this.circuitPoints[node2x][node2y] += "T";

    // console.log(
    //   this.transpose2DArray(this.circuitPoints)
    //     .map((x) => x.join("\t"))
    //     .join("\n")
    // );
  }

  private updateCircuitPoints(node1: string, node2: string, str: string) {
    const [node1x, node1y] = this.getPointFromNode(node1);
    const [node2x, node2y] = this.getPointFromNode(node2);

    this.circuitPoints[node1x][node1y] = this.circuitPoints[node1x][
      node1y
    ].replace("R", "");

    //  also update the points covered by this R or Wire
    this.handlePointsCoveredByRorW(node1x, node1y, node2x, node2y, false);
  }
  private transpose2DArray(arr: string[][]): string[][] {
    return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
  }
  private updateNodesAndCapacitances() {
    this.generateNodes();
    this.updateNodesOfCapacitances();
  }

  private updateTerminalNodes() {
    let node1 = this.terminal1.split("h")[0].split("__");
    let node2 = this.terminal2.split("h")[0].split("__");
    this.terminal1 += "h" + this.nodes[node1[0]][node1[1]].join("w");
    this.terminal2 += "h" + this.nodes[node2[0]][node2[1]].join("w");
  }

  private generateNodes() {
    this.initializeNodes();

    for (const wire of this.wires) {
      const [node1, node2] = [wire.start, wire.end];
      const [node1x, node1y] = this.getPointFromNode(node1);
      const [node2x, node2y] = this.getPointFromNode(node2);
      const mergedNodes = [
        ...this.nodes[node1x][node1y],
        ...this.nodes[node2x][node2y],
      ];
      const uniqueNodes = Array.from(new Set(mergedNodes));
      // if nodes[i][j] contains node1 or node2, replace it with uniqueNodes
      for (let i = 0; i < this.maxLengthOfCapacitancesArray; i++) {
        for (let j = 0; j < this.maxLengthOfCapacitancesArray; j++) {
          if (
            this.nodes[i][j].includes(node1.split("h")[0]) ||
            this.nodes[i][j].includes(node2.split("h")[0])
          ) {
            this.nodes[i][j] = [...uniqueNodes];
          }
        }
      }
    }
  }
  private initializeNodes() {
    for (let i = 0; i < this.maxLengthOfCapacitancesArray; i++) {
      for (let j = 0; j < this.maxLengthOfCapacitancesArray; j++) {
        this.nodes[i][j] = [`${i}__${j}`];
      }
    }
  }

  private updateNodesOfCapacitances() {
    for (let i = 0; i < this.Capacitances.length; i++) {
      const r = this.Capacitances[i];
      const [node1x, node1y] = this.getPointFromNode(r.node1);
      const [node2x, node2y] = this.getPointFromNode(r.node2);
      r.node1 =
        r.node1.split("h")[0] + "h" + this.nodes[node1x][node1y].join("w");
      r.node2 =
        r.node2.split("h")[0] + "h" + this.nodes[node2x][node2y].join("w");
    }
  }

  private getPointFromNode(node: string): [number, number] {
    return node
      .split("h")[0]
      .split("__")
      .map((x) => parseInt(x)) as [number, number];
  }

  private isEqualNodes(node1: string, node2: string): boolean {
    // return node1.split("h")[1] === node2.split("h")[1];
    // let,
    //  node1.split("h")[1] = 3_4w2_3w1_1
    //  and node2.split("h")[1] = 3_4
    //  if second one is substring of first one then return true
    //  or first one is substring of second one then return true
    // else return false
    if (node1 === "" || node2 === "") return false;
    const [node1x, node1y] = this.getPointFromNode(node1);
    const [node2x, node2y] = this.getPointFromNode(node2);

    return (
      this.nodes[node1x][node1y].includes(`${node2x}__${node2y}`) ||
      this.nodes[node2x][node2y].includes(`${node1x}__${node1y}`)
    );
  }

  private getNewNameForCapacitance(): string {
    return "R" + this.CapacitanceCount++;
  }

  private filterOutInfiniteCapacitances(): boolean {
    let changed = false;
    for (let i = this.Capacitances.length - 1; i >= 0; --i) {
      if (this.Capacitances[i].value == Infinity) {
        this.updateCircuitPoints(
          this.Capacitances[i].node1,
          this.Capacitances[i].node2,
          "R"
        );

        this.Capacitances.splice(i, 1);
        changed = true;
      }
    }
    return changed;
  }

  private addWireBetweenTwoNodes(node1: string, node2: string) {
    const [node1x, node1y] = this.getPointFromNode(node1);
    const [node2x, node2y] = this.getPointFromNode(node2);

    this.wires.push({
      start: `${node1x}__${node1y}`,
      end: `${node2x}__${node2y}`,
    });
  }

  private handleZeroCapacitances(): boolean {
    const circuit = this.Capacitances;
    for (let i = 0; i < circuit.length; ++i) {
      if (circuit[i].value == 0) {
        // remove the Capacitance and add a wire between the two nodes

        const { node1, node2 } = circuit[i];
        this.updateCircuitPoints(node1, node2, "R");
        circuit.splice(i, 1);
        this.addWireBetweenTwoNodes(node1, node2);

        // update the nodes of the Capacitances and Nodes array
        this.updateNodesAndCapacitances();

        return true;
      }
    }
    return false;
  }

  private removeShortCircuits(): boolean {
    let changed = false;
    for (let i = this.Capacitances.length - 1; i >= 0; --i) {
      const Capacitance = this.Capacitances[i];
      const { node1, node2 } = Capacitance;
      if (this.isEqualNodes(node1, node2)) {
        changed = true;
        this.updateCircuitPoints(node1, node2, "R");
        this.Capacitances.splice(i, 1);
        this.logSingleStep(
          ACTION.SHORT_CIRCUIT_REMOVAL,
          [Capacitance],
          this.Capacitances
        );
      }
    }

    return changed;
  }

  private removeOpenCircuits(): boolean {
    let changed = false;

    for (let i = this.Capacitances.length - 1; i >= 0; --i) {
      const Capacitance = this.Capacitances[i];
      const nodesToBeSearched: string[] = [];

      if (
        !this.isEqualNodes(Capacitance.node1, this.terminal1) &&
        !this.isEqualNodes(Capacitance.node1, this.terminal2)
      )
        nodesToBeSearched.push(Capacitance.node1);
      if (
        !this.isEqualNodes(Capacitance.node2, this.terminal1) &&
        !this.isEqualNodes(Capacitance.node2, this.terminal2)
      )
        nodesToBeSearched.push(Capacitance.node2);

      for (const node of nodesToBeSearched) {
        let found = false;
        for (let j = 0; j < this.Capacitances.length; ++j) {
          if (i == j) continue;
          if (
            this.isEqualNodes(this.Capacitances[j].node1, node) ||
            this.isEqualNodes(this.Capacitances[j].node2, node)
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          changed = true;
          this.updateCircuitPoints(
            this.Capacitances[i].node1,
            this.Capacitances[i].node2,
            "R"
          );
          this.Capacitances.splice(i, 1);
          this.logSingleStep(
            ACTION.OPEN_CIRCUIT_REMOVAL,
            [Capacitance],
            this.Capacitances
          );
        }
      }
    }

    return changed;
  }

  private removeUnnecessaryCapacitanceAndNodes(): boolean {
    let changed = false;

    changed ||= this.removeShortCircuits();
    changed ||= this.removeOpenCircuits();

    return changed;
  }

  private isParallel(r1: Capacitance, r2: Capacitance): boolean {
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

  private getParallelWith(r1: Capacitance): Capacitance[] {
    const ret: Capacitance[] = [];
    for (const r2 of this.Capacitances) {
      if (this.isParallel(r1, r2)) {
        ret.push(r2);
      }
    }
    return ret;
  }

  private parallelCapacitanceValue(parallels: Capacitance[]): number {
    return parallels.map((r) => r.value).reduce((a, b) => a + b, 0);
  }

  private mergeParallelUnit(): boolean {
    let parallels: Capacitance[] = [];
    for (const r of this.Capacitances) {
      parallels = this.getParallelWith(r);
      if (parallels.length > 0) {
        parallels.push(r);
        break;
      }
    }
    if (parallels.length == 0) {
      return false;
    }

    const logCapacitances: Capacitance[] = [];
    logCapacitances.push(structuredClone(parallels[0]));

    const val = this.parallelCapacitanceValue(parallels);

    // creating resulting Capacitance
    parallels[0].name = this.getNewNameForCapacitance();
    parallels[0].value = val;

    for (let i = 1; i < parallels.length; ++i)
      logCapacitances.push(structuredClone(parallels[i]));

    logCapacitances.push(structuredClone(parallels[0]));

    for (let i = 1; i < parallels.length; i += 1) {
      parallels[i].value = Infinity;
    }

    // remove the parallel Capacitances
    this.filterOutInfiniteCapacitances();
    this.logSingleStep(ACTION.PARALLEL, logCapacitances, this.Capacitances);

    return true;
  }

  private getCommonEnd(r1: Capacitance, r2: Capacitance): string {
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

  private isSeries(r1: Capacitance, r2: Capacitance): boolean {
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

    for (const r of this.Capacitances) {
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

  private seriesCapacitanceValue(r1: Capacitance, r2: Capacitance): number {
    // return r1.value + r2.value;
    let inverseVal = NaN;
    for (const r of [r1, r2]) {
      if (isNaN(inverseVal)) {
        inverseVal = 1 / r.value;
      } else {
        inverseVal += 1 / r.value;
      }
    }
    return 1 / inverseVal;
  }

  private getSingleSeriesCapacitanceWith(r1: Capacitance): Capacitance | null {
    for (const r2 of this.Capacitances) {
      if (this.isSeries(r1, r2)) {
        return r2;
      }
    }
    return null;
  }

  private mergeTwoSeriesCapacitance(
    r1: Capacitance,
    r2: Capacitance
  ): Capacitance {
    r1.value = this.seriesCapacitanceValue(r1, r2);
    r1.name = this.getNewNameForCapacitance();

    // value set to 0 to remove it
    r2.value = 0;
    this.handleZeroCapacitances();
    return r1;
  }

  private mergeSeriesUnit(): boolean {
    let rs: Capacitance | null = null;

    const logCapacitances: Capacitance[] = [];
    for (const r1 of this.Capacitances) {
      const r2 = this.getSingleSeriesCapacitanceWith(r1);
      if (r2 != null) {
        logCapacitances.push(structuredClone(r1));
        logCapacitances.push(structuredClone(r2));
        rs = this.mergeTwoSeriesCapacitance(r1, r2);
        break;
      }
    }
    if (rs == null) {
      return false;
    }

    while (true) {
      let found = false;
      for (const r of this.Capacitances) {
        if (this.isSeries(rs, r)) {
          logCapacitances.push(structuredClone(r));
          rs = this.mergeTwoSeriesCapacitance(rs, r);
          found = true;
          break;
        }
      }
      if (!found) {
        break;
      }
    }

    logCapacitances.push(structuredClone(rs));
    this.logSingleStep(ACTION.SERIES, logCapacitances, this.Capacitances);
    return true;
  }

  private removeUnnecessaryWires() {
    // remove unnecessary wires
  }

  private findEquivalentCapacitance() {
    while (this.Capacitances.length != 1) {
      while (this.removeUnnecessaryCapacitanceAndNodes());
      if (this.Capacitances.length == 1) break;
      if (this.mergeParallelUnit()) continue;
      if (this.mergeSeriesUnit()) continue;
      // remove unnecessary wires
      this.removeUnnecessaryWires();

      break;
    }
    if (this.Capacitances.length == 0)
      this.logSingleStep(ACTION.EMPTY_CIRCUIT, [], this.Capacitances);
    else if (this.Capacitances.length > 1)
      this.logSingleStep(ACTION.FALLBACK, [], this.Capacitances);
  }
}
