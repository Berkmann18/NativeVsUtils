'use strict';

const _ = require('lodash'),
  __ = require('underscore'),
  Suite = require('benchmark').Suite,
  opts = require('./utils');

const concatSuite = new Suite('concat', opts);
const array = [0, 1, 2];

concatSuite.add('lodash', () => _.concat(array, 3, 4, 5))
  .add('underscore', () => __.concat(array, 3, 4, 5))
  .add('native', () => array.concat(3, 4, 5))
  .run({ 'async': true });