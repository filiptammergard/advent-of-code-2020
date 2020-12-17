const fs = require("fs");

const input = fs.readFileSync("day16/input.txt").toString();

function computePartOne() {
  const rules = parseRules(input);
  const nearbyTickets = parseNearbyTickets(input);
  const ticketScanningErrorRate = getTicketScanningErrorRate(
    nearbyTickets,
    rules
  );
  return ticketScanningErrorRate;
}

function computePartTwo() {
  const rules = parseRules(input);
  const nearbyTickets = parseNearbyTickets(input);
  const validNearbyTickets = getValidNearbyTickets(nearbyTickets, rules);
  const rulePositions = getRulePositions(validNearbyTickets, rules);
  const myTicket = parseMyTicket(input);
  const departureRules = getDepartureRules(rulePositions, myTicket);
  const answer = departureRules.reduce((p, c) => p * c, 1);
  return answer;
}

function parseRules(input) {
  const rules = input
    .split("\n\n")[0]
    .split("\n")
    .map((rd) => {
      const m = rd.match(/([a-z ]+): (\d+)-(\d+) or (\d+)-(\d+)/);
      return {
        n: m[1],
        r1: [parseInt(m[2], 10), parseInt(m[3], 10)],
        r2: [parseInt(m[4], 10), parseInt(m[5], 10)],
      };
    });
  return rules;
}

function parseNearbyTickets(input) {
  const nearbyTickets = input
    .split("\n\n")[2]
    .split("\n")
    .slice(1)
    .map((r) => r.split(",").map((s) => parseInt(s, 10)));
  return nearbyTickets;
}

function getTicketScanningErrorRate(nearbyTickets, rules) {
  const ticketScanningErrorRate = nearbyTickets.reduce((sum, ticket) => {
    const partScanningErrorRate = ticket.reduce((ticketSum, value) => {
      const valid = rules.some(
        (rule) =>
          (value >= rule.r1[0] && value <= rule.r1[1]) ||
          (value >= rule.r2[0] && value <= rule.r2[1])
      );
      if (valid) return ticketSum;
      else return ticketSum + value;
    }, 0);
    return sum + partScanningErrorRate;
  }, 0);
  return ticketScanningErrorRate;
}

function getValidNearbyTickets(nearbyTickets, rules) {
  const validNearbyTickets = nearbyTickets.filter((t) =>
    t.every((n) =>
      rules.some(
        (r) => (n >= r.r1[0] && n <= r.r1[1]) || (n >= r.r2[0] && n <= r.r2[1])
      )
    )
  );
  return validNearbyTickets;
}

function getRulePositions(validNearbyTickets, rules) {
  const canbe = Array(validNearbyTickets[0].length)
    .fill()
    .map((_, i) => ({
      i,
      fs: rules
        .filter((r) =>
          validNearbyTickets.every(
            (t) =>
              (t[i] >= r.r1[0] && t[i] <= r.r1[1]) ||
              (t[i] >= r.r2[0] && t[i] <= r.r2[1])
          )
        )
        .map((r) => r.n),
    }))
    .sort((a, b) => a.fs.length - b.fs.length);
  const rulePositions = canbe.reduce(
    (p, c) => [
      ...p,
      {
        i: c.i,
        f: c.fs.filter((f) => p.every((i) => f !== i.f))[0],
      },
    ],
    []
  );
  return rulePositions;
}

function parseMyTicket(input) {
  const myTicket = input
    .split("\n\n")[1]
    .split("\n")[1]
    .split(",")
    .map((s) => parseInt(s, 10));
  return myTicket;
}

function getDepartureRules(rulePositions, myTicket) {
  const departureRules = rulePositions.map(({ i, f }) =>
    /^departure/.test(f) ? myTicket[i] : 1
  );
  return departureRules;
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
