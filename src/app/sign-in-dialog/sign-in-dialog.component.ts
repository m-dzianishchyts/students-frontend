import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { finalize, switchMap } from "rxjs/operators";

import { MatDialogRef } from "@angular/material/dialog";

import { User } from "../../_models/user";
import { AuthenticationService } from "../../_services/authentication.service";
import { AuthenticationDialog } from "../authentication-dialog/authentication-dialog";
import { UserService } from "../../_services/user.service";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";

@Component({
    selector: "app-sign-in-dialog",
    templateUrl: "./sign-in-dialog.component.html",
    styleUrls: ["./sign-in-dialog.component.scss"],
})
export class SignInDialogComponent extends AuthenticationDialog {
    signInForm!: FormGroup;
    loading = false;
    error: string | null = null;

    userCredentials = {
        email: "",
        password: "",
    };

    @Output("formSuccess") dialogCloseRequest = new EventEmitter<User>();

    constructor(
        public dialogRef: MatDialogRef<SignInDialogComponent>,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService
    ) {
        super();
        if (this.userService.userInfo.getValue()) {
            this.router.navigateByUrl("/");
        }
    }

    ngOnInit() {
        this.initForm();
    }

    get form() {
        return this.signInForm;
    }

    get controls() {
        return this.signInForm.controls;
    }

    submitError() {
        return this.error;
    }

    override onSubmit() {
        this.loading = true;
        this.error = null;
        this.authenticationService
            .authenticate(this.userCredentials.email, this.userCredentials.password)
            .pipe(switchMap(() => this.userService.fetchUserInfo()))
            .pipe(finalize(() => (this.loading = false)))
            .subscribe({
                next: (user: User) => {
                    this.userService.saveUserToLocalStorage(user);
                    this.dialogRef.close();
                    this.router.navigate(["/profile"]);
                    console.log(user);
                },
                error: (error) => {
                    if (error instanceof HttpErrorResponse) {
                        switch (error.status) {
                            case HttpStatusCode.Unauthorized:
                                this.error = "Incorrect email or password."
                                break;
                            case HttpStatusCode.InternalServerError:
                                this.error = "Server error. Try again later."
                                break;
                            default:
                                this.error = AuthenticationDialog.generalError;
                        }
                    } else {
                        this.error = AuthenticationDialog.generalError;
                        console.error(error.constructor.name);
                    }
                    console.error(error);
                },
            });
    }

    private initForm(): void {
        this.signInForm = this.formBuilder.group({
            email: ["", [Validators.required, Validators.email]],
            password: [
                "",
                [
                    Validators.required,
                    Validators.minLength(SignInDialogComponent.passwordMinLength),
                    Validators.maxLength(SignInDialogComponent.passwordMaxLength),
                    Validators.pattern(SignInDialogComponent.passwordPattern),
                ],
            ],
        });
        this.signInForm.controls["email"].valueChanges.subscribe({ next: (value) => (this.userCredentials.email = value) });
        this.signInForm.controls["password"].valueChanges.subscribe({ next: (value) => (this.userCredentials.password = value) });
    }
}
