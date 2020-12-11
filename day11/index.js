const fs = require("fs");

const input = fs.readFileSync("day11/input.txt").toString().split("\n");

function computePartOne() {
  const startLayout = parseInput(input);
  let oldLayout;
  let newLayout = getNewLayoutPart1(startLayout);
  while (JSON.stringify(oldLayout) !== JSON.stringify(newLayout)) {
    oldLayout = [...newLayout];
    newLayout = getNewLayoutPart1(oldLayout);
  }
  const occupiedSeats = countOccupiedSeats(newLayout);
  return occupiedSeats;
}

function computePartTwo() {
  const startLayout = parseInput(input);
  let oldLayout;
  let newLayout = getNewLayoutPart2(startLayout);
  while (JSON.stringify(oldLayout) !== JSON.stringify(newLayout)) {
    oldLayout = [...newLayout];
    newLayout = getNewLayoutPart2(oldLayout);
  }
  const occupiedSeats = countOccupiedSeats(newLayout);
  return occupiedSeats;
}

function parseInput(input) {
  return input.map((row) => row.split(""));
}

function getNewLayoutPart1(input) {
  const newLayout = input.map((row, layoutIndex, layoutArray) => {
    const newRow = row.map((position, rowIndex) => {
      const occupiedAdjacentSeats = countOccupiedAdjacentSeats(
        layoutIndex,
        rowIndex,
        layoutArray
      );
      if (position === "L" && occupiedAdjacentSeats === 0) return "#";
      else if (position === "#" && occupiedAdjacentSeats >= 4) return "L";
      else return position;
    });
    return newRow;
  });
  return newLayout;
}

function countOccupiedAdjacentSeats(layoutIndex, rowIndex, layoutArray) {
  let count = 0;
  if (
    layoutArray[layoutIndex - 1] &&
    layoutArray[layoutIndex - 1][rowIndex - 1] === "#"
  )
    count++;
  if (
    layoutArray[layoutIndex - 1] &&
    layoutArray[layoutIndex - 1][rowIndex] === "#"
  )
    count++;
  if (
    layoutArray[layoutIndex - 1] &&
    layoutArray[layoutIndex - 1][rowIndex + 1] === "#"
  )
    count++;
  if (layoutArray[layoutIndex][rowIndex - 1] === "#") count++;
  if (layoutArray[layoutIndex][rowIndex + 1] === "#") count++;
  if (
    layoutArray[layoutIndex + 1] &&
    layoutArray[layoutIndex + 1][rowIndex - 1] === "#"
  )
    count++;
  if (
    layoutArray[layoutIndex + 1] &&
    layoutArray[layoutIndex + 1][rowIndex] === "#"
  )
    count++;
  if (
    layoutArray[layoutIndex + 1] &&
    layoutArray[layoutIndex + 1][rowIndex + 1] === "#"
  )
    count++;
  return count;
}

function countOccupiedSeats(layout) {
  const occupiedSeats = layout.reduce((acc, row) => {
    return acc + row.filter((position) => position === "#").length;
  }, 0);
  return occupiedSeats;
}

function getNewLayoutPart2(input) {
  const newLayout = input.map((row, layoutIndex, layoutArray) => {
    const newRow = row.map((position, rowIndex) => {
      const occupiedAdjacentSeats = countOccupiedVisibleSeats(
        layoutIndex,
        rowIndex,
        layoutArray
      );
      if (position === "L" && occupiedAdjacentSeats === 0) return "#";
      else if (position === "#" && occupiedAdjacentSeats >= 5) return "L";
      else return position;
    });
    return newRow;
  });
  return newLayout;
}

function countOccupiedVisibleSeats(layoutIndex, rowIndex, layoutArray) {
  let count = 0;
  for (let i = layoutIndex - 1, j = rowIndex - 1; i >= 0, j >= 0; i--, j--) {
    if (!layoutArray[i] || !layoutArray[i][j]) break;
    if (layoutArray[i][j] === "#") {
      count++;
      break;
    } else if (layoutArray[i][j] === "L") {
      break;
    }
  }
  for (let i = layoutIndex - 1; i >= 0; i--) {
    if (!layoutArray[i]) break;
    if (layoutArray[i][rowIndex] === "#") {
      count++;
      break;
    } else if (layoutArray[i][rowIndex] === "L") {
      break;
    }
  }
  for (
    let i = layoutIndex - 1, j = rowIndex + 1;
    i >= 0, j < layoutArray[0].length;
    i--, j++
  ) {
    if (!layoutArray[i] || !layoutArray[i][j]) break;
    if (layoutArray[i][j] === "#") {
      count++;
      break;
    } else if (layoutArray[i][j] === "L") {
      break;
    }
  }
  for (let j = rowIndex - 1; j >= 0; j--) {
    if (!layoutArray[layoutIndex][j]) break;
    if (layoutArray[layoutIndex][j] === "#") {
      count++;
      break;
    } else if (layoutArray[layoutIndex][j] === "L") {
      break;
    }
  }
  for (let j = rowIndex + 1; j < layoutArray[0].length; j++) {
    if (!layoutArray[layoutIndex][j]) break;
    if (layoutArray[layoutIndex][j] === "#") {
      count++;
      break;
    } else if (layoutArray[layoutIndex][j] === "L") {
      break;
    }
  }
  for (
    let i = layoutIndex + 1, j = rowIndex - 1;
    i < layoutArray.length, j >= 0;
    i++, j--
  ) {
    if (!layoutArray[i] || !layoutArray[i][j]) break;
    if (layoutArray[i][j] === "#") {
      count++;
      break;
    } else if (layoutArray[i][j] === "L") {
      break;
    }
  }
  for (let i = layoutIndex + 1; i < layoutArray.length; i++) {
    if (!layoutArray[i]) break;
    if (layoutArray[i][rowIndex] === "#") {
      count++;
      break;
    } else if (layoutArray[i][rowIndex] === "L") {
      break;
    }
  }
  for (
    let i = layoutIndex + 1, j = rowIndex + 1;
    i < layoutArray.length, j < layoutArray[0].length;
    i++, j++
  ) {
    if (!layoutArray[i] || !layoutArray[i][j]) break;
    if (layoutArray[i][j] === "#") {
      count++;
      break;
    } else if (layoutArray[i][j] === "L") {
      break;
    }
  }
  return count;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
