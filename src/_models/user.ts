export interface UserName {
    first: string;
    last: string;
}

export class User {
    constructor(public _id: string, public email: string, public name: UserName, public createdAt: Date) {}
}
