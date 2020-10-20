const process = require("./processor");

const processedData = process();

const getLibData = (lib, data) => {
  return data.filter(([name]) => name.startsWith(lib));
};

const getCount = (data) => {
  return data.reduce((total) => 1 + total, 0);
};

const FIELDS = {
  obs: 1,
  dev: 2,
  runs: 3,
};

const getAverage = (data, field) => {
  return data.reduce((sum, val) => sum + val[field], 0) / data.length;
};

const getMin = (data, field) => Math.min(...data.map((val) => val[field]));

const getMax = (data, field) => Math.max(...data.map((val) => val[field]));

const getStats = (lib, data = processedData) => {
  const observations = getLibData(lib, data);

  const average = getAverage(observations, FIELDS.obs);
  const averageChange = getAverage(observations, FIELDS.dev);

  return {
    lib,
    count: getCount(observations),
    average,
    min: getMin(observations, FIELDS.obs),
    max: getMax(observations, FIELDS.obs),
    averageChange,
    increase: average * (1 + averageChange / 100),
    decrease: average * (1 - averageChange / 100),
  };
};

// console.table(data);

const results = {
  lodash: getStats("lodash"),
  underscore: getStats("underscore"),
  native: getStats("native"),
};

console.table(results);

const stats = Object.values(results);

const getWorstStat = (field, statistics = stats) => {
  return Math.min(...statistics.map((stat) => stat[field]));
};

const getBestStat = (field, statistics = stats) => {
  return Math.max(...statistics.map((stat) => stat[field]));
};

const findLib = (field, target) =>
  stats.find((stat) => stat[field] === target).lib;

const worstLib = (field) => findLib(field, getWorstStat(field));
const bestLib = (field) => findLib(field, getBestStat(field));

const worstResults = {
  average: worstLib("average"),
  min: worstLib("min"),
  max: worstLib("max"),
  averageChange: worstLib("averageChange"),
  increase: worstLib("increase"),
  decrease: worstLib("decrease"),
};

const bestResults = {
  average: bestLib("average"),
  min: bestLib("min"),
  max: bestLib("max"),
  averageChange: bestLib("averageChange"),
  increase: bestLib("increase"),
  decrease: bestLib("decrease"),
};

console.log("Worst results=");
console.table(worstResults);
console.log("Best results=");
console.table(bestResults);

const perfComp = (a, b) => results[a].average / results[b].average - 1;

const nativeVslodash = perfComp("native", "lodash");
const nativeVsunderscore = perfComp("native", "underscore");
const nativeVslibs = (nativeVslodash + nativeVsunderscore) / 2;

console.log(`
Native is ${nativeVslodash * 100}% more performant than Lodash and ${nativeVsunderscore * 100}% more performant than Underscore
So it's ${nativeVslibs * 100}% more performant than both
Lodash is ${perfComp(
  "lodash",
  "underscore"
) * 100}% more performant than Underscore`);
