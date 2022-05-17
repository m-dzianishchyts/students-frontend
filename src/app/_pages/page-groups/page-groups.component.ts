import { Component, Inject, LOCALE_ID, OnInit } from "@angular/core";

import { Group } from "../../../_models/group";
import { User } from "../../../_models/user";

@Component({
    selector: "app-page-groups",
    templateUrl: "./page-groups.component.html",
    styleUrls: ["./page-groups.component.scss"],
})
export class PageGroupsComponent implements OnInit {
    groups: Group[] = [
        new Group(
            "Test group",
            [
                new User("123", "test@test.com", { first: "Sasha", last: "Beliy" }, new Date()),
                new User("456", "test@gmail.com", { first: "Sasha", last: "Anton" }, new Date()),
            ],
            new Date(),
        ),
    ];

    constructor(@Inject(LOCALE_ID) public locale: string) {
    }

    ngOnInit(): void {
    }
}
