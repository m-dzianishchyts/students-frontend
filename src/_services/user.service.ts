import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";

import { environment } from "src/environments/environment";

import { User } from "../_models/user.js";

@Injectable({ providedIn: "root" })
export class UserService {
    userInfo = new BehaviorSubject<User | null>(null);

    constructor(private http: HttpClient) {
        this.userInfo.subscribe({ next: (value) => console.log(value) });
    }

    fetchUserInfo(): Observable<User> {
        console.log("Fetching user...");
        return this.http.get<User>(`${environment.apiUrl}/users/token`, {
            withCredentials: true,
        });
    }

    saveUserToLocalStorage(user: User) {
        console.log("Save user to localStorage.");
        this.userInfo.next(user);
        localStorage.setItem("user", JSON.stringify(user));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`);
    }
}
