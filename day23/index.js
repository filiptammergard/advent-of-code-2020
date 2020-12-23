const fs = require("fs");

const input = fs.readFileSync("day23/input.txt").toString();

function computePartOne() {
  const answer = play(input, 9, 100);
  return answer;
}

function computePartTwo() {
  const answer = play(input.split(""), 1000000, 10000000);
  return answer;
}

let imp = (i, a) => (i <= a.length ? a[i - 1] : i);

let cat = (l) => {
  let r = "",
    n = l.next;
  while (n != l && r.length < 20) {
    r += n.v;
    n = n.next;
  }
  return r;
};

function play(input, N, M) {
  let obj = {};
  for (let i = 1; i <= N; ++i) {
    obj[i] = { v: i };
  }
  for (let i = 1; i <= N; ++i) {
    obj[imp(i, input)].next = obj[imp((i % N) + 1, input)];
  }

  let cur = obj[imp(1, input)];
  for (let m = 1; m <= M; ++m) {
    let snip = cur.next;
    let putBackAt,
      v = cur.v;
    cur = cur.next = snip.next.next.next;
    do {
      v = ((v + N - 1 - 1) % N) + 1;
      putBackAt = obj[v];
    } while (
      putBackAt == snip ||
      putBackAt == snip.next ||
      putBackAt == snip.next.next
    );
    snip.next.next.next = putBackAt.next;
    putBackAt.next = snip;
  }
  if (N < 100) {
    let r = cat(obj[1]);
    return r;
  } else {
    let nx = obj[1].next;
    return nx.v * nx.next.v;
  }
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
