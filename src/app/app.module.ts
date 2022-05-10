import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { PageAboutComponent } from './page-about/page-about.component';
import { MainComponent } from './main/main.component';
import { AppRoutingModule } from "./app-routing.module";
import { PageErrorComponent } from './page-error/page-error.component';
import { PageQueueComponent } from './page-queue/page-queue.component';
import { TitleComponent } from './title/title.component';
import { PageArchiveComponent } from './page-archive/page-archive.component';
import { UploadFormComponent } from './upload-form/upload-form.component';
import { FileComponent } from './file/file.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, PageAboutComponent, MainComponent, PageErrorComponent, PageQueueComponent, TitleComponent, PageArchiveComponent, UploadFormComponent, FileComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
