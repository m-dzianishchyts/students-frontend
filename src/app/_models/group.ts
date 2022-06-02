export interface Group {
    id: string;
    name: string;
    creator: string;
    members: string[];
    queues: string[];
    createdAt: Date;
}
