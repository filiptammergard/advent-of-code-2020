const fs = require("fs");

const input = fs
  .readFileSync("day24/input.txt")
  .toString()
  .split("\n")
  .filter((line) => line);

function computePartOne() {
  const blackTiles = getBlackTiles(input);
  return blackTiles.size;
}

function computePartTwo() {
  let blackTiles = getBlackTiles(input);
  for (let i = 1; i <= 100; i++) {
    const newBlackTiles = new Set();
    const keys = blackTiles.keys();
    for (const tile of keys) {
      const [x, y] = tile.split("#").map((x) => parseInt(x));
      const cellsAround = getNeighbours(x, y);
      cellsAround.push({ x, y });
      for (const cell of cellsAround) {
        const currentId = coordinatesToId(cell.x, cell.y);
        const neighbours = getNeighbours(cell.x, cell.y);
        const totalBlackTiles = neighbours.filter((n) =>
          blackTiles.has(coordinatesToId(n.x, n.y))
        ).length;
        if (blackTiles.has(currentId)) {
          if (totalBlackTiles === 0 || totalBlackTiles > 2) {
            newBlackTiles.delete(currentId);
          } else {
            newBlackTiles.add(currentId);
          }
        } else {
          if (totalBlackTiles === 2) {
            newBlackTiles.add(currentId);
          }
        }
      }
    }
    blackTiles = newBlackTiles;
  }
  return blackTiles.size;
}

function getBlackTiles(input) {
  const dirToDelta = getDitToDelta();
  const blackTiles = new Set();
  input.forEach((line) => {
    const directions = [...line.matchAll(/e|se|sw|w|nw|ne/g)].map((x) => x[0]);
    const { x, y } = directions.reduce(
      (acc, direction) => ({
        x: acc.x + dirToDelta[direction].dx,
        y: acc.y + dirToDelta[direction].dy,
      }),
      { x: 0, y: 0 }
    );
    const key = coordinatesToId(x, y);
    if (blackTiles.has(key)) {
      blackTiles.delete(key);
    } else {
      blackTiles.add(key);
    }
  });
  return blackTiles;
}

function getDitToDelta() {
  const dirToDelta = {
    nw: { dx: 0, dy: -1 },
    ne: { dx: 1, dy: -1 },
    w: { dx: -1, dy: 0 },
    e: { dx: 1, dy: 0 },
    sw: { dx: -1, dy: 1 },
    se: { dx: 0, dy: 1 },
  };
  return dirToDelta;
}

function coordinatesToId(x, y) {
  return x + "#" + y;
}

function getNeighbours(x, y) {
  const dirToDelta = {
    nw: { dx: 0, dy: -1 },
    ne: { dx: 1, dy: -1 },
    w: { dx: -1, dy: 0 },
    e: { dx: 1, dy: 0 },
    sw: { dx: -1, dy: 1 },
    se: { dx: 0, dy: 1 },
  };
  const result = [];
  for (const direction in dirToDelta) {
    result.push({
      x: x + dirToDelta[direction].dx,
      y: y + dirToDelta[direction].dy,
    });
  }
  return result;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
