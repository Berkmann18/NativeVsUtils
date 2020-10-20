'use strict';
// Source for some snippets: https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore

const _ = require('lodash'),
  __ = require('underscore'),
  Suite = require('benchmark').Suite,
  chalk = require('chalk'),
  { onCycle } = require('./utils');

const scores = {
    lodash: { positive: 0, negative: 0 },
    underscore: { positive: 0, negative: 0 },
    native: { positive: 0, negative: 0 },
  },
  NATIVE_RE = /native\([a-z/0-9\.]+\)/gi;
let totalTests = 0;

// Benchmark stuff
function onComplete() {
  let fastest = String(this.filter('fastest').map('name')),
    slowest = String(this.filter('slowest').map('name'));
  console.log(`\tBenchmark: ${chalk.cyan(this.name)}\nThe fastest is ${chalk.black.bgGreen(fastest)}\nThe slowest is ${chalk.black.bgRed(slowest)}\n`);

  //Replace all native(...) to native
  fastest = fastest.replace(NATIVE_RE, 'native');
  slowest = slowest.replace(NATIVE_RE, 'native');
  if (fastest.includes(',')) {
    fastest
      .split(',')
      .forEach(lib => ++scores[lib].positive)
  } else ++scores[fastest].positive;
  if (slowest.includes(',')) {
    slowest
      .split(',')
      .forEach(lib => ++scores[lib].negative)
  } else ++scores[slowest].negative;

  ++totalTests;
  console.log(`Scores (/${chalk.keyword('orange')(totalTests)}): \n`);
  for (let lib in scores) {
    console.log(`${chalk.yellow(lib)}: ${chalk.greenBright(scores[lib].positive + '+')} / ${chalk.redBright(scores[lib].negative + '-')} = ${chalk.blueBright(scores[lib].positive - scores[lib].negative)}`)
  }
}
const opts = {
  onComplete,
  onCycle
}

// Functions
const compact = arr => arr.filter(Boolean),
  compact0 = arr => arr.filter(v => v);

// Suites
const compactSuite = new Suite('compact', opts),
  concatSuite = new Suite('concat', opts),
  fillSuite = new Suite('fill', opts),
  findSuite = new Suite('find', opts),
  findIdxSuite = new Suite('findIndex', opts),
  firstSuite = new Suite('first', opts),
  flattenSuite = new Suite('flatten', opts),
  headTailSuite = new Suite('head & tail', opts),
  idxOfSuite = new Suite('indexOf', opts),
  joinSuite = new Suite('join', opts),
  lastSuite = new Suite('last', opts),
  lastIdxOfSuite = new Suite('lastIndexO', opts),
  reverseSuite = new Suite('reverse', opts),
  withoutSuite = new Suite('without', opts),
  sliceSuite = new Suite('slice', opts),
  isArrSuite = new Suite('isArray', opts),
  isArrBufSuite = new Suite('isArrayBuffer', opts),
  eachSuite = new Suite('each', opts),
  everySuite = new Suite('every', opts),
  filterSuite = new Suite('filter', opts),
  includesSuite = new Suite('includes', opts),
  mapSuite = new Suite('map', opts),
  reduceSuite = new Suite('reduce', opts),
  rangeSuite = new Suite('range', opts),
  reduceRightSuite = new Suite('reduceRight', opts),
  sizeSuite = new Suite('size', opts),
  someSuite = new Suite('some', opts),
  sortBySuite = new Suite('sortBy/orderBy', opts),
  uniqSuite = new Suite('uniq', opts),
  nanSuite = new Suite('isNan', opts),
  nilSuite = new Suite('isNil', opts),
  nulSuite = new Suite('isNull', opts),
  undefSuite = new Suite('isUndefined', opts),
  gtSuite = new Suite('gt', opts),
  gteSuite = new Suite('gte', opts),
  assSuite = new Suite('assign', opts),
  extSuite = new Suite('extend', opts),
  keySuite = new Suite('keys', opts),
  toPairsSuite = new Suite('toPairs', opts),
  valSuite = new Suite('values', opts),
  getSuite = new Suite('get', opts),
  omitSuite = new Suite('omit', opts),
  repSuite = new Suite('repeat', opts),
  toLowSuite = new Suite('toLower', opts),
  toUpSuite = new Suite('toUpper', opts),
  trimSuite = new Suite('trim', opts),
  replaceSuite = new Suite('replace', opts),

  arr = [0, 1, false, 2, '', 3];

