'use strict';

const _ = require('lodash'),
  __ = require('underscore'),
  Suite = require('benchmark').Suite;

const onCycle = event => console.log(`${event.target}`);
const opts = {
  onCycle
};

const concatSuite = new Suite('concat', opts),
  fillSuite = new Suite('fill', opts),
  idxOfSuite = new Suite('indexOf', opts),
  isArrSuite = new Suite('isArray', opts),
  lastIdxOfSuite = new Suite('lastIndexO', opts),
  sliceSuite = new Suite('slice', opts);

const a0 = [1];

// concatSuite.add('lodash', () => _.concat(a0, 2, [3], [
//     [4]
//   ]))
//   .add('underscore', () => __.concat(a0, 2, [3], [
//     [4]
//   ]))
//   .add('native', () => a0.concat(2, [3], [
//     [4]
//   ]))
//   .run({ 'async': true });

const a1 = [1, 2, 3, 4, 5, 7, 9, 10, 28, 193, 739, 205, 3881, 10389734, 24837, 27484, 7864, 2842, 9432];

// fillSuite.add('lodash', () => _.fill(a1, 'a'))
//   .add('underscore', () => __.fill(a1, 'a'))
//   .add('native', () => a1.fill('a'))
//   .run({ 'async': true });

idxOfSuite
  .add('lodash', () => _.indexOf(arr, 7864))
  .add('underscore', () => __.indexOf(arr, 7864))
  .add('native', () => arr.indexOf(7864))
  .run({ 'async': true });

// isArrSuite
//   .add('lodash', () => _.isArray(arr))
//   .add('underscore', () => __.isArray(arr))
//   .add('native', () => Array.isArray(arr))
//   .run({ 'async': true });

// lastIdxOfSuite
//   .add('lodash', () => _.lastIndexOf(arr, 2))
//   .add('underscore', () => __.lastIndexOf(arr, 2))
//   .add('native', () => arr.lastIndexOf(2))
//   .run({ 'async': true });

// sliceSuite
//   .add('lodash', () => _.slice(arr, 1, 3))
//   .add('underscore', () => __.slice(arr, 1, 3))
//   .add('native', () => arr.slice(1, 3))
//   .run({ 'async': true });