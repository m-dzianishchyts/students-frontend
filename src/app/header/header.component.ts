import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { User } from "../_models/user";
import { SignInDialogComponent } from "../_dialogs/sign-in-dialog/sign-in-dialog.component";
import { SignUpDialogComponent } from "../_dialogs/sign-up-dialog/sign-up-dialog.component";
import { AuthenticationService } from "../_services/authentication.service";
import { BackEndService } from "../_services/back-end.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
    user?: User;

    menuOpened = false;

    constructor(
        private dialog: MatDialog,
        private authenticationService: AuthenticationService,
        private backEndService: BackEndService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.backEndService.userSubject.subscribe((user) => (this.user = user));
    }

    authenticated(): boolean {
        return !!this.user;
    }

    logout(): void {
        this.authenticationService.logout().subscribe({
            next: () => this.router.navigateByUrl("/"),
            error: (error) => console.error(error),
        });
    }

    showSignUpDialog() {
        this.dialog.open(SignUpDialogComponent);
    }

    showSignInDialog() {
        this.dialog.open(SignInDialogComponent);
    }
}