compactSuite.add('lodash', () => _.compact(arr))
  .add('underscore', () => __.compact(arr))
  .add('native', () => compact(arr))
  .add('native(verbose)', () => compact0(arr))
  .run({ 'async': true });

const a0 = [1];

concatSuite.add('lodash', () => _.concat(a0, 2, [3], [
    [4]
  ]))
  .add('underscore', () => __.concat(a0, 2, [3], [
    [4]
  ]))
  .add('native', () => a0.concat(2, [3], [
    [4]
  ]))
  .run({ 'async': true });

const a1 = [1, 2, 3];

fillSuite.add('lodash', () => _.fill(a1, 'a'))
  .add('underscore', () => __.fill(a1, 'a'))
  .add('native', () => a1.fill('a'))
  .run({ 'async': true });

const users = [
    { user: 'barney', age: 36, active: true },
    { user: 'fred', age: 40, active: false },
    { user: 'pebbles', age: 1, active: true }
  ],
  cb = o => o.age < 40;

findSuite
  .add('lodash', () => _.find(users, cb))
  .add('underscore', () => __.find(users, cb))
  .add('native', () => users.find(cb))
  .run({ 'async': true });

findIdxSuite
  .add('lodash', () => _.findIndex(users, cb))
  .add('underscore', () => __.findIndex(users, cb))
  .add('native', () => users.findIndex(cb))
  .run({ 'async': true });

firstSuite
  .add('lodash', () => _.first(arr))
  .add('underscore', () => __.first(arr))
  .add('native', () => arr[0])
  .add('native(concat/shift)', () => [].concat(arr).shift())
  .add('native(slice)', () => arr.slice(0, 1))
  .run({ 'async': true });

const mtx = [1, [2, [3, [4]], 5]];

flattenSuite
  .add('lodash', () => _.flatten(mtx))
  .add('underscore', () => __.flatten(mtx))
  .add('native', () => mtx.reduce((a, b) => a.concat(b), []))
  .run({ 'async': true });

headTailSuite
  .add('lodash', () => {
    _.head(arr);
    _.tail(arr)
  })
  .add('underscore', () => {
    __.head(mtx);
    _.tail(arr)
  })
  .add('native', () => {
    const [head, ...tail] = arr;
  })
  .run({ 'async': true });

idxOfSuite
  .add('lodash', () => _.indexOf(arr, 2))
  .add('underscore', () => __.indexOf(arr, 2))
  .add('native', () => arr.indexOf(2))
  .run({ 'async': true });

joinSuite
  .add('lodash', () => _.join(arr, '-'))
  .add('native', () => arr.join('-'))
  .run({ 'async': true });
++scores.underscore.negative;

lastSuite
  .add('lodash', () => _.last(arr))
  .add('underscore', () => __.last(arr))
  .add('native', () => arr[arr.length - 1])
  .add('native(concat/pop)', () => [].concat(arr).pop())
  .add('native(slice)', () => arr.slice(-1))
  .run({ 'async': true });

lastIdxOfSuite
  .add('lodash', () => _.lastIndexOf(arr, 2))
  .add('underscore', () => __.lastIndexOf(arr, 2))
  .add('native', () => arr.lastIndexOf(2))
  .run({ 'async': true });

reverseSuite
  .add('lodash', () => _.reverse(arr))
  .add('native', () => arr.reverse())
  .run({ 'async': true });
++scores.underscore.negative;

