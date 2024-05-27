import { ACTION, Resistance, StepsInfo, Wire } from "./store";

export class Solver {
  private resistances: Resistance[];
  private wires: Wire[];
  private terminal1: string;
  private terminal2: string;

  private nodes: string[][][];

  private resistanceCount: number;
  private Steps: StepsInfo[] = [];
  private previousCircuit: Resistance[] = [];

  private maxLengthOfResistancesArray: number = 25;

  /**
   * 2D array of strings, each i,j element contains the property of the node
   * node -> end of R : "R"
   * node -> end of wire : "W"
   * node -> terminal : "T"
   * node -> a R or wire directly passes through : "O" //R/wire Over
   * node-> empty : ""
   * priority : R > W > T > O
   *
   * initialized with ""
   *
   *  so, the array can be like : W WRR O R
   *                                 O
   *                                 R
   */
  private circuitPoints: string[][];

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
    this.nodes = Array.from({ length: this.maxLengthOfResistancesArray }, () =>
      Array.from({ length: this.maxLengthOfResistancesArray }, () => [])
    );
    this.circuitPoints = Array.from(
      { length: this.maxLengthOfResistancesArray },
      () => Array.from({ length: this.maxLengthOfResistancesArray }, () => "")
    );
  }

  private logSingleStep(
    action: ACTION,
    resistances: Resistance[],
    resultantCircuit: Resistance[],
    wireAddedCount = 0
  ) {
    let removedResistances: Resistance[] = [];
    let resultingResistances: Resistance[] = [];
    let msg1: string;
    let msg2: string;

    let tempWires = structuredClone(this.wires);

    switch (action) {
      case ACTION.SHORT_CIRCUIT_REMOVAL:
        removedResistances = resistances;
        msg1 =
          msg2 = `${resistances[0].name} was removed because of short circuit`;
        break;
      case ACTION.OPEN_CIRCUIT_REMOVAL:
        removedResistances = resistances;
        msg1 =
          msg2 = `${resistances[0].name} was removed because of open circuit`;
        break;
      case ACTION.PARALLEL:
        removedResistances = resistances.slice(0, resistances.length - 1);
        resultingResistances = resistances.slice(resistances.length - 1);
        msg1 =
          removedResistances.map((r) => r.name).join(", ") + " are in parallel";
        msg2 =
          "result: " +
          resultingResistances[0].name +
          " ( = " +
          removedResistances.map((r) => r.name).join(" || ") +
          " )";
        break;
      case ACTION.SERIES:
        removedResistances = resistances.slice(0, resistances.length - 1);
        resultingResistances = resistances.slice(resistances.length - 1);
        msg1 =
          removedResistances.map((r) => r.name).join(", ") + " are in series";
        msg2 =
          "result: " +
          resultingResistances[0].name +
          "( = " +
          removedResistances.map((r) => r.name).join(" + ") +
          " )";
        break;
      case ACTION.WYE_DELTA:
        removedResistances = resistances.slice(0, 3);
        resultingResistances = resistances.slice(3);

        tempWires = tempWires.slice(0, tempWires.length - wireAddedCount);
        msg1 =
          "wye-delta conversion with resistances: " +
          removedResistances.map((r) => r.name).join(", ");
        msg2 = " result: " + resultingResistances.map((r) => r.name).join(", ");
        break;

      case ACTION.EMPTY_CIRCUIT:
        removedResistances = [];
        resultingResistances = [];
        msg1 = msg2 = "Empty Circuit";
        break;
      case ACTION.FALLBACK:
        removedResistances = [];
        resultingResistances = [];
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
      removedResistances: structuredClone(removedResistances),
      resultingResistances: [],
      message: msg1,
    });
    // to highlight the resistors that are adding
    this.Steps.push({
      Circuit: structuredClone(resultantCircuit),
      Wires: structuredClone(this.wires),
      terminal1: this.terminal1,
      terminal2: this.terminal2,
      removedResistances: [],
      resultingResistances: structuredClone(resultingResistances),
      message: msg2,
    });

    this.previousCircuit = structuredClone(resultantCircuit);
  }

  public solve() {
    this.initializePointsProps();
    this.updateNodesAndResistances();
    this.updateTerminalNodes();
    this.previousCircuit = structuredClone(this.resistances);
    this.findEquivalentResistance();
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

    for (const r of this.resistances) {
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
  private updateNodesAndResistances() {
    this.generateNodes();
    this.updateNodesOfResistances();
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
      const [node1x, node1y] = node1.split("__").map((x) => parseInt(x));
      const [node2x, node2y] = node2.split("__").map((x) => parseInt(x));
      const mergedNodes = [
        ...this.nodes[node1x][node1y],
        ...this.nodes[node2x][node2y],
      ];
      const uniqueNodes = Array.from(new Set(mergedNodes));
      // if nodes[i][j] contains node1 or node2, replace it with uniqueNodes
      for (let i = 0; i < this.maxLengthOfResistancesArray; i++) {
        for (let j = 0; j < this.maxLengthOfResistancesArray; j++) {
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
  private initializeNodes() {
    for (let i = 0; i < this.maxLengthOfResistancesArray; i++) {
      for (let j = 0; j < this.maxLengthOfResistancesArray; j++) {
        this.nodes[i][j] = [`${i}__${j}`];
      }
    }
  }

  private updateNodesOfResistances() {
    for (let i = 0; i < this.resistances.length; i++) {
      const r = this.resistances[i];
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

  private getNewNameForResistance(): string {
    return "R" + this.resistanceCount++;
  }

  private filterOutInfiniteResistances(): boolean {
    let changed = false;
    for (let i = this.resistances.length - 1; i >= 0; --i) {
      if (this.resistances[i].value == Infinity) {
        this.updateCircuitPoints(
          this.resistances[i].node1,
          this.resistances[i].node2,
          "R"
        );

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
        this.updateCircuitPoints(node1, node2, "R");
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
      const { node1, node2 } = resistance;
      if (this.isEqualNodes(node1, node2)) {
        changed = true;
        this.updateCircuitPoints(node1, node2, "R");
        this.resistances.splice(i, 1);
        this.logSingleStep(
          ACTION.SHORT_CIRCUIT_REMOVAL,
          [resistance],
          this.resistances
        );
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
        !this.isEqualNodes(resistance.node1, this.terminal2)
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
            this.isEqualNodes(this.resistances[j].node1, node) ||
            this.isEqualNodes(this.resistances[j].node2, node)
          ) {
            found = true;
            break;
          }
        }
        if (!found) {
          changed = true;
          this.updateCircuitPoints(
            this.resistances[i].node1,
            this.resistances[i].node2,
            "R"
          );
          this.resistances.splice(i, 1);
          this.logSingleStep(
            ACTION.OPEN_CIRCUIT_REMOVAL,
            [resistance],
            this.resistances
          );
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

    for (let i = 1; i < parallels.length; ++i)
      logResistances.push(structuredClone(parallels[i]));

    logResistances.push(structuredClone(parallels[0]));

    for (let i = 1; i < parallels.length; i += 1) {
      parallels[i].value = Infinity;
    }

    // remove the parallel resistances
    this.filterOutInfiniteResistances();
    this.logSingleStep(ACTION.PARALLEL, logResistances, this.resistances);

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
    this.logSingleStep(ACTION.SERIES, logResistances, this.resistances);
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

  private checkTwoNodesContainsResistor(
    node1: string,
    node2: string,
    count = 1
  ) {
    // if the resistanceAll array contains this node1 and node2 " count" number of times
    return (
      this.resistances.filter(
        (r) =>
          (this.isEqualNodes(r.node1, node1) &&
            this.isEqualNodes(r.node2, node2)) ||
          (this.isEqualNodes(r.node1, node2) &&
            this.isEqualNodes(r.node2, node1))
      ).length >= count
    );
  }

  private getTempNode(a: number, b: number, count = 1) {
    /**
     *        * * * * * * *
     *        * * * * * * *
     *        * * * o * * *
     *        * * * * * * *
     *        * * * * * * *
     *    index of o is (a,b), traverse a rectangle
     *    whose points are "count" unit outer from (a,b)
     *    like for count = 2 searching will be :
     *
     *        * * * * * * *
     *        *           *
     *        * ' ' o ' ' *  //  ' ' 2 unit outer from (a,b)
     *        *           *
     *        * * * * * * *
     *
     */

    const startX = Math.max(a - count, 0);
    const startY = Math.max(b - count, 0);
    const limitX = Math.min(a + count, this.maxLengthOfResistancesArray - 1);
    const limitY = Math.min(b + count, this.maxLengthOfResistancesArray - 1);

    let i = startX,
      j = startY;
    while (true) {
      if (this.circuitPoints[i][j] == "") {
        return [i, j];
      }

      /**
       *   * > >
       *   * o *
       *   * * *
       */
      if (i == startX && j >= startY && j < limitY) {
        j++;
        continue;
      }
      /**
       *   * * *
       *   * o v
       *   * * v
       */ else if (i >= startX && i < limitX && j == limitY) {
        i++;
        continue;
      }
      /**
       *   * * *
       *   * o *
       *   < < *
       */ else if (i == limitX && j <= limitY && j > startY) {
        j--;
        continue;
      }
      /**
       *   ^ * *
       *   ^ o *
       *   * * *
       */ else if (i > startX && i <= limitX && j == startY) {
        i--;
        continue;
      }

      return [-1, -1];
    }
  }

  private findNewTempPointForNodes(a: string, b: string) {
    const aPoint = this.getPointFromNode(a);
    const bPoint = this.getPointFromNode(b);
    let x = -1,
      y = -1,
      count = 2;
    while (x == -1 && y == -1 && count < this.maxLengthOfResistancesArray - 1) {
      [x, y] = this.getTempNode(aPoint[0], aPoint[1], count);
      if (x == -1 && y == -1) {
        [x, y] = this.getTempNode(bPoint[0], bPoint[1], count);
      }
      count++;
    }
    return [x, y];
  }

  /**
   * check if there's already a resistor with the same nodes
   * if yes, find a new point -> node1 to tempNode wire, tempNode to node2 resistor.
   *
   * @param a node1
   * @param b node2
   * @returns 3 nodes array [node1, tempNode, node2] if found, else null
   *  if found, then node1->R->tempNode  ,  tempNode->wire->node2
   *
   */
  private checkAndGetNewNodeBetween(a: string, b: string) {
    let node1: string, node2: string;
    // now check if there's already a resistor with the same nodes
    // if yes, find a new point -> node1 to tempNode wire, tempNode to node2 resistor.
    // update nodes array with the new wire and resistor
    // else returns null means, not neccessary to add a new node or not found

    if (!this.checkTwoNodesContainsResistor(a, b)) return null;
    // find a new point

    let [x, y] = this.findNewTempPointForNodes(a, b);

    // if no available point found, (this will seldom occur)
    if (x == -1 && y == -1) return null;
    //[x,y] far from getPointFromNode(a) => add a->R->tempNode  ,  tempNode->wire->b
    // [x,y] far from getPointFromNode(b) => add a->wire->tempNode  ,  tempNode->R->b

    if (
      Math.sqrt(
        (x - this.getPointFromNode(a)[0]) ** 2 +
          (y - this.getPointFromNode(a)[1]) ** 2
      ) >
      Math.sqrt(
        (x - this.getPointFromNode(b)[0]) ** 2 +
          (y - this.getPointFromNode(b)[1]) ** 2
      )
    ) {
      // a = node1 is far from x
      node1 = a;
      node2 = b;
    } else {
      node1 = b;
      node2 = a;
    }
    this.circuitPoints[x][y] += "R";
    // now node1->R->tempNode  ,  tempNode->wire->node2
    return [node1, `${x}__${y}`, node2];
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

    let node1: string, node2: string, newNode: string;
    let r_bc: Resistance, r_ca: Resistance;
    let r_ab: Resistance = {
      name: this.getNewNameForResistance(),
      value: factor / r3.value,
      node1: a,
      node2: b,
    };

    r_bc = {
      name: this.getNewNameForResistance(),
      value: factor / r1.value,
      node1: b,
      node2: c,
    };
    r_ca = {
      name: this.getNewNameForResistance(),
      value: factor / r2.value,
      node1: c,
      node2: a,
    };

    let temp = this.checkAndGetNewNodeBetween(a, b);
    if (temp != null) {
      [node1, newNode, node2] = temp;

      r_ab = { ...r_ab, node1: node1, node2: newNode };

      this.wires.push({
        start: newNode,
        end: node2,
      });
      this.handlePointsCoveredByRorW(
        Number(newNode.split("__")[0]),
        Number(newNode.split("__")[1]),
        Number(node2.split("__")[0]),
        Number(node2.split("__")[1])
      );
    }
    temp = this.checkAndGetNewNodeBetween(c, b);
    if (temp != null) {
      [node1, newNode, node2] = temp;
      r_bc = { ...r_bc, node1: node1, node2: newNode };
      this.wires.push({
        start: newNode,
        end: node2,
      });
      this.handlePointsCoveredByRorW(
        Number(newNode.split("__")[0]),
        Number(newNode.split("__")[1]),
        Number(node2.split("__")[0]),
        Number(node2.split("__")[1])
      );
    }
    temp = this.checkAndGetNewNodeBetween(a, c);
    if (temp != null) {
      [node1, newNode, node2] = temp;
      r_ca = { ...r_ca, node1: node1, node2: newNode };

      this.wires.push({
        start: newNode,
        end: node2,
      });
      this.handlePointsCoveredByRorW(
        Number(newNode.split("__")[0]),
        Number(newNode.split("__")[1]),
        Number(node2.split("__")[0]),
        Number(node2.split("__")[1])
      );
    }
    return [{ ...r_ab }, { ...r_bc }, { ...r_ca }];
  }

  private solveWyes(): boolean {
    for (const r1 of this.resistances) {
      for (const r2 of this.resistances) {
        for (const r3 of this.resistances) {
          if (this.isWye(r1, r2, r3)) {
            // to remove the wires added in getDeltaFromWye
            const initialWireCount = this.wires.length;
            const [r_ab, r_bc, r_ca] = this.getDeltaFromWye(r1, r2, r3);
            const newWireAdded = this.wires.length - initialWireCount;
            this.resistances.push(r_ab);
            this.resistances.push(r_bc);
            this.resistances.push(r_ca);
            const i = this.resistances.indexOf(r1);
            this.updateCircuitPoints(
              this.resistances[i].node1,
              this.resistances[i].node2,
              "R"
            );
            this.resistances.splice(i, 1);

            const j = this.resistances.indexOf(r2);
            this.updateCircuitPoints(
              this.resistances[j].node1,
              this.resistances[j].node2,
              "R"
            );
            this.resistances.splice(j, 1);

            const k = this.resistances.indexOf(r3);
            this.updateCircuitPoints(
              this.resistances[k].node1,
              this.resistances[k].node2,
              "R"
            );
            this.resistances.splice(k, 1);

            this.updateNodesAndResistances();
            this.logSingleStep(
              ACTION.WYE_DELTA,
              [r1, r2, r3, r_ab, r_bc, r_ca],
              this.resistances,
              newWireAdded
            );
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
      if (this.resistances.length == 1) break;
      if (this.mergeParallelUnit()) continue;
      if (this.mergeSeriesUnit()) continue;
      if (this.solveWyes()) continue;
      // remove unnecessary wires
      this.removeUnnecessaryWires();

      break;
    }
    if (this.resistances.length == 0)
      this.logSingleStep(ACTION.EMPTY_CIRCUIT, [], this.resistances);
    else if (this.resistances.length > 1)
      this.logSingleStep(ACTION.FALLBACK, [], this.resistances);
  }
}
