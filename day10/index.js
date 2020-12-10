const fs = require("fs");

const input = fs.readFileSync("day10/input.txt").toString().split("\n");

function computePartOne() {
  const jolts = parseInput(input);
  const answer = jolts
    .reduce(
      (acc, curr, index, array) => {
        if (index === 0) return acc;
        if (curr === array[index - 1] + 1) {
          const amountOf1s = acc[0] + 1;
          return [amountOf1s, acc[1]];
        } else if (curr === array[index - 1] + 3) {
          const amountOf3s = acc[1] + 1;
          return [acc[0], amountOf3s];
        } else {
          return acc;
        }
      },
      [0, 0]
    )
    .map((value) => value + 1)
    .reduce((product, curr) => product * curr, 1);
  return answer;
}

function computePartTwo() {
  const jolts = parseInput(input);
  const groups = jolts.reduce(
    (acc, curr, index, array) => {
      if (curr === array[index - 1] + 1 || index === 0) {
        const last = acc[acc.length - 1];
        const addCurr = [...last, curr];
        const updated = [...acc.slice(0, acc.length - 1), addCurr];
        return updated;
      } else if (curr === array[index - 1] + 3) {
        return [...acc, [curr]];
      }
    },
    [[0]]
  );
  const combinations = groups.reduce((sum, curr) => {
    return sum * getTribonacci(curr.length);
  }, 1);
  return combinations;
}

function parseInput(input) {
  return input.map((row) => parseInt(row)).sort((a, b) => a - b);
}

function getTribonacci(n) {
  const signature = [0, 0, 1];
  const sequence = Array.from({ length: n - 1 }).reduce((acc) => {
    const next =
      acc[acc.length - 1] + acc[acc.length - 2] + acc[acc.length - 3];
    return [...acc, next];
  }, signature);
  return sequence[n + 1];
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