withoutSuite
  .add('lodash', () => _.without(arr, 2))
  .add('native', () => arr.filter(v => v !== 2))
  .run({ 'async': true });
++scores.underscore.negative;

sliceSuite
  .add('lodash', () => _.slice(arr, 1, 3))
  .add('underscore', () => __.slice(arr, 1, 3))
  .add('native', () => arr.slice(1, 3))
  .run({ 'async': true });

isArrSuite
  .add('lodash', () => _.isArray(arr))
  .add('underscore', () => __.isArray(arr))
  .add('native', () => Array.isArray(arr))
  .run({ 'async': true });

const ab = new ArrayBuffer(2);
isArrBufSuite
  .add('lodash', () => _.isArrayBuffer(ab))
  .add('underscore', () => __.isArrayBuffer(ab))
  .add('native', () => ab instanceof ArrayBuffer)
  .run({ 'async': true });

let array = [...arr];
eachSuite
  .add('lodash', () => _.each(array, String))
  .add('underscore', () => __.each(array, String))
  .add('native', () => array.forEach(String))
  .run({ 'async': true });

everySuite
  .add('lodash', () => _.every(a1, Boolean))
  .add('underscore', () => __.every(a1, Boolean))
  .add('native', () => a1.every(Boolean))
  .run({ 'async': true });

filterSuite
  .add('lodash', () => _.filter(users, cb))
  .add('underscore', () => __.filter(users, cb))
  .add('native', () => users.filter(cb))
  .run({ 'async': true });

includesSuite
  .add('lodash', () => _.includes(arr, 2))
  .add('underscore', () => __.includes(arr, 2))
  .add('native', () => arr.includes(2))
  .add('native(ES5)', () => arr.indexOf(2) > -1)
  .run({ 'async': true });

mapSuite
  .add('lodash', () => _.map(arr, String))
  .add('underscore', () => __.map(arr, String))
  .add('native', () => arr.map(String))
  .run({ 'async': true });

const redux = (prev, crt) => prev + crt;

reduceSuite
  .add('lodash', () => _.reduce(a1, redux))
  .add('underscore', () => __.reduce(a1, redux))
  .add('native', () => arr.reduce(a1, redux))
  .run({ 'async': true });

rangeSuite
  .add('lodash', () => _.range(4))
  .add('underscore', () => __.range(4))
  .add('native(Array.from)', () => Array.from({ length: 4 }, (x, i) => i))
  .add('native(keys/spread)', () => [...Array(4).keys()])
  .run({ 'async': true });

reduceRightSuite
  .add('lodash', () => _.reduceRight(a1, redux))
  .add('underscore', () => __.reduceRight(a1, redux))
  .add('native', () => arr.reduceRight(a1, redux))
  .run({ 'async': true });

sizeSuite
  .add('lodash', () => _.size(users))
  .add('underscore', () => __.size(users))
  .add('native', () => Object.keys(users).length)
  .run({ 'async': true });

someSuite
  .add('lodash', () => _.some(arr, x => !x))
  .add('underscore', () => __.some(arr, x => !x))
  .add('native', () => arr.some(x => !x))
  .run({ 'async': true });

const sortBy = (key) => {
  return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
};

sortBySuite
  .add('lodash', () => _.orderBy(users, ['name'], ['asc']))
  .add('underscore', () => __.sortBy(arr, 'name'))
  .add('native', () => users.sort(sortBy('name')))
  .run({ 'async': true });

const a2 = [0, 1, 1, 2, 4, 5, 7, 8, 7];
uniqSuite
  .add('lodash', () => _.uniq(a2))
  .add('underscore', () => __.uniq(a2))
  .add('native', () => [...new Set(a2)])
  .run({ 'async': true });

nanSuite
  .add('lodash', () => _.isNaN(NaN))
  .add('underscore', () => __.isNaN(NaN))
  .add('native', () => isNaN(NaN))
  .add('native(ES6)', () => Number.isNaN(NaN))
  .run({ 'async': true });

