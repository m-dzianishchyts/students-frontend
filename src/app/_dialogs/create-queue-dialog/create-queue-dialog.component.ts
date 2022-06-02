import { Component, OnInit } from "@angular/core";

export interface QueueInfo {
    name: string;
}

@Component({
    selector: "app-create-queue-dialog",
    templateUrl: "./create-queue-dialog.component.html",
    styleUrls: ["./create-queue-dialog.component.scss"],
})
export class CreateQueueDialogComponent implements OnInit {
    queueInfo: QueueInfo = { name: "" };

    constructor() {}

    ngOnInit(): void {}
}
