import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TasksComponent} from './tasks/tasks.component';
import {TaskDetailComponent} from './task-detail/task-detail.component';
import {LoginComponent} from './login/login.component';
import {AuthenticatedGuard} from './authenticated-guard.service';
import {TagsComponent} from './tags/tags.component';
import {TagDetailComponent} from './tag-detail/tag-detail.component';

const routes: Routes = [
  { path: '', redirectTo: '/tasks', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tasks/:id', component: TaskDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags', component: TagsComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags/create/', component: TagDetailComponent, canActivate: [AuthenticatedGuard] },
  { path: 'tags/:id', component: TagDetailComponent, canActivate: [AuthenticatedGuard] },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
