import { system } from "@minecraft/server";

export class Thread {
    #id = null;
    constructor(func, seconds = 0) {
        this.func = func;
        this.second = seconds;
    }

    start() {
        if(this.#id !== null) throw new Error("Thread is already running.");
        if(typeof this.func == "function") {
            this.#id = system.runInterval(() => this.func(), this.second * 20);
        } else {
            throw new Error("Thread cannot be started");
        }
    }

    stop() {
        if(this.#id === null) throw new Error("Thread is not running.");
        system.clearRun(this.#id);
        this.#id = null;
    }
}
