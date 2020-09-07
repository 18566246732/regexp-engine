import { NFA } from "./nfa";
import { State } from "./state";

export class DFA extends NFA {
    constructor(startState: State, endState: State) {
        super(startState, endState);
    }
    public match(str: string) {
        const startState = this.startState;
        let currentStates = startState;
        for (const token of str) {
            if (currentStates.transition[token]) {
                currentStates = currentStates.transition[token];
                if (currentStates.isEnd) {
                    return true;
                }
            } else {
                return false;
            }
        }
        return true;
    }
    public buildDFAUnit(nfa: NFA, state: State) {
        if (state.isEnd) {
            // 删除epsilon
            delete state.epsilonTransition;
            return;
        }
        const currentStates = nfa.getClosure(state);
        const main = currentStates[0];
        // 删除epsilon
        delete main.epsilonTransition;
        // 获取nextStates，可能是[]
        const nextStates = currentStates.slice(1);
        nextStates.forEach((nextState: any) => {
            const object = nextState.transition;
            for (const key in object) {
                if (object.hasOwnProperty(key)) {
                    // 合并transition
                    main.addTransition(key, object[key]);
                }
            }
        });
        // 递归的合并transition
        Object.values(main.transition).forEach((innerState: State) => {
            this.buildDFAUnit(nfa, innerState);
        });
        return nfa;
    }
}
