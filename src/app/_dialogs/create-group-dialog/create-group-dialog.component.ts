import { Component, OnInit } from '@angular/core';

export interface GroupInfo {
    name: string;
}

@Component({
  selector: 'app-create-group-dialog',
  templateUrl: './create-group-dialog.component.html',
  styleUrls: ['./create-group-dialog.component.scss']
})
export class CreateGroupDialogComponent implements OnInit {
    groupInfo: GroupInfo = { name: "" };

    constructor() {}

    ngOnInit(): void {}
}
