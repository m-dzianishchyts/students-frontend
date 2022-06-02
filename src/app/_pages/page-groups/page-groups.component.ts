import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";

import { Group } from "../../_models/group";
import { BackEndService } from "../../_services/back-end.service";
import { CreateGroupDialogComponent, GroupInfo } from "../../_dialogs/create-group-dialog/create-group-dialog.component";

@Component({
    selector: "app-page-groups",
    templateUrl: "./page-groups.component.html",
    styleUrls: ["./page-groups.component.scss"],
})
export class PageGroupsComponent implements OnInit {
    userGroups: Group[];

    constructor(private dialog: MatDialog, private backEndService: BackEndService) {
        this.userGroups = [];
    }

    ngOnInit(): void {
        this.userGroups = [];
        this.backEndService.fetchUserGroups().subscribe((userGroups) => (this.userGroups = userGroups));
    }

    showCreateGroupDialog() {
        const dialogRef = this.dialog.open(CreateGroupDialogComponent);
        dialogRef.afterClosed().subscribe((groupInfo: GroupInfo | null) => {
            if (groupInfo) {
                this.backEndService.createGroup(groupInfo).subscribe(groups => this.userGroups = groups);
            }
        });
    }
}
