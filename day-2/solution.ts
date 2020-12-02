import { readFile } from "fs/promises";
import { resolve } from "path";

type ResolveType<
  P extends Promise<any> | ((...args: any[]) => Promise<any>)
> = P extends Promise<infer T>
  ? T
  : P extends (...args: any[]) => Promise<infer T>
  ? T
  : never;

type ArrayType<A extends any[]> = A extends (infer T)[] ? T : never;

function toNumber(input: string) {
  const result = parseInt(input, 10);
  if (result === NaN) throw new Error(`Failed to parse ${input}`);
  return result;
}

const PolicyExtractor = /(\d+)-(\d+) (\w): (\w+)/;
async function getInput() {
  const rawData = await readFile(resolve(__dirname, "./input.txt"));
  const passwordDatas = `${rawData}`.split("\r\n");
  return passwordDatas.map((pd) => {
    const matches = PolicyExtractor.exec(pd);
    if (matches === null || matches.length !== 5)
      throw new Error("Failed to parse password data");
    return {
      policy: {
        min: toNumber(matches[1]),
        max: toNumber(matches[2]),
        letter: matches[3],
      },
      password: matches[4],
    };
  });
}

type PasswordData = ArrayType<ResolveType<typeof getInput>>;
function partOneisValidPassword(passwordData: PasswordData) {
  const {
    password,
    policy: { letter, min, max },
  } = passwordData;

  const count = Array.from(password).reduce((out, char) => {
    if (char === letter) return out + 1;
    return out;
  }, 0);

  return count >= min && count <= max;
}

function partTwoIsValidPassord(passwordData: PasswordData) {
  const {
    password,
    policy: { letter, min: firstPos, max: secondPos },
  } = passwordData;

  const firstPosMatch = password[firstPos - 1] === letter;
  const secondPosMatch = password[secondPos - 1] === letter;
  return (
    (firstPosMatch || secondPosMatch) && !(firstPosMatch && secondPosMatch)
  );
}

function countValidPasswords(
  datas: PasswordData[],
  predicate: (data: PasswordData) => boolean
) {
  return datas.reduce((count, passwordData) => {
    if (predicate(passwordData)) return count + 1;
    return count;
  }, 0);
}

async function main() {
  const datas = await getInput();
  const partOneValidCount = countValidPasswords(datas, partOneisValidPassword);
  const partTwoValidCount = countValidPasswords(datas, partTwoIsValidPassord);

  console.log("Part one valid passswords: ", partOneValidCount);
  console.log("Part two valid passswords: ", partTwoValidCount);
}
main().catch((e) => console.error(e));
