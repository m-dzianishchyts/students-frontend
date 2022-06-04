import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { NGXLogger } from "ngx-logger";
import { Subscription } from "rxjs";

import { User } from "../../_models/user";
import { Group } from "../../_models/group";
import { Queue } from "../../_models/queue";
import { QueueAddDialogComponent } from "../../_dialogs/queue-add-dialog/queue-add-dialog.component";
import { BackEndService } from "../../_services/back-end.service";
import { ConfirmationDialogComponent } from "../../_dialogs/confirmation-dialog/confirmation-dialog.component";
import { DefaultSnackBarConfig } from "../../_services/snack-bar.service";

@Component({
    selector: "app-page-queue",
    templateUrl: "./page-queue.component.html",
    styleUrls: ["./page-queue.component.scss"],
})
export class PageQueueComponent implements OnInit, OnDestroy {
    displayedColumns = ["position", "name", "status"];
    selectedUser?: User;

    group?: Group;
    queue?: Queue;

    private user?: User;
    private subscriptions: Subscription[] = [];

    constructor(
        private logger: NGXLogger,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private router: Router,
        private route: ActivatedRoute,
        private backEndService: BackEndService
    ) {
        logger.partialUpdateConfig({ context: PageQueueComponent.name });
        this.subscriptions.push(
            this.backEndService.userSubject.subscribe((user) => (this.user = user)),
            this.backEndService.groupSubject.subscribe((group) => (this.group = group)),
            this.backEndService.queueSubject.subscribe((queue) => (this.queue = queue)),
            this.backEndService.queueMemberInActionSubject.subscribe((nextQueueMember) => {
                const message = !nextQueueMember
                    ? "No one is ready now."
                    : `${nextQueueMember.name.first} ${nextQueueMember.name.last} is going into action!`;
                snackBar.open(message, "Ok", { ...DefaultSnackBarConfig, duration: 5000 });
            })
        );
    }

    ngOnInit(): void {
        const queueId = this.route.snapshot.params["id"];
        if (!queueId) {
            throw Error("Queue id is not provided!");
        }

        this.backEndService.refreshGroupByQueue(queueId);
        this.backEndService.refreshQueue(queueId);
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    rotate() {
        this.backEndService.rotateQueue();
    }

    shuffle() {
        this.backEndService.shuffleQueue().subscribe(() => {
            this.snackBar.open("The queue has been shuffled!", "Ok", DefaultSnackBarConfig);
        });
    }

    select(user: User) {
        if (this.isSelected(user)) {
            this.selectedUser = undefined;
        } else {
            this.selectedUser = user;
        }
    }

    isSelected(user: User) {
        return this.selectedUser === user;
    }

    isCreator() {
        if (!this.user || !this.group) {
            return false;
        }
        return this.group.creator == this.user.id;
    }

    isMember() {
        if (!this.user || !this.queue) {
            return false;
        }
        const queueMembersIds = this.queue.members.map((user) => user.id);
        return queueMembersIds.includes(this.user.id);
    }

    showAddMemberDialog() {
        this.dialog
            .open(QueueAddDialogComponent)
            .afterClosed()
            .subscribe((user: User | null) => {
                if (!user) {
                    return;
                }
                this.backEndService.addMemberToQueue(user).subscribe(() => {
                    this.snackBar.open(`${user.name.first} ${user.name.last} has been added to the queue.`, "Ok", {
                        ...DefaultSnackBarConfig,
                    });
                });
            });
    }

    showRemoveMemberConfirmationDialog() {
        const userToRemove = this.selectedUser;
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to remove ${userToRemove?.name.first} ${this.selectedUser?.name.last} from the queue?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && userToRemove) {
                this.backEndService.removeMemberFromQueue(userToRemove.id).subscribe(() => {
                    this.snackBar.open(
                        `${userToRemove.name.first} ${userToRemove.name.last} has been removed from the queue!`,
                        "Ok",
                        DefaultSnackBarConfig
                    );
                });
            }
        });
    }

    setMemberStatus(event: Event, userId: string, status: boolean) {
        event.stopPropagation();
        if (!this.isCreator()) {
            return;
        }
        this.backEndService.setQueueMemberStatus(userId, status).subscribe((updatedStatus) => {
            this.queue?.members.filter((member) => member.id === userId).forEach((member) => (member.status = updatedStatus));
        });
    }

    showDeleteQueueConfirmationDialog() {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to delete ${this.queue?.name} queue?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.group && this.queue) {
                const deletedQueue = this.queue;
                const groupId = this.group.id;
                this.backEndService.deleteQueue().subscribe(() => {
                    this.router.navigateByUrl(`/group/${groupId}`);
                    this.snackBar.open(`'${deletedQueue.name}' queue has been deleted!`, "Ok", DefaultSnackBarConfig);
                });
            }
        });
    }

    showLeaveQueueConfirmationDialog() {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to leave ${this.queue?.name} queue?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.group && this.queue) {
                const leftQueue = this.queue;
                const groupId = this.group.id;
                this.backEndService.leaveQueue().subscribe(() => {
                    this.router.navigateByUrl(`/group/${groupId}`);
                    this.snackBar.open(`You have left '${leftQueue.name}' queue!`, "Ok", DefaultSnackBarConfig);
                });
            }
        });
    }

    backToGroup() {
        this.router.navigateByUrl(`/group/${this.group?.id}`);
    }
}
