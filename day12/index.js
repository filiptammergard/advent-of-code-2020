const fs = require("fs");

const input = fs.readFileSync("day12/input.txt").toString().split("\n");

function computePartOne() {
  const instructions = parseInstructions(input);
  const startingPosition = { east: 0, north: 0, direction: "E" };
  const endingPosition = instructions.reduce((acc, instruction) => {
    if (instruction.action === "N")
      return { ...acc, north: acc.north + instruction.value };
    if (instruction.action === "S")
      return { ...acc, north: acc.north - instruction.value };
    if (instruction.action === "E")
      return { ...acc, east: acc.east + instruction.value };
    if (instruction.action === "W")
      return { ...acc, east: acc.east - instruction.value };
    if (instruction.action === "L" || instruction.action === "R") {
      const direction = getDirection(acc.direction, instruction);
      return { ...acc, direction };
    }
    if (instruction.action === "F") {
      if (acc.direction === "N")
        return { ...acc, north: acc.north + instruction.value };
      if (acc.direction === "S")
        return { ...acc, north: acc.north - instruction.value };
      if (acc.direction === "E")
        return { ...acc, east: acc.east + instruction.value };
      if (acc.direction === "W")
        return { ...acc, east: acc.east - instruction.value };
    }
  }, startingPosition);
  const manhattanDistance =
    Math.abs(endingPosition.east) + Math.abs(endingPosition.north);
  return manhattanDistance;
}

function computePartTwo() {
  const instructions = parseInstructions(input);
  const startingPosition = {
    east: 0,
    north: 0,
    waypoint: { east: 10, north: 1 },
  };
  const endingPosition = instructions.reduce((acc, instruction) => {
    if (instruction.action === "N")
      return {
        ...acc,
        waypoint: {
          ...acc.waypoint,
          north: acc.waypoint.north + instruction.value,
        },
      };
    if (instruction.action === "S")
      return {
        ...acc,
        waypoint: {
          ...acc.waypoint,
          north: acc.waypoint.north - instruction.value,
        },
      };
    if (instruction.action === "E")
      return {
        ...acc,
        waypoint: {
          ...acc.waypoint,
          east: acc.waypoint.east + instruction.value,
        },
      };
    if (instruction.action === "W")
      return {
        ...acc,
        waypoint: {
          ...acc.waypoint,
          east: acc.waypoint.east - instruction.value,
        },
      };
    if (instruction.action === "L" || instruction.action === "R") {
      const waypoint = rotateWaypoint(acc.waypoint, instruction);
      return { ...acc, waypoint };
    }
    if (instruction.action === "F") {
      return {
        ...acc,
        east: acc.east + acc.waypoint.east * instruction.value,
        north: acc.north + acc.waypoint.north * instruction.value,
      };
    }
  }, startingPosition);
  const manhattanDistance =
    Math.abs(endingPosition.east) + Math.abs(endingPosition.north);
  return manhattanDistance;
}

function parseInstructions(input) {
  const instructions = input.map((row) => {
    return {
      action: row.slice(0, 1),
      value: parseInt(row.slice(1)),
    };
  });
  return instructions;
}

function getDirection(currentDirection, instruction) {
  const currentDegrees = directionToDegrees(currentDirection);
  let degrees =
    instruction.action === "L"
      ? currentDegrees - instruction.value
      : currentDegrees + instruction.value;
  const normalizedDegrees = normalizeDegrees(degrees);
  const direction = degreesToDirection(normalizedDegrees);
  return direction;
}

function normalizeDegrees(degrees) {
  if (degrees < 0) {
    while (degrees < 0) {
      degrees += 360;
    }
  } else {
    while (degrees > 270) {
      degrees -= 360;
    }
  }
  return degrees;
}

function directionToDegrees(direction) {
  if (direction === "N") return 0;
  else if (direction === "S") return 180;
  else if (direction === "E") return 90;
  else if (direction === "W") return 270;
}

function degreesToDirection(degrees) {
  if (degrees === 0) return "N";
  else if (degrees === 180) return "S";
  else if (degrees === 90) return "E";
  else if (degrees === 270) return "W";
}

function rotateWaypoint(currentWaypoint, instruction) {
  const rotation = normalizeDegrees(instruction.value);
  if (instruction.action === "L") {
    if (rotation === 90)
      return { east: -currentWaypoint.north, north: currentWaypoint.east };
    else if (rotation === 180)
      return { east: -currentWaypoint.east, north: -currentWaypoint.north };
    else if (rotation === 270)
      return { east: currentWaypoint.north, north: -currentWaypoint.east };
  } else if (instruction.action === "R") {
    if (rotation === 90)
      return { east: currentWaypoint.north, north: -currentWaypoint.east };
    else if (rotation === 180)
      return { east: -currentWaypoint.east, north: -currentWaypoint.north };
    else if (rotation === 270)
      return { east: -currentWaypoint.north, north: currentWaypoint.east };
  }
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
