import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, lastValueFrom, Observable, Subject } from "rxjs";
import { map, mergeMap, share } from "rxjs/operators";

import { User } from "../_models/user";
import { Group } from "../_models/group";
import { environment } from "../../environments/environment";
import { LightWeightQueueMember, PerspectiveQueue, Queue, QueueMember } from "../_models/queue";
import { QueueInfo } from "../_dialogs/create-queue-dialog/create-queue-dialog.component";
import { GroupInfo } from "../_dialogs/create-group-dialog/create-group-dialog.component";

@Injectable({ providedIn: "root" })
export class BackEndService {
    userSubject = new BehaviorSubject<User | undefined>(undefined);
    groupSubject = new BehaviorSubject<Group | undefined>(undefined);
    queueSubject = new BehaviorSubject<Queue | undefined>(undefined);
    queueMemberInActionSubject = new Subject<QueueMember | undefined>();

    constructor(private http: HttpClient) {
        this.userSubject.subscribe((user) => console.log(user));
        this.groupSubject.subscribe((group) => console.log(group));
        this.queueSubject.subscribe((queue) => console.log(queue));
        this.refreshUser();
    }

    fetchUserGroups() {
        console.log("Fetching groups...");
        const user = this.userSubject.getValue();
        if (!user) {
            throw new Error("User is undefined!");
        }
        return this.http.get<Group[]>(`${environment.apiUrl}/users/${user.id}/groups`, { withCredentials: true }).pipe(share());
    }

    fetchGroupQueuesPerspective() {
        console.log("Fetching queues...");
        const group = this.groupSubject.getValue();
        if (!group) {
            throw new Error("Group is undefined!");
        }
        const user = this.userSubject.getValue();
        if (!user) {
            throw new Error("User is undefined!");
        }
        return this.http
            .get<PerspectiveQueue[]>(`${environment.apiUrl}/groups/${group.id}/queues/perspective/${user.id}`, {
                withCredentials: true,
            })
            .pipe(share());
    }

    fetchGroupUsers(): Observable<User[]> {
        console.log("Fetching users...");
        const group = this.groupSubject.getValue();
        if (!group) {
            throw new Error("Group is undefined!");
        }
        return this.http.get<User[]>(`${environment.apiUrl}/groups/${group.id}/members`, { withCredentials: true }).pipe(share());
    }

    fetchQueueUsers(queueId: string | undefined): Observable<User[]> {
        console.log("Fetching members...");
        const queue = this.queueSubject.getValue();
        const neededId = queueId ? queueId : queue?.id;
        if (!neededId) {
            throw new Error("Queue in undefined!");
        }

        return this.http
            .get<User[]>(`${environment.apiUrl}/queues/${neededId}/members`, {
                withCredentials: true,
            })
            .pipe(share());
    }

    async refreshUser(): Promise<void> {
        const user = await lastValueFrom(this.fetchUser());
        this.userSubject.next(user);
    }

    createQueue(queueInfo: QueueInfo, groupId?: string) {
        const group = this.groupSubject.getValue();
        const neededGroupId = groupId ? groupId : group?.id;
        if (!neededGroupId) {
            throw new Error("Group is undefined!");
        }
        const observableQueue = this.requestQueueCreate(neededGroupId, queueInfo);
        observableQueue.subscribe(() => this.refreshGroup());
        return observableQueue;
    }

    createGroup(groupInfo: GroupInfo) {
        return this.requestGroupCreate(groupInfo)
            .pipe(mergeMap(() => this.fetchUserGroups()))
            .pipe(share());
    }

    refreshGroup(groupId?: string) {
        const group = this.groupSubject.getValue();
        const neededGroupId = groupId ? groupId : group?.id;
        if (!neededGroupId) {
            throw new Error("Group is undefined!");
        }
        this.fetchGroup(neededGroupId).subscribe((waitedGroup) => this.groupSubject.next(waitedGroup));
    }

    refreshGroupByQueue(queueId: string) {
        if (this.groupSubject.getValue()) {
            this.refreshGroup();
        } else {
            this.fetchGroupByQueue(queueId).subscribe((group) => this.groupSubject.next(group));
        }
    }

    refreshQueue(queueId?: string) {
        const queue = this.queueSubject.getValue();
        const neededQueueId = queueId ? queueId : queue?.id;
        if (!neededQueueId) {
            throw new Error("Queue is undefined!");
        }
        this.fetchQueue(neededQueueId).subscribe((waitedQueue) => this.queueSubject.next(waitedQueue));
    }

