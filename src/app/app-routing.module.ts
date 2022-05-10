import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAboutComponent } from "./page-about/page-about.component";
import { PageArchiveComponent } from "./page-archive/page-archive.component";
import { PageErrorComponent } from "./page-error/page-error.component";
import { PageQueueComponent } from "./page-queue/page-queue.component";

const routes: Routes = [
  { path: "", component: PageAboutComponent },
  { path: "about", component: PageAboutComponent },
  { path: "queue", component: PageQueueComponent },
  { path: "archive", component: PageArchiveComponent },
  { path: "**", pathMatch: "full", component: PageErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
