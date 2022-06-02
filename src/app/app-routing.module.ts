import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageAboutComponent } from "./_pages/page-about/page-about.component";
import { PageArchiveComponent } from "./_pages/page-archive/page-archive.component";
import { PageErrorComponent } from "./_pages/page-error/page-error.component";
import { PageGroupComponent } from "./_pages/page-group/page-group.component";
import { PageGroupsComponent } from "./_pages/page-groups/page-groups.component";
import { PageQueueComponent } from "./_pages/page-queue/page-queue.component";
import { AuthenticationGuard } from "./_guards/authentication-guard.service";

const routes: Routes = [
    { path: "", component: PageAboutComponent },
    { path: "about", component: PageAboutComponent },
    { path: "groups", component: PageGroupsComponent, canActivate: [AuthenticationGuard] },
    { path: "group/:id", component: PageGroupComponent, canActivate: [AuthenticationGuard] },
    { path: "queue/:id", component: PageQueueComponent, canActivate: [AuthenticationGuard] },
    { path: "archive", component: PageArchiveComponent, canActivate: [AuthenticationGuard] },
    { path: "**", pathMatch: "full", component: PageErrorComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
