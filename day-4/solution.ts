import { readFile, writeFile } from "fs/promises";
import assert from "assert";
import { resolve } from "path";
import { UV_FS_O_FILEMAP } from "constants";
import { count } from "../shared/arrays";

enum Fields {
  byr = "byr",
  iyr = "iyr",
  eyr = "eyr",
  hgt = "hgt",
  hcl = "hcl",
  ecl = "ecl",
  pid = "pid",
  cid = "cid",
}

type Passport = {
  [K in Fields]?: string;
};

const matcher = /([^\s]*:[^\s]*)[\s\n\r]*/g;
function parseInput(input: string[]): Passport[] {
  return input.map((rawData) => {
    const passport: Passport = {};
    matcher.lastIndex = 0;
    let match;
    while ((match = matcher.exec(rawData)) !== null) {
      const field = match[1];
      const [key, value] = field.split(":");
      assert(Object.values(Fields).includes(key as any), `key = ${key}`);
      passport[key as Fields] = value;
    }

    return passport;
  });
}

async function loadPassports(path: string) {
  const input = await readFile(resolve(__dirname, path));

  return parseInput(`${input}`.split("\r\n\r"));
}

function makeYearValidator(min: number, max: number) {
  return (val?: string) => {
    if (!val) return false;
    const num = parseInt(val, 10);
    return /^\d{4}(?:\s|$)/.test(val) && num >= min && num <= max;
  };
}
const validators: { [K in Fields]: (val?: string) => boolean } = {
  [Fields.byr]: makeYearValidator(1920, 2002),
  [Fields.iyr]: makeYearValidator(2010, 2020),
  [Fields.eyr]: makeYearValidator(2020, 2030),
  [Fields.hgt]: (val?: string) => {
    if (!val) return false;
    const match = /^(\d+)(cm|in)(?:\s|$)/.exec(val);
    if (!match) return false;
    const numVal = parseInt(match[1]);
    switch (match[2]) {
      case "cm":
        return numVal >= 150 && numVal <= 193;
      case "in":
        return numVal >= 59 && numVal <= 76;
      default:
        throw new Error("Should not hit this");
    }
  },
  [Fields.hcl]: (val?: string) => /^#[0-9a-f]{6}(?:\s|$)/.test(`${val}`),
  [Fields.ecl]: (val?: string) =>
    /^(?:amb|blu|brn|gry|grn|hzl|oth)(?:\s|$)/.test(`${val}`),
  [Fields.pid]: (val?: string) => /^[0-9]{9}(?:\s|$)/.test(`${val}`),
  [Fields.cid]: () => true,
};

function validatePassportPartOne(passport: Passport) {
  for (const field of Object.values(Fields)) {
    if (passport[field] === undefined && field !== Fields.cid) {
      return false;
    }
  }
  return true;
}

function validatePassportPartTwo(passport: Passport) {
  return Object.values(Fields).every((field) => {
    const result = validators[field](passport[field]);
    return result;
  });
}

async function writePassports(passports: Passport[]) {
  await writeFile(
    resolve(__dirname, "./passports.json"),
    JSON.stringify(
      passports.filter((pp) => validatePassportPartTwo(pp)),
      null,
      2
    )
  );
}

async function main() {
  const passports: Passport[] = await loadPassports("./input.txt");
  console.log(`Valid count = ${count(passports, validatePassportPartOne)}`);

  console.log(
    `Valid count part two =  ${count(passports, validatePassportPartTwo)}`
  );

  await writePassports(passports);

  // Testing
  const invalidPassports = await loadPassports("./invalid_inputs.txt");
  console.log(`0 === ${count(invalidPassports, validatePassportPartTwo)}`);

  const validPassports = await loadPassports("./valid_inputs.txt");
  console.log(
    `${validPassports.length} === ${count(
      validPassports,
      validatePassportPartTwo
    )}`
  );
}

main().catch((e) => console.error(e));
