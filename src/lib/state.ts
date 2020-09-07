
/**
 * 状态
 */
export class State {
    public isEnd: boolean;
    public transition: { [key: string]: State };
    public epsilonTransition: State[];

    constructor(isEnd: boolean = false) {
        this.isEnd = isEnd;
        this.transition = {};
        this.epsilonTransition = [];
    }
    /**
     * 手动转换
     * @param token 输入
     * @param to 目的状态
     */
    public addTransition(token: string, to: State): State {
        this.transition[token] = to;
        return this;
    }
    /**
     * 自动转换
     * @param to 目的状态
     */
    public addEpsilonTransition(to: State): State {
        this.epsilonTransition.push(to);
        return this;
    }
}
