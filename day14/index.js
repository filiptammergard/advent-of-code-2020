const fs = require("fs");

const input = fs.readFileSync("day14/input.txt").toString().split("\n");

function computePartOne() {
  const memory = new Map();
  let mask = "";
  input.forEach((row) => {
    const [instruction, value] = row.split(" = ");
    if (instruction === "mask") {
      mask = value;
    } else {
      const [, memoryAddress] = /mem\[(\w+)\]/.exec(instruction);
      const binary = decimalToBinary(value);
      const fullBinary = binary.padStart(36, 0);
      const maskedBinary = addMask(fullBinary, mask);
      memory.set(memoryAddress, maskedBinary);
    }
  });
  const sum = [...memory.values()].reduce(
    (acc, curr) => acc + parseInt(curr, 2),
    0
  );
  return sum;
}

function computePartTwo() {
  const memory = new Map();
  let mask = [{}];
  input.forEach((row) => {
    const [instruction, value] = row.split(" = ");
    if (instruction === "mask") {
      mask = parseMask(value);
    } else {
      const [, memoryAddress] = /mem\[(\w+)\]/.exec(instruction);
      const memoryAddresses = getMemoryAddresses(mask, memoryAddress);
      memoryAddresses.forEach((memoryAddress) => {
        memory.set(memoryAddress, parseInt(value));
      });
    }
  });

  const sum = [...memory.values()].reduce((acc, curr) => acc + curr, 0);
  return sum;
}

function decimalToBinary(decimal) {
  const binary = (decimal >>> 0).toString(2);
  return binary;
}

function addMask(value, mask) {
  let masked = value;
  for (let i = 0; i < value.length; i++) {
    if (mask[i] !== "X") {
      masked = masked.substr(0, i) + mask[i] + masked.substr(i + 1);
    }
  }
  return masked;
}

function getMemoryAddresses(mask, memory) {
  let modBinStr = (memory >>> 0).toString(2);
  modBinStr = modBinStr.padStart(36, "0").split("");

  for (let m of mask) {
    const { i, b } = m;
    if (b == "0") {
      continue;
    }
    modBinStr[i] = b.toString();
  }

  let memoryLocs = [];
  const wildBits = mask.filter((a) => a.b == "X");

  for (let i = 0; i < Math.pow(2, wildBits.length); i++) {
    let ittrMem = [...modBinStr];

    const binI = (i >>> 0).toString(2).padStart(wildBits.length, "0").split("");

    for (let j = 0; j < binI.length; j++) {
      const { i: idx } = wildBits[j];
      ittrMem[idx] = binI[j].toString();
    }

    memoryLocs.push(parseInt(ittrMem.join(""), 2));
  }

  return memoryLocs;
}

function parseMask(mask) {
  return mask.split("").map((b, i) => {
    return { i, b };
  });
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
