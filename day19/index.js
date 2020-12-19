const fs = require("fs");

const input = fs.readFileSync("day19/input.txt").toString().split("\n\n");

function computePartOne() {
  const [ruleInput, messages] = input;
  const rules = Object.fromEntries(
    ruleInput.split("\n").map((rule) => rule.split(": "))
  );
  let rule = new RegExp(`^${expandRule(rules[0], rules)}$`, "gm");
  let matches = messages.match(rule).length;
  return matches;
}

function computePartTwo() {
  const [ruleInput, messages] = input;
  replacedRules = ruleInput
    .replace("8: 42", "8: 42 | 42 8")
    .replace("11: 42 31", "11: 42 31 | 42 11 31");
  const rules = Object.fromEntries(
    replacedRules.split("\n").map((rule) => rule.split(": "))
  );
  let rule = new RegExp(`^${expand2(0, rules[0], 0, 0, rules)}$`, "gm");
  let matches = messages.match(rule).length;
  return matches;
}

function expandRule(rule, rules) {
  if (rule[0] == '"') {
    return rule[1];
  }
  const expanded = rule
    .split(" ")
    .reduce(
      (acc, curr) =>
        acc + (curr === "|" ? "|" : expandRule(rules[curr], rules)),
      ""
    );
  return `(${expanded})`;
}

function expand2(i, rule, n8, n11, rules) {
  if (i == 8 && n8 == 5) {
    return `(${expand2(42, rules[42], n8, n11, rules)})`;
  }
  if (i == 11 && n11 == 5) {
    return `(${expand2(42, rules[42], n8, n11, rules)}${expand2(
      31,
      rules[31],
      n8,
      n11,
      rules
    )})`;
  }
  n8 += i == 8;
  n11 += i == 11;
  if (rule[0] == '"') {
    return rule[1];
  }
  const expanded = rule
    .split(" ")
    .reduce(
      (rule, part) =>
        rule + (part == "|" ? "|" : expand2(part, rules[part], n8, n11, rules)),
      ""
    );
  return `(${expanded})`;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
