import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";

import { environment } from "../../environments/environment";

import { User } from "../../_models/user";
import { UserService } from "../../_services/user.service";
import { SignInDialogComponent } from "../sign-in-dialog/sign-in-dialog.component";
import { SignUpDialogComponent } from "../sign-up-dialog/sign-up-dialog.component";
import { AuthenticationService } from "../../_services/authentication.service";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {
    user: User | null = null;

    constructor(
        private dialog: MatDialog,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.userService.userInfo.subscribe({
            next: (user) => {
                this.user = user;
            },
            error: (error) => {
                console.error(error.constructor.name);
                console.error(error);
            },
        });
    }

    authenticated() {
        return !!this.user;
    }

    logout() {
        this.authenticationService.logout().subscribe({
            next: () => {
                this.router.navigateByUrl(`${environment.apiUrl}/`);
            },
            error: (error) => {
                console.error(error);
            }
        });
    }

    openSignUpDialog() {
        this.dialog.open(SignUpDialogComponent);
    }

    openSignInDialog() {
        this.dialog.open(SignInDialogComponent);
    }
}
