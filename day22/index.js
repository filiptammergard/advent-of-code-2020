const fs = require("fs");

const input = fs.readFileSync("day22/input.txt").toString().split("\n\n");

function computePartOne() {
  let [p1, p2] = parseInput(input);
  while (p1.length && p2.length) {
    let p1_top = p1.shift();
    let p2_top = p2.shift();
    p1_top > p2_top ? p1.push(p1_top, p2_top) : p2.push(p2_top, p1_top);
  }
  const winnerCards = p1.length ? p1.reverse() : p2.reverse();
  const score = calculateScore(winnerCards);
  return score;
}

function computePartTwo() {
  let [p1, p2] = parseInput(input);
  const score = recursivePlay(p1, p2);
  return score;
}

function parseInput(input) {
  let p1 = input[0]
    .split("\n")
    .slice(1)
    .map((card) => parseInt(card, 10));
  let p2 = input[1]
    .split("\n")
    .slice(1)
    .map((card) => parseInt(card, 10));
  return [p1, p2];
}

function calculateScore(cards) {
  const score = cards.reduce((acc, curr, index) => acc + curr * (index + 1), 0);
  return score;
}

const PLAYER_1 = 1;
const PLAYER_2 = 2;
function recursivePlay(p1, p2, depth = 0) {
  let played = {};
  while (p1.length && p2.length) {
    let check = p1.join("") + "+" + p2.join("");
    if (played[check] === true) {
      return PLAYER_1;
    }
    played[check] = true;
    let p1_top = p1.shift();
    let p2_top = p2.shift();
    if (p1_top <= p1.length && p2_top <= p2.length) {
      let winner = recursivePlay(
        p1.slice(0, p1_top),
        p2.slice(0, p2_top),
        depth + 1
      );
      if (winner === PLAYER_1) {
        p1.push(p1_top, p2_top);
      } else if (PLAYER_2) {
        p2.push(p2_top, p1_top);
      }
    } else if (p1_top > p2_top) {
      p1.push(p1_top, p2_top);
    } else if (p1_top < p2_top) {
      p2.push(p2_top, p1_top);
    }
  }
  if (depth === 0) {
    const winnerCards = p1.length ? p1.reverse() : p2.reverse();
    const score = calculateScore(winnerCards);
    return score;
  } else {
    return p1.length ? PLAYER_1 : PLAYER_2;
  }
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
