import { User } from "./user.js";

export class Queue {
    constructor(public name: string, public members: User[], public createdAt: Date) {
    }
}
