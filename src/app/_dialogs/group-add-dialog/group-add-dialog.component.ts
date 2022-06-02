import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-add-dialog',
  templateUrl: './group-add-dialog.component.html',
  styleUrls: ['./group-add-dialog.component.scss']
})
export class GroupAddDialogComponent implements OnInit {
    email: string = "";

    constructor() {}

    ngOnInit(): void {}
}
