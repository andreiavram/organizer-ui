import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TaskListComponent} from './tasks/task-list/task-list.component';
import {TaskDetailComponent} from './tasks/task-detail/task-detail.component';
import {LoginComponent} from './login/login.component';
import {AuthenticatedGuard} from './authenticated-guard.service';
import {TagListComponent} from './tags/tags-list/tag-list.component';
import {TagDetailComponent} from './tags/tag-detail/tag-detail.component';
import {ProjectListComponent} from './projects/project-list/project-list.component';
import {ProjectDetailComponent} from './projects/project-details/project-detail.component';
import {ProjectFormComponent} from './projects/project-form/project-form.component';

const routes: Routes = [
  { path: '', redirectTo: '/task-list', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TaskListComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags', component: TagListComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags/create/', component: TagDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags/:id', component: TagDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'projects', component: ProjectListComponent, canActivate: [AuthenticatedGuard] },
  { path: 'projects/edit', component: ProjectFormComponent, canActivate: [AuthenticatedGuard] },
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'projects/:id/edit', component: ProjectFormComponent, canActivate: [AuthenticatedGuard] },

]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
