import { NFA } from "./nfa";
import { State } from "./state";
import {
    CLOSURE_OPERATOR, CONCATENATION_OPERATOR, GROUP_LEFT_OPERATOR,
    GROUP_RIGHT_OPERATOR, ONE_OR_MORE_OPERATOR, UNION_OPERATOR, ZERO_OR_ONE_OPERATOR
} from "./token";

const operatorPriorityMap: { [key: string]: number } = {
    [UNION_OPERATOR]: 1, // |
    [CONCATENATION_OPERATOR]: 2, // .
    [ZERO_OR_ONE_OPERATOR]: 3, // ?
    [ONE_OR_MORE_OPERATOR]: 3, // +
    [CLOSURE_OPERATOR]: 3 // *
};
/**
 * 构建nfa tree
 * @param exp 后缀表达式 a*f·ab|·        abc ===> ab.c.
 */
export const buildToNFA = (exp: string): NFA => {
    const stack: NFA[] = [];

    for (const token of exp) {
        if (token === UNION_OPERATOR) {
            const bNFA = stack.pop();
            const aNFA = stack.pop();
            stack.push(NFA.union(aNFA, bNFA));
        } else if (token === CONCATENATION_OPERATOR) {
            const bNFA = stack.pop();
            const aNFA = stack.pop();
            stack.push(NFA.concat(aNFA, bNFA));
        } else if (token === CLOSURE_OPERATOR) {
            const nfa = stack.pop();
            stack.push(NFA.closure(nfa));
        } else if (token === ZERO_OR_ONE_OPERATOR) {
            const nfa = stack.pop();
            stack.push(NFA.zeroOrOne(nfa));
        } else if (token === ONE_OR_MORE_OPERATOR) {
            const nfa = stack.pop();
            stack.push(NFA.oneOrMore(nfa));
        } else {
            stack.push(NFA.createBasicNFA(token));
        }
    }
    return stack.pop();
};

/**
 * 正则表达式转前缀表达式
 * @param exp 正则表达式
 */
export const insertExplicitConcatOperator = (exp: string): string => {
    let output = "";

    for (let i = 0; i < exp.length; i++) {
        const token = exp[i];
        output += token;

        if (token === GROUP_LEFT_OPERATOR || token === UNION_OPERATOR) {
            continue;
        }

        if (i < exp.length - 1) {
            const lookahead = exp[i + 1];
            // * ? + ) |
            if (lookahead === CLOSURE_OPERATOR ||
                lookahead === ZERO_OR_ONE_OPERATOR ||
                lookahead === ONE_OR_MORE_OPERATOR ||
                lookahead === GROUP_RIGHT_OPERATOR ||
                lookahead === UNION_OPERATOR) {
                continue;
            }
            // ( [0-9a-zA-Z]
            output += CONCATENATION_OPERATOR;
        }
    }

    return output;
};

const getStackTop = (stack: string[]): string => stack.length && stack[stack.length - 1];
/**
 * 前缀表达式转后缀表达式
 * @param exp 前缀表达式
 */
export const infixToPostfix = (exp: string): string => {
    let output = "";
    const stack = [];

    for (const token of exp) {
        if (token === GROUP_RIGHT_OPERATOR) {
            while (getStackTop(stack) !== GROUP_LEFT_OPERATOR) {
                output += stack.pop();
            }
            stack.pop();
        } else if (
            // . | * ? +
            token === CONCATENATION_OPERATOR ||
            token === UNION_OPERATOR ||
            token === CLOSURE_OPERATOR ||
            token === ZERO_OR_ONE_OPERATOR ||
            token === ONE_OR_MORE_OPERATOR
        ) {
            while (
                operatorPriorityMap[getStackTop(stack)] &&
                operatorPriorityMap[getStackTop(stack)] >= operatorPriorityMap[token]
            ) {
                output += stack.pop();
            }
            stack.push(token);
        } else if (token === GROUP_LEFT_OPERATOR) {
            stack.push(token);
        } else {
            output += token;
        }
    }

    while (stack.length) {
        output += stack.pop();
    }

    return output;
};
