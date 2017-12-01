import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { TaskListComponent } from './task-list/task-list.component';
import {AppRoutingModule} from "./app-routing/app-routing.module";
import {TaskItemService} from "./task-item.service";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    TaskListComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [TaskItemService],
  bootstrap: [AppComponent]
})
export class AppModule { }
