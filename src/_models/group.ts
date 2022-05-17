import { User } from "./user.js";

export class Group {
    constructor(public name: string, public members: User[], public createdAt: Date) {
    }
}
