import { State } from "./state";

export class NFA {
    // 创建一个nfa基本单元
    public static createBasicNFA(token: string | undefined): NFA {
        const startState = new State();
        const endState = new State(true);
        if (token) {
            startState.addTransition(token, endState);
        } else {
            startState.addEpsilonTransition(endState);
        }

        return new NFA(startState, endState);
    }
    // a|b
    public static union(aNFA: NFA, bNFA: NFA): NFA {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(aNFA.startState)
            .addEpsilonTransition(bNFA.startState);
        aNFA.endState.addEpsilonTransition(newEndState).isEnd = false;
        bNFA.endState.addEpsilonTransition(newEndState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }
    // ab
    public static concat(aNFA: NFA, bNFA: NFA): NFA {
        const newStartState = aNFA.startState;
        const newEndState = bNFA.endState;

        aNFA.endState.addEpsilonTransition(bNFA.startState).isEnd = false;

        return new NFA(newStartState, newEndState);
    }
    // a*
    public static closure(nfa: NFA): NFA {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState)
            .addEpsilonTransition(newEndState);
        nfa.endState.addEpsilonTransition(nfa.startState)
            .addEpsilonTransition(newEndState)
            .isEnd = false;

        return new NFA(newStartState, newEndState);
    }
    // a?
    public static zeroOrOne(nfa: NFA): NFA {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState)
            .addEpsilonTransition(newEndState);
        nfa.endState.addEpsilonTransition(newEndState)
            .isEnd = false;

        return new NFA(newStartState, newEndState);
    }
    // a+
    public static oneOrMore(nfa: NFA): NFA {
        const newStartState = new State();
        const newEndState = new State(true);

        newStartState.addEpsilonTransition(nfa.startState);
        nfa.endState.addEpsilonTransition(nfa.startState)
            .addEpsilonTransition(newEndState)
            .isEnd = false;

        return new NFA(newStartState, newEndState);
    }

    public startState: State;
    public endState: State;

    constructor(startState: State, endState: State) {
        this.startState = startState;
        this.endState = endState;
    }
    /**
     * 找到state通过空转换所能到达的所有状态
     * @param state 状态
     */
    public getClosure(state: State): State[] {
        let visited: State[] = [state];
        let closure: State[] = [state];
        while (closure.length) {
            const nextStates = closure.pop().epsilonTransition.filter((item: any) => !visited.includes(item));
            visited = visited.concat(nextStates);
            closure = closure.concat(nextStates);
        }
        return visited;
    }

    /**
     * match
     */
    public match(str: string) {
        const startState = this.startState;
        let currentStates = this.getClosure(startState);

        for (const token of str) {
            let nextStates: State[] = [];

            currentStates.forEach((state: State) => {
                if (state.transition[token]) {
                    const t = this.getClosure(state.transition[token]);
                    nextStates = nextStates.concat(t);
                }
            });
            // 如果检测到下一个state是终点则结束匹配
            if (nextStates.some((state: State) => state.isEnd)) {
                return true;
            }
            currentStates = nextStates;
        }
        return false;
    }
}
