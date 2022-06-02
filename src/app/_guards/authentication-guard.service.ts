import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { BackEndService } from "../_services/back-end.service";

@Injectable({
    providedIn: "root",
})
export class AuthenticationGuard implements CanActivate {
    constructor(private backEndService: BackEndService) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        try {
            this.backEndService.refreshUser();
            return true;
        } catch (error) {
            console.log();
        }
        return this.backEndService.refreshUser();
    }
}
