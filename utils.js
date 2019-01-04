const chalk = require('chalk');

const onCycle = event => console.log(`${event.target}`);

function onComplete() {
  let fastest = String(this.filter('fastest').map('name')),
    slowest = String(this.filter('slowest').map('name'));
  console.log(`\tBenchmark: ${chalk.cyan(this.name)}\nThe fastest is ${chalk.black.bgGreen(fastest)}\nThe slowest is ${chalk.black.bgRed(slowest)}\n`)
}

module.exports = {
  onCycle,
  onComplete
}