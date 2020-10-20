const { readFileSync } = require('fs');

const process = (filename = 'index.txt') => {
  const dump = readFileSync(filename, 'utf-8');
  const lines = dump.split('\n');
  const data = [];
  //e.g lodash x 20,528,769 ops/sec ±5.15% (5 runs sampled)
  const RE = /(?<lib>lodash|underscore|native\(.*?\)|native) x (?<ops>[0-9,]+) ops\/sec ±(?<dev>[0-9.]+)% \((?<runs>\d+) runs sampled\)/;
  
  for (line of lines) {
    const els = RE.exec(line);
    if (els !== null) {
      const {lib, ops, dev, runs} = els.groups;
      const opsPerSec = Number(ops.replace(/,/g, ''));
      data.push([
        lib, opsPerSec, parseFloat(dev), parseInt(runs)
      ]);
    }
  }

  return data;
}

module.exports = process;