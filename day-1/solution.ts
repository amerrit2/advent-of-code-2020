import { assert } from "console";
import { readFile } from "fs/promises";
import { resolve } from "path";

function search(values: number[]) {
  let first: number | null = null;
  let second: number | null = null;
  let third: number | null = null;
  for (let i = 0; i < values.length; ++i) {
    first = values[i];
    if (first > 2020) continue;
    for (let j = i + 1; j < values.length; ++j) {
      second = values[j];
      if (first + second > 2020) continue;
      for (let k = j + 1; k < values.length; ++k) {
        third = values[k];
        if (first + second + third === 2020) {
          return [first, second, third];
        }
      }
    }
  }

  throw new Error("Failed :(");
}

async function main() {
  const input = await readFile(resolve(__dirname, "./input.txt"));
  const values = `${input}`.split("\r\n").map((val) => parseInt(val, 10));

  const [first, second, third] = search(values);
  console.log("Numbers: ", `${first}, ${second}, ${third}`);
  assert(values.includes(first));
  assert(values.includes(second));
  assert(values.includes(third));
  console.log("Answer: ", first * second * third);
}

main().catch((e) => console.error(e));
