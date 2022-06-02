import { UserName } from "./user";

export interface QueueMember {
    id: string;
    name: UserName;
    status: boolean;
}

export interface Queue {
    id: string;
    name: string;
    members: QueueMember[];
    createdAt: Date;
}

export interface LightWeightQueueMember {
    userId: string;
    status: boolean;
}

export interface PerspectiveQueue {
    id: string;
    name: string;
    size?: number;
    position?: number;
    status?: boolean;
    createdAt: Date;
}
