const fs = require("fs");

const input = fs.readFileSync("day20/input.txt").toString().split("\n\n");

function computePartOne() {
  const tiles = parseTiles(input);
  const tilesAtBorders = new Map();
  const tileBorders = new Map();
  Object.entries(tiles).forEach(([id, tile]) => {
    const top = tile.split("\n")[0];
    const topFlip = top.split("").slice().reverse().join("");
    const bottom = tile.split("\n").pop();
    const bottomFlip = bottom.split("").slice().reverse().join("");
    const left = tile
      .split("\n")
      .map((p) => p[0])
      .join("");
    const leftFlip = left.split("").slice().reverse().join("");
    const right = tile
      .split("\n")
      .map((p) => p.split("").pop())
      .join("");
    const rightFlip = right.split("").slice().reverse().join("");
    tileBorders.set(id, [
      top,
      topFlip,
      bottom,
      bottomFlip,
      left,
      leftFlip,
      right,
      rightFlip,
    ]);
    tileBorders.get(id).forEach((border) => {
      if (!tilesAtBorders.has(border)) {
        tilesAtBorders.set(border, []);
      }
      tilesAtBorders.set(border, [...tilesAtBorders.get(border), id]);
    });
  });
  let multiplied = 1;
  for (let [id, borders] of tileBorders) {
    const tileNeighbors = new Set();
    for (let border of borders) {
      tilesAtBorders.get(border).forEach((nId) => tileNeighbors.add(nId));
    }
    tileNeighbors.delete(id);
    if (tileNeighbors.size == 2) {
      multiplied *= id;
    }
  }
  return multiplied;
}

function computePartTwo() {
  const tiles = parseTiles(input);
  let borderIdxs = {};
  let borderPositions = {};
  const firstId = Object.keys(tiles)[0];
  getBorders(tiles[firstId]).forEach((border, i) => {
    borderIdxs[border] = i;
    borderPositions[border] = [0, 0];
  });
  let tilePositions = Object.fromEntries([[firstId, [0, 0]]]);
  let topLeft = [0, 0];
  let tilesLeft = new Set(Object.keys(tiles));
  tilesLeft.delete(firstId);
  while (tilesLeft.size > 0) {
    let placedId;
    let placedTile;
    let borders;
    let position;
    for (let id of tilesLeft.values()) {
      placedId = id;
      placedTile = tiles[id];
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = placedTile
        .split("\n")
        .map((row) => row.split("").reverse().join(""))
        .join("\n");
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
      placedTile = rotate(placedTile);
      borders = getBorders(placedTile);
      if ((position = getPlacement(borders, borderIdxs, borderPositions)))
        break;
    }
    tiles[placedId] = placedTile;
    tilePositions[placedId] = position;
    topLeft = [
      Math.min(topLeft[0], position[0]),
      Math.min(topLeft[1], position[1]),
    ];
    borders.forEach((border, i) => {
      borderIdxs[border] = i;
      borderPositions[border] = position;
    });
    tilesLeft.delete(placedId);
  }
  let mapSize = Math.sqrt(Object.keys(tiles).length) * 8;
  let pitch = mapSize + 1;
  let map = ("?".repeat(mapSize) + "\n").repeat(mapSize).split("");
  for (let [id, position] of Object.entries(tilePositions)) {
    let tile = tiles[id];
    let mapI =
      (position[0] - topLeft[0]) * 8 + (position[1] - topLeft[1]) * 8 * pitch;
    for (let i = 0; i < 64; i++) {
      map[mapI + (i % 8) + Math.floor(i / 8) * pitch] =
        tile[12 + (i % 8) + Math.floor(i / 8) * 11];
    }
  }
  map = map.join("");
  let monsterDef = new RegExp(
    "..................#.(.|\n){" +
      (pitch - 20) +
      "}#....##....##....###(.|\n){" +
      (pitch - 20) +
      "}.#..#..#..#..#..#...",
    "g"
  );
  let monster = map.search(monsterDef);
  for (let i = 0; i < 7 && monster == -1; i++) {
    if (i == 3) {
      map = map
        .split("\n")
        .map((row) => row.split("").reverse().join(""))
        .join("\n");
    } else {
      let flatMap = map.replace(/\n/g, "");
      map = "";
      for (let j = 0; j < mapSize * mapSize; j++) {
        map +=
          flatMap[
            mapSize -
              1 +
              ((j * mapSize) % (mapSize * mapSize)) -
              Math.floor(j / mapSize)
          ];
        if (j % mapSize == mapSize - 1) {
          map += "\n";
        }
      }
    }
    monster = map.search(monsterDef);
  }
  let monsters = 0;
  let start = monster + 1;
  while (monster != -1) {
    monsters++;
    if (monsters > 25) {
      break;
    }
    monster = map.slice(start).search(monsterDef);
    start += monster + 1;
  }
  let roughness = map.match(/#/g).length - monsters * 15;
  return roughness;
}

function parseTiles(input) {
  const tiles = Object.fromEntries(
    input
      .map((tile) => tile.split(":\n"))
      .map((tile) => [tile[0].split(" ")[1], tile[1]])
  );
  return tiles;
}

function getBorders(tile) {
  let top = tile.split("\n")[0];
  let bottom = tile.split("\n").pop();
  let left = tile
    .split("\n")
    .map((row) => row[0])
    .join("");
  let right = tile
    .split("\n")
    .map((row) => row.split("").pop())
    .join("");
  return [top, bottom, left, right];
}

function rotate(tile) {
  const flatTile = tile.replace(/\n/g, "");
  let rotated = "";
  for (let i = 0; i < 100; i++) {
    rotated += flatTile[9 + ((i * 10) % 100) - Math.floor(i / 10)];
    if (i % 10 == 9) {
      rotated += "\n";
    }
  }
  return rotated.trim();
}

function getPlacement(borders, borderIdxs, borderPositions) {
  for (let [i, border] of borders.entries()) {
    if (!borderIdxs.hasOwnProperty(border)) {
      continue;
    }
    let j = borderIdxs[border];
    if (
      (i == 0 && j == 1) ||
      (i == 1 && j == 0) ||
      (i == 2 && j == 3) ||
      (i == 3 && j == 2)
    ) {
      return [
        borderPositions[border][0] - (i == 3) + (i == 2),
        borderPositions[border][1] - (i == 1) + (i == 0),
      ];
    }
  }
  return false;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
