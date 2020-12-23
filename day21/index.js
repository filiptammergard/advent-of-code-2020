const fs = require("fs");

const input = fs.readFileSync("day21/input.txt").toString().split("\n");

function computePartOne() {
  const [ingredients, allergens] = parseInput(input);
  const masterAllergensMap = getMasterAllergenMap([ingredients, allergens]);
  const [answer] = getSafeIngredients([masterAllergensMap, ingredients]);
  return answer;
}

function computePartTwo() {
  const [ingredients, allergens] = parseInput(input);
  const masterAllergensMap = getMasterAllergenMap([ingredients, allergens]);
  const [, masterAllergen] = getSafeIngredients([
    masterAllergensMap,
    ingredients,
  ]);
  const answer = getTranslation(masterAllergen);
  return answer;
}

function parseInput(input) {
  const ingredients = input.reduce((acc, curr) => {
    const ingredient = curr.split("(contains ")[0];
    return [...acc, ingredient];
  }, []);

  const allergens = input.reduce((acc, curr) => {
    const allergen = curr.split("(contains ")[1].slice(0, -1);
    return [...acc, allergen];
  }, []);
  return [ingredients, allergens];
}

function getMasterAllergenMap([ingredients, allergens]) {
  const masterAllergen = new Map();
  for (let idx = 0; idx < ingredients.length; idx++) {
    const ingredient = new Set(ingredients[idx].split(" ").filter(Boolean));
    const allergen = allergens[idx].replace(/([,] )/g, " ").split(" ");

    for (const all of allergen) {
      if (!masterAllergen.has(all)) {
        masterAllergen.set(all, ingredient);
      } else {
        const curr = masterAllergen.get(all);
        const union = new Set(getIntersect(curr, ingredient));
        masterAllergen.set(all, union);
      }
    }
  }
  return masterAllergen;
}

function getSafeIngredients([master, ingredients]) {
  let safe = [];
  const masterSet = new Set();
  for (const value of master.values()) {
    for (const v of [...value]) {
      masterSet.add(v);
    }
  }

  for (let idx = 0; idx < ingredients.length; idx++) {
    let ingredient = ingredients[idx].split(" ").filter(Boolean);
    for (const ing of ingredient) {
      if (!masterSet.has(ing)) {
        safe.push(ing);
      }
    }
  }
  return [safe.length, master];
}

function getTranslation(masterAllergen) {
  const items = masterAllergen.size;
  let dict = [];
  let cache = [];
  while (cache.length < items) {
    for (const item of masterAllergen) {
      const [trans, orig] = item;
      if (orig.size === 1) {
        dict.push({ english: trans, foreign: [...orig][0] });
        masterAllergen.delete(trans);
        cache.push(...orig);
      } else {
        for (const elm of orig) {
          if (cache.includes(elm)) {
            orig.delete(elm);
          }
        }
      }
    }
  }

  dict.sort(function (a, b) {
    return a.english.localeCompare(b.english);
  });
  let part2 = dict.map((elm) => elm.foreign);
  return part2.join();
}

function getIntersect(curr, n) {
  return [...curr].filter((x) => n.has(x));
}

const partOneAnswer = computePartOne();
console.log(`Part 1: ${partOneAnswer}`);

const partTwoAnswer = computePartTwo();
console.log(`Part 2: ${partTwoAnswer}`);
