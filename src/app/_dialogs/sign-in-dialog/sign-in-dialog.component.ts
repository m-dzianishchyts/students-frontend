import { Component, EventEmitter, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";

import { User } from "../../_models/user";
import { AuthenticationService } from "../../_services/authentication.service";
import { AuthenticationDialog } from "../authentication-dialog/authentication-dialog";
import { BackEndService } from "../../_services/back-end.service";
import { SignUpDialogComponent } from "../sign-up-dialog/sign-up-dialog.component";

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
        private dialogRef: MatDialogRef<SignInDialogComponent>,
        private dialog: MatDialog,
        private formBuilder: FormBuilder,
        private router: Router,
        private authenticationService: AuthenticationService,
        private backEndService: BackEndService
    ) {
        super();
        if (this.backEndService.userSubject.getValue()) {
            router.navigateByUrl("/");
        }
    }

    get form() {
        return this.signInForm;
    }

    get controls() {
        return this.signInForm.controls;
    }

    ngOnInit() {
        this.initForm();
    }

    submitError() {
        return this.error;
    }

    override onSubmit(): void {
        this.loading = true;
        this.error = null;
        lastValueFrom(this.authenticationService.authenticate(this.userCredentials.email, this.userCredentials.password))
            .then(() => this.backEndService.refreshUser())
            .then(() => {
                this.dialogRef.close();
                this.router.navigateByUrl("/groups");
            })
            .catch((error) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case HttpStatusCode.Unauthorized:
                            this.error = "Incorrect email or password.";
                            break;
                        case HttpStatusCode.InternalServerError:
                            this.error = "Server error. Try again later.";
                            break;
                        default:
                            this.error = AuthenticationDialog.generalError;
                    }
                } else {
                    this.error = AuthenticationDialog.generalError;
                }
                console.error(error);
            })
            .finally(() => (this.loading = false));
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

    switchToSignUpDialog() {
        this.dialogRef.close();
        this.dialog.open(SignUpDialogComponent);
    }
}
