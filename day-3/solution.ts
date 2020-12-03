import { readFile } from "fs/promises";
import { resolve } from "path";

async function getInput() {
  const raw = `${await readFile(resolve(__dirname, "./input.txt"))}`;
  return raw.split("\r\n");
}

class TreeGrid {
  constructor(private _rows: string[]) {}
  hasTree(x: number, y: number) {
    if (!Number.isInteger(x) || !Number.isInteger(y)) {
      return false;
    }

    if (y >= this._rows.length) {
      throw new Error("Y coordinate past the bottom!");
    }

    const row = this._rows[y];
    return row[x % row.length] === "#";
  }

  isOut(y: number) {
    return y >= this._rows.length;
  }
}

function countTreesForSlope(grid: TreeGrid, slope: { x: number; y: number }) {
  const pos = { x: 0, y: 0 };
  let treeCount = 0;
  while (!grid.isOut(pos.y)) {
    if (grid.hasTree(pos.x, pos.y)) {
      treeCount++;
    }

    pos.x = pos.x + slope.x;
    pos.y = pos.y + slope.y;
  }

  return treeCount;
}

async function main() {
  const grid = new TreeGrid(await getInput());

  const slopes = [
    { x: 1, y: 1 },
    { x: 3, y: 1 },
    { x: 5, y: 1 },
    { x: 7, y: 1 },
    { x: 1, y: 2 },
  ];

  const counts = slopes.map((sl) => countTreesForSlope(grid, sl));

  console.log(
    "Answer: ",
    counts.reduce((out, count) => count * out, 1)
  );
}

main().catch((e) => console.error(e));
