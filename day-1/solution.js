"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const console_1 = require("console");
const promises_1 = require("fs/promises");
const path_1 = require("path");
function search(values) {
    let first = null;
    let second = null;
    let third = null;
    for (let i = 0; i < values.length; ++i) {
        first = values[i];
        if (first > 2020)
            continue;
        for (let j = i + 1; j < values.length; ++j) {
            second = values[j];
            if (first + second > 2020)
                continue;
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
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const input = yield promises_1.readFile(path_1.resolve(__dirname, "./input.txt"));
        const values = `${input}`.split("\r\n").map((val) => parseInt(val, 10));
        const [first, second, third] = search(values);
        console.log("Numbers: ", `${first}, ${second}, ${third}`);
        console_1.assert(values.includes(first));
        console_1.assert(values.includes(second));
        console_1.assert(values.includes(third));
        console.log("Answer: ", first * second * third);
    });
}
main().catch((e) => console.error(e));
//# sourceMappingURL=solution.js.map