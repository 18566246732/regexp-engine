const Benchmark = require('benchmark');
const suite = new Benchmark.Suite();
const { getDFA, getNFA} = require("../dist/src/index");

suite
    .add('getDFA', function () {
        const dfa = getDFA("a(b|c)");
    })
    .add('getNFA', function () {
        const nfa = getNFA("a(b|c)");
    })
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log("");
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    .run({ 'async': true });

// const dfa = getDFA("a(b|c)");
// const nfa = getNFA("a(b|c)");

// suite
//     .add('dfa test', function () {
//         dfa.match("ac");
//     })
//     .add('nfa test', function () {
//         nfa.macth("ac");
//     })
//     .on('cycle', function (event) {
//         console.log(String(event.target));
//     })
//     .on('complete', function () {
//         console.log('Fastest is ' + this.filter('fastest').map('name'));
//     })
//     .run({ 'async': true });
