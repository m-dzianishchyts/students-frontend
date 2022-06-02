import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, Subscription } from "rxjs";

import { Group } from "../../_models/group";
import { User } from "../../_models/user";
import { PerspectiveQueue } from "../../_models/queue";
import { BackEndService } from "../../_services/back-end.service";
import { CreateQueueDialogComponent, QueueInfo } from "../../_dialogs/create-queue-dialog/create-queue-dialog.component";
import { ConfirmationDialogComponent } from "../../_dialogs/confirmation-dialog/confirmation-dialog.component";
import { GroupAddDialogComponent } from "../../_dialogs/group-add-dialog/group-add-dialog.component";

@Component({
    selector: "app-page-group",
    templateUrl: "./page-group.component.html",
    styleUrls: ["./page-group.component.scss"],
})
export class PageGroupComponent implements OnInit, OnDestroy {
    displayedColumns = ["position", "name", "email"];
    selectedUser?: User;
    groupUsers?: User[];
    groupQueues?: PerspectiveQueue[];

    groupSubject = new BehaviorSubject<Group | undefined>(undefined);

    private user?: User;
    private subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute, private router: Router, private dialog: MatDialog, private backEndService: BackEndService) {
        console.log("Group constructor", this.groupUsers, this.groupQueues);
        backEndService.groupSubject.subscribe((group) => this.groupSubject.next(group));
        this.subscriptions.push(
            this.backEndService.userSubject.subscribe((user) => (this.user = user)),
            this.groupSubject.subscribe((group) => {
                if (!group) {
                    this.groupUsers = [];
                    this.groupQueues = [];
                } else {
                    backEndService.fetchGroupUsers().subscribe((groupUsers) => (this.groupUsers = groupUsers));
                    const a = backEndService.fetchGroupQueuesPerspective();
                    a.subscribe((groupQueues) => (this.groupQueues = groupQueues));
                    a.subscribe((groupQueues) => console.log(groupQueues));
                }
            })
        );
    }

    ngOnInit(): void {
        console.log("Group ngOnInit", this.groupUsers, this.groupQueues);
        const groupId = this.route.snapshot.params["id"];
        if (!groupId) {
            throw new Error("Group id is not provided!");
        }

        this.groupSubject.next(undefined);
        this.backEndService.refreshGroup(groupId);
    }

    ngOnDestroy() {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    }

    group(): Group | undefined {
        return this.groupSubject.getValue();
    }

    belongsToQueue(queue: PerspectiveQueue): boolean {
        return queue.position !== undefined;
    }

    isCreator(): boolean {
        const group = this.group();
        if (!this.user || !group) {
            return false;
        }
        return group.creator == this.user.id;
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

    getGroupUsers() {
        return this.groupUsers ?? [];
    }

    isGroupLoaded() {
        return this.group() && this.groupUsers && this.groupQueues;
    }

    sortGroupQueues() {
        return this.groupQueues?.sort(this.queueBelongingComparator) ?? [];
    }

    setStatusInQueue(event: Event, queue: PerspectiveQueue, status: boolean) {
        event.stopPropagation();
        this.backEndService.setStatusInQueue(queue.id, status).subscribe((updatedStatus) => (queue.status = updatedStatus));
    }

    showCreateQueueDialog() {
        const dialogRef = this.dialog.open(CreateQueueDialogComponent);
        dialogRef.afterClosed().subscribe((queueInfo: QueueInfo | null) => {
            if (queueInfo) {
                const groupId = this.group()?.id;
                this.backEndService.createQueue(queueInfo, groupId);
            }
        });
    }

    showDeleteGroupConfirmationDialog() {
        const group = this.group();
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to delete ${group?.name} group?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && group) {
                this.backEndService.deleteGroup().subscribe(() => this.router.navigateByUrl(`/groups`));
            }
        });
    }

    showLeaveGroupConfirmationDialog() {
        const group = this.group();
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to leave ${group?.name} group?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && group) {
                this.backEndService.leaveGroup().subscribe(() => this.router.navigateByUrl(`/groups`));
            }
        });
    }

    private queueBelongingComparator = <Q extends PerspectiveQueue>(queueA: Q, queueB: Q) => {
        if (!this.belongsToQueue(queueA) && this.belongsToQueue(queueB)) {
            return 1;
        }
        if (this.belongsToQueue(queueA) && !this.belongsToQueue(queueB)) {
            return -1;
        }
        return 0;
    };

    backToGroups() {
        this.router.navigateByUrl("/groups");
    }

    showAddMemberDialog() {
        const dialogRef = this.dialog.open(GroupAddDialogComponent);
        dialogRef.afterClosed().subscribe((userEmail: string | null) => {
            if (userEmail) {
                this.backEndService.addUserToGroup(userEmail);
            }
        });
    }

    showRemoveMemberConfirmationDialog() {
        const confirmationDialogRef = this.dialog.open(ConfirmationDialogComponent);
        confirmationDialogRef.componentInstance.title = "Warning";
        confirmationDialogRef.componentInstance.message = `Are you sure you want to remove ${this.selectedUser?.name.first} ${this.selectedUser?.name.last} from the group?`;
        confirmationDialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed && this.selectedUser) {
                this.backEndService.removeMemberFromGroup(this.selectedUser.id);
            }
        });
    }
}
