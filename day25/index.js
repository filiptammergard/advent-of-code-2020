const fs = require("fs");

const input = fs.readFileSync("day25/input.txt").toString().split("\n");

function computePartOne() {
  let [cardKey, doorKey] = input;
  let loop = getLoop(doorKey);
  let encryptionKey = getEncryptionKey(cardKey, loop);
  return encryptionKey;
}

function getLoop(doorKey) {
  let key = 1;
  let loop = 0;
  while (key != doorKey) {
    key *= 7;
    key %= 20201227;
    loop++;
  }
  return loop;
}

function getEncryptionKey(cardKey, loop) {
  let key = 1;
  for (let i = 0; i < loop; i++) {
    key *= cardKey;
    key %= 20201227;
  }
  return key;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);
