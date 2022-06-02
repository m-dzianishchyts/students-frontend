import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: 'app-confirmation-dialog[message]',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
    @Input() title: string = "";
    @Input() message: string = "";

  constructor() { }

  ngOnInit(): void {
  }
}
