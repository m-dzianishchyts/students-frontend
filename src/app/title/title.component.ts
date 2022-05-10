import { Component, OnInit, Input } from "@angular/core";

@Component({
    selector: "app-title",
    templateUrl: "./title.component.html",
    styleUrls: ["./title.component.scss"],
})
export class TitleComponent implements OnInit {
    @Input() header: string = "";
    @Input() subheader: string = "";

    ngOnInit(): void { }
}
