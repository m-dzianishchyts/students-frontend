import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";

import { compareUsers, User } from "../../_models/user";
import { Queue } from "../../_models/queue";
import { BackEndService } from "../../_services/back-end.service";
import { Subscription } from "rxjs";

@Component({
    selector: "app-queue-add-dialog",
    templateUrl: "./queue-add-dialog.component.html",
    styleUrls: ["./queue-add-dialog.component.scss"],
})
export class QueueAddDialogComponent implements OnInit, OnDestroy {
    queue?: Queue;
    groupUsers?: User[];
    selectedUser?: User;

    subscriptions: Subscription[] = [];

    constructor(private dialogRef: MatDialogRef<QueueAddDialogComponent, User>, private backEndService: BackEndService) {
        this.subscriptions = [this.backEndService.queueSubject.subscribe((queue) => (this.queue = queue))];
    }

    ngOnInit(): void {
        this.backEndService.fetchGroupUsers().subscribe((groupUsers) => (this.groupUsers = groupUsers));
        this.backEndService.refreshQueue();
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    groupUsersNotInQueue() {
        if (this.queue === undefined || this.groupUsers === undefined) {
            console.log("groupUsersNotInQueue:", undefined);
            return undefined;
        }
        const queueMembersIds = this.queue.members.map((member) => member.id);
        const groupUsersNotInQueue = this.groupUsers.filter((user) => !queueMembersIds.includes(user.id));
        return groupUsersNotInQueue.sort(compareUsers);
    }

    nameAndEmail(user: User) {
        return `${user.name.first} ${user.name.last} (${user.email})`;
    }
}
