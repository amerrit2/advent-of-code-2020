import { readFile } from "fs/promises";
import { resolve } from "path";

async function getInput() {
  const input = `${await readFile(resolve(__dirname, "./input.txt"))}`;
  return `${input}`.split("\r\n\r\n").map((group) => group.split("\r\n"));
}

function countUnique(group: string[]) {
  return new Set([
    ...group.reduce((out, member) => (out = `${out}${member}`), ""),
  ]).size;
}

function countIntersection(group: string[]) {
  return Array.from(group[0]).reduce(
    (count, char) =>
      group.slice(1).every((member) => member.includes(char))
        ? count + 1
        : count,
    0
  );
}

async function PartTwoOneLine() {
  `${await readFile(resolve(__dirname, "./input.txt"))}`
    .split("\r\n\r\n")
    .map((group) => group.split("\r\n"))
    .reduce(
      (sum, group) =>
        (sum += Array.from(group[0]).reduce(
          (count, char) =>
            group.slice(1).every((member) => member.includes(char))
              ? count + 1
              : count,
          0
        )),
      0
    );
}

async function main() {
  const data = await getInput();
  console.log(
    "Part 1: ",
    data.reduce((sum, group) => (sum += countUnique(group)), 0)
  );

  console.log(
    "part 2: ",
    data.reduce((sum, group) => (sum += countIntersection(group)), 0)
  );
}

main();
