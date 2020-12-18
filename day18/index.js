const fs = require("fs");

const input = fs.readFileSync("day18/input.txt").toString().split("\n");

function computePartOne() {
  const answer = input.reduce((acc, line) => {
    let match;
    while ((match = /\([^()]+\)/.exec(line))) {
      const partValue = calculate1(match[0].substr(1, match[0].length - 2));
      line =
        line.substr(0, match.index) +
        partValue +
        line.substr(match.index + match[0].length);
    }
    return acc + calculate1(line);
  }, 0);
  return answer;
}

function computePartTwo() {
  const answer = input.reduce((acc, line) => {
    let match;
    while ((match = /\([^()]+\)/.exec(line))) {
      const partValue = calculate2(match[0].substr(1, match[0].length - 2));
      line =
        line.substr(0, match.index) +
        partValue +
        line.substr(match.index + match[0].length);
    }
    return acc + calculate2(line);
  }, 0);
  return answer;
}

function calculate1(line) {
  const parts = line.split(" ");
  let result = +parts[0];
  for (let i = 1; i < parts.length; i += 2) {
    if (parts[i] === "+") result += +parts[i + 1];
    else if (parts[i] === "*") result *= +parts[i + 1];
  }
  return result;
}

function calculate2(line) {
  let match;
  while ((match = /\d+\s\+\s\d+/.exec(line))) {
    const partValue = calculate1(match[0].substr(0, match[0].length));
    line =
      line.substr(0, match.index) +
      partValue +
      line.substr(match.index + match[0].length);
  }
  return calculate1(line);
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
