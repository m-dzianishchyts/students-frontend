import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { BackEndService } from "../_services/back-end.service";
import { MatDialog } from "@angular/material/dialog";
import { SignInDialogComponent } from "../_dialogs/sign-in-dialog/sign-in-dialog.component";

@Injectable({
    providedIn: "root",
})
export class AuthenticationGuard implements CanActivate {
    constructor(private dialog: MatDialog, private backEndService: BackEndService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.backEndService.userSubject.getValue()) {
            return true;
        }
        return this.backEndService
            .refreshUser()
            .then(() => true)
            .catch((error) => {
                console.log(error);
                this.dialog.open(SignInDialogComponent);
                return false;
            });
    }
}
