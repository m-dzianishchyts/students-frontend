import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { User } from "../_models/user.js";
import { BackEndService } from "./back-end.service";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
    constructor(private http: HttpClient, private backEndService: BackEndService) {}

    register(user: User): Observable<void> {
        console.log("Performing registration...");
        return this.http.post<void>(`${environment.apiUrl}/register`, user, { withCredentials: true });
    }

    authenticate(email: string, password: string): Observable<void> {
        console.log("Performing authentication...");
        return this.http.post<void>(`${environment.apiUrl}/authenticate`, { email, password }, { withCredentials: true });
    }

    logout(): Observable<void> {
        console.log("Logout.");
        this.backEndService.logout();
        return this.http.post<void>(`${environment.apiUrl}/logout`, {}, { withCredentials: true });
    }
}
