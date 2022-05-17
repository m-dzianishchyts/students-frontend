import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";

import { User } from "../_models/user.js";
import { UserService } from "./user.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    constructor(private http: HttpClient, private userService: UserService) {}

    register(user: User) {
        console.log("Performing registration...");
        return this.http.post<void>(`${environment.apiUrl}/register`, user, { withCredentials: true });
    }

    authenticate(email: string, password: string): Observable<void> {
        console.log("Performing authentication...");
        return this.http.post<void>(`${environment.apiUrl}/authenticate`, { email, password }, { withCredentials: true });
    }

    logout(): Observable<void> {
        localStorage.removeItem("user");
        this.userService.userInfo.next(null);
        return this.http.post<void>(`${environment.apiUrl}/logout`, {}, { withCredentials: true });
    }
}
