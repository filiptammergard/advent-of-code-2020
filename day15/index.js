const fs = require("fs");

const input = fs.readFileSync("day15/input.txt").toString().split(",");

function computePartOne() {
  return play(input, 2020);
}

function computePartTwo() {
  return play(input, 30000000);
}

function play(input, turns) {
  const numbers = input.map((number) => parseInt(number));
  let [lastNumber] = numbers.slice(-1);
  const lastSpokenIndexes = new Map();
  numbers.forEach((number, index) => lastSpokenIndexes.set(number, index + 1));
  for (let i = input.length; i < turns; i++) {
    const next = lastSpokenIndexes.get(lastNumber)
      ? i - lastSpokenIndexes.get(lastNumber)
      : 0;
    lastSpokenIndexes.set(lastNumber, i);
    lastNumber = next;
  }
  return lastNumber;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
