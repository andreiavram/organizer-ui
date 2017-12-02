import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpModule} from '@angular/http';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { TaskListComponent } from './task-list/task-list.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {TaskItemService} from './task-item.service';
import { TruncatePipe } from './truncate.pipe';
import {TagService} from './tag.service';
import { TaskDetailsComponent } from './task-details/task-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    TaskListComponent,
    TruncatePipe,
    TaskDetailsComponent,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [TaskItemService, TagService],
  bootstrap: [AppComponent],
})
export class AppModule { }