    shuffleQueue() {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue in undefined!");
        }
        const queueObservable = this.requestQueueShuffle(queue.id);
        queueObservable.subscribe((waitedQueue) => this.queueSubject.next(waitedQueue));
        return queueObservable;
    }

    fetchGroupByQueue(queueId: string): Observable<Group> {
        console.log("Fetching group from queue...");
        return this.http
            .get<Group>(`${environment.apiUrl}/queues/${queueId}/group`, {
                withCredentials: true,
            })
            .pipe(share());
    }

    rotateQueue() {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue is undefined!");
        }
        const queueObservable = this.requestQueueRotate(queue.id);
        queueObservable.subscribe((waitedQueue) => {
            if (!waitedQueue) {
                this.queueMemberInActionSubject.next(undefined);
                return;
            }
            this.queueSubject.next(waitedQueue);
            const nextMember = waitedQueue.members[waitedQueue.members.length - 1];
            this.queueMemberInActionSubject.next(nextMember);
        });
        return queueObservable;
    }

    showQueueMember() {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue is undefined!");
        }
        const user = this.userSubject.getValue();
        if (!user) {
            throw new Error("User is undefined!");
        }
        return this.fetchQueueMember(queue.id, user.id);
    }

    addMemberToQueue(user: User) {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue is undefined!");
        }
        const queueId = queue.id;
        const queueMemberObservable = this.requestQueueAddMember(queueId, user.id);
        queueMemberObservable.subscribe(() => this.fetchQueue(queue.id).subscribe((waitedQueue) => this.queueSubject.next(waitedQueue)));
        return queueMemberObservable;
    }

    addUserToGroup(userEmail: string) {
        const group = this.groupSubject.getValue();
        if (!group) {
            throw new Error("Group is undefined!");
        }
        const observable = this.requestGroupAddUser(group.id, userEmail);
        observable.subscribe(() => this.refreshGroup());
        return observable;
    }

    removeMemberFromQueue(userId?: string) {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue is undefined!");
        }
        const user = this.userSubject.getValue();
        const neededUserId = userId ? userId : user?.id;
        if (!neededUserId) {
            throw new Error("User is undefined!");
        }
        const queueId = queue.id;
        const responseObservable = this.requestQueueRemoveMember(queueId, neededUserId);
        responseObservable.subscribe(() => this.refreshQueue(queueId));
        return responseObservable;
    }

    removeMemberFromGroup(userId?: string) {
        const group = this.groupSubject.getValue();
        if (!group) {
            throw new Error("Group is undefined!");
        }
        const user = this.userSubject.getValue();
        const neededUserId = userId ? userId : user?.id;
        if (!neededUserId) {
            throw new Error("User is undefined!");
        }
        const groupId = group.id;
        const responseObservable = this.requestGroupRemoveMember(groupId, neededUserId);
        responseObservable.subscribe(() => this.refreshGroup(groupId));
        return responseObservable;
    }

    setStatusInQueue(queueId: string, status: boolean) {
        const user = this.userSubject.getValue();
        if (!user) {
            throw new Error("User is undefined!");
        }
        const userId = user.id;
        return this.requestQueueMemberStatusUpdate(queueId, userId, status).pipe(map((member) => member.status));
    }

    setQueueMemberStatus(userId: string, status: boolean) {
        const queue = this.queueSubject.getValue();
        if (!queue) {
            throw new Error("Queue is undefined!");
        }
        const queueId = queue.id;
        return this.requestQueueMemberStatusUpdate(queueId, userId, status).pipe(map((member) => member.status));
    }

    leaveQueue(userId?: string) {
        const observableResult = this.removeMemberFromQueue(userId);
        observableResult.subscribe(() => this.queueSubject.next(undefined));
        return observableResult;
    }

    leaveGroup(userId?: string) {
        const observableResult = this.removeMemberFromGroup(userId);
        observableResult.subscribe(() => this.groupSubject.next(undefined));
        return observableResult;
    }

    deleteQueue(groupId?: string, queueId?: string) {
        const group = this.groupSubject.getValue();
        const neededGroupId = groupId ? groupId : group?.id;
        if (!neededGroupId) {
            throw new Error("Group is undefined!");
        }
        const queue = this.queueSubject.getValue();
        const neededQueueId = queueId ? queueId : queue?.id;
        if (!neededQueueId) {
            throw new Error("Queue is undefined!");
        }
        return this.requestQueueDelete(neededGroupId, neededQueueId).pipe(map(() => this.queueSubject.next(undefined)));
    }

    deleteGroup(groupId?: string) {
        const group = this.groupSubject.getValue();
        const neededGroupId = groupId ? groupId : group?.id;
        if (!neededGroupId) {
            throw new Error("Group is undefined!");
        }
        return this.requestGroupDelete(neededGroupId).pipe(map(() => this.groupSubject.next(undefined)));
    }

    logout(): void {
        this.userSubject.next(undefined);
    }

    private fetchUser() {
        console.log("Fetching user...");
        return this.http.get<User>(`${environment.apiUrl}/users/token`, { withCredentials: true }).pipe(share());
    }

    private fetchGroup(groupId: string) {
        console.log("Fetching group...");
        return this.http.get<Group>(`${environment.apiUrl}/groups/${groupId}`, { withCredentials: true }).pipe(share());
    }

    private fetchQueue(queueId: string) {
        console.log("Fetching queue...");
        return this.http.get<Queue>(`${environment.apiUrl}/queues/${queueId}`, { withCredentials: true }).pipe(share());
    }

    private fetchQueueMember(queueId: string, userId: string) {
        console.log("Fetching queue member...");
        return this.http
            .get<LightWeightQueueMember>(`${environment.apiUrl}/queues/${queueId}/members/${userId}`, {
                withCredentials: true,
            })
            .pipe(share());
    }

    private requestQueueCreate(groupId: string, queueInfo: QueueInfo) {
        console.log("Creating queue...");
        return this.http.post<Queue>(`${environment.apiUrl}/groups/${groupId}/queues`, queueInfo, { withCredentials: true }).pipe(share());
    }

    private requestQueueShuffle(queueId: string) {
        console.log("Shuffling queue...");
        return this.http.post<Queue>(`${environment.apiUrl}/queues/${queueId}/shuffle`, null, { withCredentials: true }).pipe(share());
    }

    private requestQueueRotate(queueId: string) {
        console.log("Rotating queue...");
        return this.http.post<Queue>(`${environment.apiUrl}/queues/${queueId}/rotate`, null, { withCredentials: true }).pipe(share());
    }

    private requestQueueAddMember(queueId: string, userId: string) {
        console.log("Adding queue member...");
        return this.http
            .put<QueueMember>(`${environment.apiUrl}/queues/${queueId}/members/${userId}`, null, { withCredentials: true })
            .pipe(share());
    }

    private requestQueueRemoveMember(queueId: string, userId: string) {
        console.log("Removing queue member...");
        return this.http.delete<void>(`${environment.apiUrl}/queues/${queueId}/members/${userId}`, { withCredentials: true }).pipe(share());
    }

    private requestQueueMemberStatusUpdate(queueId: string, userId: string, status: boolean) {
        console.log("Setting member status...");
        return this.http
            .patch<{ id: string; status: boolean }>(
                `${environment.apiUrl}/queues/${queueId}/members/${userId}`,
                { status: status },
                { withCredentials: true }
            )
            .pipe(share());
    }

    private requestQueueDelete(groupId: string, queueId: string) {
        console.log("Deleting queue...");
        return this.http.delete<void>(`${environment.apiUrl}/groups/${groupId}/queues/${queueId}`, { withCredentials: true }).pipe(share());
    }

    private requestGroupCreate(groupInfo: GroupInfo) {
        console.log("Creating group...");
        return this.http.post<Group>(`${environment.apiUrl}/groups`, groupInfo, { withCredentials: true }).pipe(share());
    }

    private requestGroupAddUser(groupId: string, userEmail: string) {
        console.log("Adding user to group...");
        return this.http
            .put<void>(`${environment.apiUrl}/groups/${groupId}/members/email`, { email: userEmail }, { withCredentials: true })
            .pipe(share());
    }

    private requestGroupRemoveMember(groupId: string, userId: string) {
        console.log("Removing member from group...");
        return this.http.delete<void>(`${environment.apiUrl}/groups/${groupId}/members/${userId}`, { withCredentials: true }).pipe(share());
    }

    private requestGroupDelete(groupId: string) {
        console.log("Deleting group...");
        return this.http.delete<void>(`${environment.apiUrl}/groups/${groupId}`, { withCredentials: true }).pipe(share());
    }
}
