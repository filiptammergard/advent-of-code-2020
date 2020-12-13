const fs = require("fs");

const input = fs.readFileSync("day13/input.txt").toString().split("\n");

function computePartOne() {
  const [now, buses] = [
    input[0],
    input[1]
      .split(",")
      .filter((bus) => bus !== "x")
      .map((bus) => parseInt(bus)),
  ];
  let timestamp = now;
  let earliestDeparture = false;
  while (!earliestDeparture) {
    timestamp++;
    earliestDeparture = buses.find((bus) => timestamp % bus === 0);
  }
  return (timestamp - now) * earliestDeparture;
}

function computePartTwo() {
  const [firstBus, ...buses] = input[1]
    .split(",")
    .map((item, index) => [parseInt(item), index])
    .filter(([item]) => Number.isInteger(item));
  let multiplier = firstBus[0];
  let timestamp = 0;
  buses.forEach(([bus, busIndex]) => {
    while (true) {
      if ((timestamp + busIndex) % bus === 0) {
        multiplier *= bus;
        break;
      }
      timestamp += multiplier;
    }
  });
  return timestamp;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
