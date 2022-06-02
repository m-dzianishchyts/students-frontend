import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { DatePipe } from "@angular/common";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatListModule } from "@angular/material/list";
import { MatSelectModule } from "@angular/material/select";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { CookieService } from "ngx-cookie-service";
import { LoggerModule, NgxLoggerLevel } from "ngx-logger";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";

import { MainComponent } from "./main/main.component";
import { TitleComponent } from "./title/title.component";

import { UploadFormComponent } from "./upload-form/upload-form.component";
import { PageAboutComponent } from "./_pages/page-about/page-about.component";
import { PageErrorComponent } from "./_pages/page-error/page-error.component";
import { PageQueueComponent } from "./_pages/page-queue/page-queue.component";
import { PageArchiveComponent } from "./_pages/page-archive/page-archive.component";
import { PageGroupsComponent } from "./_pages/page-groups/page-groups.component";
import { PageGroupComponent } from "./_pages/page-group/page-group.component";

import { PageUserProfileComponent } from "./_pages/page-user-profile/page-user-profile.component";
import { SignUpDialogComponent } from "./_dialogs/sign-up-dialog/sign-up-dialog.component";
import { SignInDialogComponent } from "./_dialogs/sign-in-dialog/sign-in-dialog.component";
import { InitialsPipe } from "./_pipes/initials/initials.pipe";

import { AuthenticationService } from "./_services/authentication.service";
import { AuthenticationGuard } from "./_guards/authentication-guard.service";
import { QueueAddDialogComponent } from "./_dialogs/queue-add-dialog/queue-add-dialog.component";
import { ConfirmationDialogComponent } from './_dialogs/confirmation-dialog/confirmation-dialog.component';
import { CreateQueueDialogComponent } from './_dialogs/create-queue-dialog/create-queue-dialog.component';
import { CreateGroupDialogComponent } from './_dialogs/create-group-dialog/create-group-dialog.component';
import { GroupAddDialogComponent } from './_dialogs/group-add-dialog/group-add-dialog.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,

        TitleComponent,

        UploadFormComponent,
        SignUpDialogComponent,
        SignInDialogComponent,

        PageAboutComponent,
        PageErrorComponent,
        PageQueueComponent,
        PageArchiveComponent,
        PageGroupsComponent,
        PageGroupComponent,
        PageUserProfileComponent,
        QueueAddDialogComponent,
        InitialsPipe,
        ConfirmationDialogComponent,
        CreateQueueDialogComponent,
        CreateGroupDialogComponent,
        GroupAddDialogComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,

        LoggerModule.forRoot({
            level: NgxLoggerLevel.DEBUG,
            timestampFormat: "MM/dd/yyyy HH:mm:ss.SSS",
            disableFileDetails: true,
        }),

        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatCardModule,
        MatTableModule,
        MatMenuModule,
        MatListModule,
        MatSelectModule,
        MatProgressSpinnerModule,
    ],
    providers: [DatePipe, AuthenticationService, AuthenticationGuard, CookieService],
    bootstrap: [AppComponent],
})
export class AppModule {}
