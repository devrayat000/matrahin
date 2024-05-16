import { Wire } from "./store";
export interface Resistance {
  name: string;
  value: number;
  node1: string;
  node2: string;
}

export class Solver {
  private resistance: Resistance[];
  private wires: Wire[];
  private terminal1: string;
  private terminal2: string;

  private nodes: string[][][];

  constructor(
    resistance: Resistance[],
    wires: Wire[],
    terminal1: string,
    terminal2: string
  ) {
    this.resistance = resistance;
    this.wires = wires;
    this.terminal1 = terminal1;
    this.terminal2 = terminal2;
  }

  public solve() {
    this.generateNodes();
    this.updateNodesOfResistances();
  }

  private generateNodes() {
    for (let i = 0; i < 30; i++) {
      for (let j = 0; j < 30; j++) {
        this.nodes[i][j] = [`${i}__${j}`];
      }
    }

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
    // for each resistance,
    // replace resistance[i].node1 with resistance[i].node1's node

    this.resistance.forEach((r) => {
      const [node1x, node1y] = r.node1.split("__").map((x) => parseInt(x));
      const [node2x, node2y] = r.node2.split("__").map((x) => parseInt(x));
      r.node1 = r.node1 + "h" + this.nodes[node1x][node1y].join("w");
      r.node2 = r.node2 + "h" + this.nodes[node2x][node2y].join("w");
    });
  }
}
