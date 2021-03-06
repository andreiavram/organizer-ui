import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { NavComponent } from './nav/nav.component';
import { FooterComponent } from './footer/footer.component';
import { TaskListComponent } from './task-list/task-list.component';
import {AppRoutingModule} from './app-routing/app-routing.module';
import {TaskItemService} from './task-item.service';
import {TruncatePipe} from './truncate.pipe';
import {TagService} from './tag.service';
import {TaskDetailsComponent} from './task-details/task-details.component';
import {FormsModule} from '@angular/forms';
import {Autosize} from 'ng-autosize';
import {TagInputModule} from 'ngx-chips';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { LuminancePipe } from './luminance.pipe';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    TaskListComponent,
    TruncatePipe,
    TaskDetailsComponent,
    Autosize,
    LuminancePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    TagInputModule,
    BrowserAnimationsModule
  ],
  providers: [TaskItemService, TagService],
  bootstrap: [AppComponent],
})
export class AppModule { }
