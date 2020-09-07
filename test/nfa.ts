import { getNFA, getDFA } from "../src";

const nfa: any = getNFA("a(b|dc)");

const dfa: any = getDFA("a(b|cd)");

console.log(nfa.match("ac"));
