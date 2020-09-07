import chalk from "chalk";
import { buildToNFA, infixToPostfix, insertExplicitConcatOperator } from "./lib/utils";

const info = (...args: any) => {
  // console.log(chalk.green(...args), "\n");
};

export const getNFA = (regex: string): any => {
  const strWithConcat = insertExplicitConcatOperator(regex);
  info("1. add connector:", strWithConcat);

  const strWithPostfix = infixToPostfix(strWithConcat);
  info("2. transform to postfix:", strWithPostfix);

  const nfa = buildToNFA(strWithPostfix);
  info("3. generate nfa:");
  // console.dir(nfa);
  return nfa;
};

export const getDFA = (regex: string): any => {
  const nfa = getNFA(regex);
  info("4. transform to dfa:"); //
  const dfa = generateDFA(nfa);
  // console.dir(dfa);
  return dfa;
};