nilSuite
  .add('lodash', () => _.isNil(null))
  .add('native', () => null == null)
  .run({ 'async': true });
++scores.underscore.negative;

nulSuite
  .add('lodash', () => _.isNull(null))
  .add('underscore', () => __.isNull(null))
  .add('native', () => null === null)
  .run({ 'async': true });

undefSuite
  .add('lodash', () => _.isUndefined(x))
  .add('underscore', () => __.isUndefined(x))
  .add('native(typeof)', () => typeof x === 'undefined')
  .add('native', () => x === undefined)
  .run({ 'async': true });

gtSuite
  .add('lodash', () => _.gt(3, 1))
  .add('native', () => 3 > 1)
  .run({ 'async': true });
++scores.underscore.negative;

gteSuite
  .add('lodash', () => _.gte(3, 1))
  .add('native', () => 3 >= 1)
  .run({ 'async': true });
++scores.underscore.negative;

function Foo() {
  this.c = 3;
}

function Bar() {
  this.e = 5;
}
Foo.prototype.d = 4;
Bar.prototype.f = 6;

assSuite
  .add('lodash', () => _.assign(new Foo, new Bar))
  .add('underscore', () => __.extendOwn(new Foo, new Bar))
  .add('native', () => Object.assign({}, new Foo, new Bar))
  .run({ 'async': true });

extSuite
  .add('lodash', () => _.assignIn({}, new Foo, new Bar))
  .add('underscore', () => __.extend({}, new Foo, new Bar))
  .add('native', () => Object.assign({}, new Foo, Foo.prototype, new Bar, Bar.prototype))
  .run({ 'async': true });

keySuite
  .add('lodash', () => _.keys(users[0]))
  .add('underscore', () => __.keys(users[0]))
  .add('native', () => Object.keys(users[0]))
  .run({ 'async': true });

toPairsSuite
  .add('lodash', () => _.toPairs(users[0]))
  .add('underscore', () => __.toPairs(users[0]))
  .add('native', () => Object.entries(users[0]))
  .run({ 'async': true });

valSuite
  .add('lodash', () => _.values(users[0]))
  .add('underscore', () => __.values(users[0]))
  .add('native', () => Object.values(users[0]))
  .run({ 'async': true });

const obj = { a: [{ b: { c: 3 } }] };

getSuite
  .add('lodash', () => _.get(obj, 'a[0].b.c', 1))
  .add('native', () => {
    const { a: [{ b: { c: res = 1 } }] } = obj
  })
  .run({ 'async': true });
++scores.underscore.negative;

omitSuite
  .add('lodash', () => _.omit(users[1], ['age', 'active']))
  .add('underscore', () => __.omit(users[1], ['age', 'active']))
  .add('native', () => {
    const { age, active, ...res } = users[1];
  })
  .run({ 'async': true });

repSuite
  .add('lodash', () => _.repeat('lorem', 2))
  .add('native', () => 'lorem'.repeat(2))
  .run({ 'async': true });
++scores.underscore.negative;

toLowSuite
  .add('lodash', () => _.toLower('Hello World'))
  .add('native', () => 'Hello World'.toLowerCase())
  .run({ 'async': true });
++scores.underscore.negative;

toUpSuite
  .add('lodash', () => _.toUpper('Hello World'))
  .add('native', () => 'Hello World'.toUpperCase())
  .run({ 'async': true });
++scores.underscore.negative;

trimSuite
  .add('lodash', () => _.trim('  lorem  '))
  .add('native', () => '  lorem  '.trim())
  .run({ 'async': true });
++scores.underscore.negative;

const re = /apples/gi,
  txt = 'Apples are round, and apples are juicy.';
replaceSuite
  .add('lodash', () => _.replace(txt, re, 'oranges'))
  .add('native', () => txt.replace(re, 'oranges'))
  .run({ 'async': true });
++scores.underscore.negative;