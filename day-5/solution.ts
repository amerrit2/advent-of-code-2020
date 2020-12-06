import { assert } from "console";
import { readFile } from "fs/promises";
import { resolve } from "path";

async function getPassDatas() {
  return `${await readFile(resolve(__dirname, "./input.txt"))}`.split("\r\n");
}

function parsePassData(input: string) {
  let rows = [0, 128]; // first, length
  let columns = [0, 8];
  for (const char of input) {
    const newRowsLength = rows[1] / 2;
    const newColumnLength = columns[1] / 2;
    if (char === "B") {
      rows = [rows[0] + newRowsLength, newRowsLength];
    } else if (char === "F") {
      rows = [rows[0], newRowsLength];
    } else if (char === "R") {
      columns = [columns[0] + newColumnLength, newColumnLength];
    } else if (char === "L") {
      columns = [columns[0], newColumnLength];
    } else {
      throw new Error(`Unreognized character: ${char} from ${input}`);
    }
  }
  assert(rows[1] === 1, "Rows not narrowed...");
  assert(columns[1] === 1, "Columns not narrowed...");
  return [rows[0], columns[0]] as const;
}

function getSeatId(seat: readonly [number, number]) {
  return seat[0] * 8 + seat[1];
}

function isValidSeat(id: number) {
  for (let col = 0; col < 8; col++) {
    const row = (id - col) / 8;
    if (row > 0 && row < 127) {
      return true;
    }
  }
  return false;
}

async function main() {
  const passDatas = await getPassDatas();

  const seatIds = passDatas.map((pd) => getSeatId(parsePassData(pd)));

  //   console.log(seats.sort((a, b) => a - b).pop());

  for (const id of seatIds) {
    if (
      seatIds.includes(id + 2) &&
      !seatIds.includes(id + 1) &&
      isValidSeat(id + 1)
    ) {
      console.log("Answer: ", id + 1);
    }
  }
}

main().catch((e) => console.error(e));
