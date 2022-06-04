function compareNamesByFirst(nameA: UserName, nameB: UserName) {
    return nameA.first.localeCompare(nameB.first);
}

function compareNamesByLast(nameA: UserName, nameB: UserName) {
    return nameA.last.localeCompare(nameB.last);
}

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

export function compareUserNames(nameA: UserName, nameB: UserName) {
    return compareNamesByLast(nameA, nameB) || compareNamesByFirst(nameA, nameB);
}

export function compareUsers(userA: User, userB: User) {
    return compareUserNames(userA.name, userB.name);
}
