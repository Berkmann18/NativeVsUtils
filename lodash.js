'use strict';

const _ = require('lodash'),
  Benchmark = require('benchmark'),
  chalk = require('chalk'),
  Table = require('cli-table');

const NATIVE_RE = /native\([a-z/0-9\.]+\)/gi;

const scores = {
    lodash: { positive: 0, negative: 0 },
    native: { positive: 0, negative: 0 },
  },
  stats = {},
  complete = {
    lodash: false,
    native: false
  }
let totalTests = 0;

const min = arr => arr.reduce((a, b) => Math.min(a, b), []),
  max = arr => arr.reduce((a, b) => Math.max(a, b), [])

let method = 'trim';

function onComplete() {
  stats[this.name] = this.stats;
  complete[this.name] = true;

  if (complete.lodash && complete.native) {
    let lMean, nMean,
      lMax = max(stats.lodash.sample),
      nMax = max(stats.native.sample),
      lMin = min(stats.lodash.sample),
      nMin = min(stats.native.sample);

    if (stats.lodash.mean < stats.native.mean) {
      lMean = chalk.bgCyan(stats.lodash.mean);
      nMean = chalk.bgYellow(stats.native.mean);
    } else if (stats.lodash.mean > stats.native.mean) {
      lMean = chalk.bgYellow(stats.lodash.mean);
      nMean = chalk.bgCyan(stats.native.mean);
    } else {
      lMean = stats.lodash.mean;
      nMean = stats.native.mean;
    }

    if (lMax < nMax) {
      lMax = chalk.bgCyan(lMax);
      nMax = chalk.bgYellow(nMax);
    } else if (lMax > nMax) {
      lMax = chalk.bgYellow(lMax);
      nMax = chalk.bgCyan(nMax);
    }

    if (lMin < nMin) {
      lMin = chalk.bgCyan(lMin);
      nMin = chalk.bgYellow(nMin);
    } else if (lMin > nMin) {
      lMin = chalk.bgYellow(lMin);
      nMin = chalk.bgCyan(nMin);
    }

    const table = new Table({
      head: [chalk.magenta(method), 'Lodash', 'Native']
    });
    table.push({ Mean: [lMean, nMean] }, { Worst: [lMax, nMax] }, { Best: [lMin, nMin] })
    console.log(table.toString());
  }
}

const arr = [0, 1, 2],
  users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ],
  cb = o => o.age < 40,
  mtx = [1, [2, [3, [4]], 5]],
  ab = new ArrayBuffer(2),
  redux = (prev, crt) => prev + crt,
  a0 = [0, 1, false, 2, '', 3],
  sortBy = (key) => {
    return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
  },
  a1 = [0, 1, 1, 2, 4, 5, 7, 8, 7],
  x = undefined,
  obj = { a: [{ b: { c: 3 } }] },
  re = /apples/gi,
  txt = 'Apples are round, and apples are juicy.';

const lodashBench = new Benchmark('lodash', {
  defer: true,
  // benchmark test function
  fn(deferred) {
    // call `Deferred#resolve` when the deferred test is finished
    // _.compact([0, 1, false, 2, '', 3])
    // _.concat(arr, 2, [3], 4)
    // _.fill(arr, 'x')
    // _[method](arr)
    // _.flatten(mtx)
    // _.head(arr);
    // _.tail(arr);
    // _.indexOf(arr, 1);
    // _.join(arr, '-');
    // _.without(arr, 2);
    // _.slice(arr, 1, 3);
    // _.isArray(arr);
    // _.isArrayBuffer(ab);
    // _.each([...arr], String);
    // _.every(arr, Boolean);
    // _.filter(users, cb);
    // _.includes(arr, 2);
    // _.map(arr, String);
    // _.range(4);
    // _.size(users);
    // _.orderBy(users, ['name'], ['asc']);
    // _.uniq(a1);
    //_.isNaN(NaN);
    // _.isNil(null);
    // _.isNull(null);
    // _.gte(3, 1);
    /* function Foo() {
      this.c = 3;
    }

    function Bar() {
      this.e = 5;
    }
    Foo.prototype.d = 4;
    Bar.prototype.f = 6;
    _.assign({}, new Foo, new Bar) */
    // _.keys(users[0]);
    // _.toPairs(users[0]);
    // _.values(users[0]);
    // _.get(obj, 'a[0].b.c', 1);
    // _.omit(users[1], ['age', 'active']);
    // _.repeat('lorem', 2);
    // _.toUpper('Hello World');
    // _.trim('  lorem  ');
    _.replace(txt, re, 'oranges');

    deferred.resolve();
  },
  onComplete
  /* ,
    onCycle(event) {
      console.log(chalk.redBright(event.target))
    } */
});

lodashBench.run();

const bench = new Benchmark('native', {
  defer: true,
  // benchmark test function
  fn(deferred) {
    // call `Deferred#resolve` when the deferred test is finished
    // [0, 1, false, 2, '', 3].filter(Boolean)
    // arr.concat(2, [3], 4)
    // arr.fill('x')
    // arr[0]
    // mtx.reduce((a, b) => a.concat(b), [])
    // const [head, ...tail] = arr;
    // arr.indexOf(1);
    // arr.join('-');
    // arr.slice(1, 3);
    // Array.isArray(arr);
    // ab instanceof ArrayBuffer;
    // [...arr].forEach(String);
    // arr.every(Boolean);
    // users.filter(cb);
    // arr.includes(2);
    // arr.map(String);
    // arr.reduce(redux);
    // [...Array(4).keys()] //Array.from({ length: 4 }, (x, i) => i) is slower
    // Object.keys(users).length
    // users.sort(sortBy('name'));
    // [...new Set(a1)];
    //isNaN(NaN); //faster than Number.isNaN(NaN);
    // null === null;
    // 3 >= 1;
    /* function Foo() {
      this.c = 3;
    }

    function Bar() {
      this.e = 5;
    }
    Foo.prototype.d = 4;
    Bar.prototype.f = 6;
    Object.assign({}, new Foo, new Bar); */
    // Object.keys(users[0]);
    // Object.entries(users[0]);
    // Object.values(users[0]);
    // const { a: [{ b: { c: res = 1 } }] } = obj;
    // const { age, active, ...res } = users[1];
    // 'lorem'.repeat(2);
    // 'Hello World'.toUpperCase();
    // '  lorem  '.trim();
    txt.replace(re, 'oranges');

    deferred.resolve();
  },
  onComplete
  /* ,
    onCycle(event) {
      console.log(chalk.greenBright(event.target))
    } */
});

bench.run();