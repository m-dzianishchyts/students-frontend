export interface UserName {
    first: string;
    last: string;
}

export interface User {
    id: string;
    name: UserName;
    email: string;
    groups: string[];
    createdAt: Date;
    updatedAt: Date;
}
