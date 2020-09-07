const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const { getDFA, getNFA} = require("../dist/src/index");

suite
    .add("Regexp#nfa", () => {
        const nfa = getNFA("a(b|c)");
        nfa.match("ac");
    })
    .add("Regexp#dfa", () => {
        const dfa = getDFA("a(b|c)");
        dfa.match("ac");
    })
    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log("");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });