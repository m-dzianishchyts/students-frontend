import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";

import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";

import { CookieService } from "ngx-cookie-service";

import { MatTableModule } from "@angular/material/table";

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
import { PageUserProfileComponent } from "./_pages/page-user-profile/page-user-profile.component";

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        MainComponent,

        TitleComponent,
        UploadFormComponent,
        PageAboutComponent,
        PageErrorComponent,
        PageQueueComponent,
        PageArchiveComponent,
        PageGroupsComponent,
        PageUserProfileComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,

        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule,
        MatCardModule,
        MatTableModule,
        MatMenuModule,
    ],
    providers: [CookieService],
    bootstrap: [AppComponent],
})
export class AppModule {}
