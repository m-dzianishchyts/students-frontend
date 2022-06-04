import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { lastValueFrom } from "rxjs";

import { User } from "src/app/_models/user";
import { AuthenticationService } from "src/app/_services/authentication.service";
import { AuthenticationDialog } from "../authentication-dialog/authentication-dialog";
import { BackEndService } from "../../_services/back-end.service";
import { SignInDialogComponent } from "../sign-in-dialog/sign-in-dialog.component";

interface UserRegistrationInfo {
    email: string;
    name: { first: string; last: string };
    password: string;
}

@Component({
    selector: "app-sign-up-dialog",
    templateUrl: "./sign-up-dialog.component.html",
    styleUrls: ["./sign-up-dialog.component.scss"],
})
export class SignUpDialogComponent extends AuthenticationDialog implements OnInit {
    signUpForm!: FormGroup;
    loading = false;
    error: string | null = null;

    userRegistrationInfo: UserRegistrationInfo = {
        email: "",
        name: { first: "", last: "" },
        password: "",
    };

    @Output("formSuccess") dialogCloseRequest = new EventEmitter<User>();

    constructor(
        private dialogRef: MatDialogRef<SignUpDialogComponent>,
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
        return this.signUpForm;
    }

    get controls() {
        return this.signUpForm.controls;
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
        lastValueFrom(this.authenticationService.register(this.signUpForm.value))
            .then(() => this.backEndService.refreshUser())
            .then(() => {
                this.dialogRef.close();
                this.router.navigateByUrl("/groups");
            })
            .catch((error) => {
                if (error instanceof HttpErrorResponse) {
                    switch (error.status) {
                        case HttpStatusCode.Conflict:
                            this.error = "A user with this email already exists.";
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
        this.signUpForm = this.formBuilder.group(
            {
                email: ["", [Validators.required, Validators.email]],
                firstName: [
                    "",
                    [
                        Validators.required,
                        Validators.maxLength(AuthenticationDialog.firstNameMaxLength),
                        Validators.pattern(AuthenticationDialog.namePattern),
                    ],
                ],
                lastName: [
                    "",
                    [
                        Validators.required,
                        Validators.maxLength(AuthenticationDialog.lastNameMaxLength),
                        Validators.pattern(AuthenticationDialog.namePattern),
                    ],
                ],
                password: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(AuthenticationDialog.passwordMinLength),
                        Validators.maxLength(AuthenticationDialog.passwordMaxLength),
                        Validators.pattern(AuthenticationDialog.passwordPattern),
                    ],
                ],
                confirmPassword: [
                    "",
                    [
                        Validators.required,
                        Validators.minLength(AuthenticationDialog.passwordMinLength),
                        Validators.maxLength(AuthenticationDialog.passwordMaxLength),
                        Validators.pattern(AuthenticationDialog.passwordPattern),
                    ],
                ],
            },
            { validators: [this.passwordsMatchValidator] }
        );
        this.signUpForm.controls["email"].valueChanges.subscribe({ next: (value) => (this.userRegistrationInfo.email = value) });
        this.signUpForm.controls["firstName"].valueChanges.subscribe({ next: (value) => (this.userRegistrationInfo.name.first = value) });
        this.signUpForm.controls["lastName"].valueChanges.subscribe({ next: (value) => (this.userRegistrationInfo.name.last = value) });
        this.signUpForm.controls["password"].valueChanges.subscribe({ next: (value) => (this.userRegistrationInfo.password = value) });
    }

    private passwordsMatchValidator: ValidatorFn = (): ValidationErrors | null => {
        if (!this.signUpForm) {
            return null;
        }

        const passwordControl = this.signUpForm.controls["password"];
        const confirmPasswordControl = this.signUpForm.controls["confirmPassword"];
        if (passwordControl.pristine || confirmPasswordControl.pristine) {
            return null;
        }

        const password = this.signUpForm.controls["password"].value;
        const confirmPassword = this.signUpForm.controls["confirmPassword"].value;
        const validationErrors =
            password === confirmPassword
                ? null
                : {
                      passwordsMismatch: {
                          password: password,
                          confirmPassword: confirmPassword,
                      },
                  };
        if (!validationErrors) {
            [passwordControl, confirmPasswordControl].forEach((control) => {
                const controlErrors = control.errors;
                delete controlErrors?.["passwordsMismatch"];
                control.setErrors(Object.keys(controlErrors ?? {}).length == 0 ? null : controlErrors);
            });
            console.log(`passwordControl.errors: ${JSON.stringify(passwordControl.errors)}`);
            console.log(`confirmPasswordControl.errors: ${JSON.stringify(confirmPasswordControl.errors)}`);

            return validationErrors;
        }

        [passwordControl, confirmPasswordControl].forEach((control) => {
            const controlErrors: ValidationErrors = {
                ...control.errors,
                ...validationErrors,
            };
            control.setErrors(controlErrors);
        });
        console.log(`passwordControl.errors: ${JSON.stringify(passwordControl.errors)}`);
        console.log(`confirmPasswordControl.errors: ${JSON.stringify(confirmPasswordControl.errors)}`);
        return validationErrors;
    };

    switchToSignInDialog() {
        this.dialogRef.close();
        this.dialog.open(SignInDialogComponent);
    }
}
