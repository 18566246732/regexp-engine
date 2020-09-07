const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const { getDFA, getNFA} = require("../dist/src/index");

const dfa = getDFA("a(b|c)");
const nfa = getNFA("a(b|c)");

suite
    .add('dfa match', function () {
        dfa.match("ac");
    })
    .add('nfa match', function () {
        nfa.match("ac");
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log("");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });
